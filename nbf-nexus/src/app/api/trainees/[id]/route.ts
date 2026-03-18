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
  if (!isAdminRole(user?.publicMetadata?.role)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const { id } = await params
  const updates = await req.json()

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data)
}
