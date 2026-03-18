import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (user?.publicMetadata?.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const { id } = await params
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("schedules").delete().eq("id", id)

  if (error) return new NextResponse(error.message, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
