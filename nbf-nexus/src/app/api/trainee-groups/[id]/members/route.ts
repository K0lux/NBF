import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

function isAdminRole(role: unknown) {
  return role === "admin"
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdminRole(user?.publicMetadata?.role)) return new NextResponse("Forbidden", { status: 403 })

  const { id } = await params
  const body = await req.json()
  const memberIds = (body?.memberIds ?? []) as string[]
  const mode = (body?.mode ?? "replace") as "replace" | "add" | "remove"

  const supabase = createServerSupabaseClient()

  if (mode === "replace") {
    const { error: deleteError } = await supabase
      .from("trainee_group_members")
      .delete()
      .eq("group_id", id)
    if (deleteError) return new NextResponse(deleteError.message, { status: 500 })
  }

  if ((mode === "replace" || mode === "add") && memberIds.length > 0) {
    const rows = memberIds.map((profileId) => ({ group_id: id, profile_id: profileId }))
    const { error: insertError } = await supabase
      .from("trainee_group_members")
      .upsert(rows, { onConflict: "group_id,profile_id" })
    if (insertError) return new NextResponse(insertError.message, { status: 500 })
  }

  if (mode === "remove" && memberIds.length > 0) {
    const { error: removeError } = await supabase
      .from("trainee_group_members")
      .delete()
      .eq("group_id", id)
      .in("profile_id", memberIds)
    if (removeError) return new NextResponse(removeError.message, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
