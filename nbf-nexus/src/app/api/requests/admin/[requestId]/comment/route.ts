import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const user = await currentUser()
  const isAdmin = user?.publicMetadata?.role === "admin"
  if (!isAdmin) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const { requestId } = await params
  const body = await req.json()
  const adminComment = body?.adminComment as string

  if (typeof adminComment !== "string") {
    return new NextResponse("Missing adminComment", { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("requests")
    .update({
      admin_comment: adminComment,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single()

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json(data)
}
