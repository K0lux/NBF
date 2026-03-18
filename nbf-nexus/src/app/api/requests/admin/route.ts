import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const user = await currentUser()
  const isAdmin = user?.publicMetadata?.role === "admin"
  if (!isAdmin) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("requests")
    .select(`
      *,
      profile:profiles(full_name, email)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
