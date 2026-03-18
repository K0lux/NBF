import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

function isAdminRole(role: unknown) {
  return role === "admin"
}

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdminRole(user?.publicMetadata?.role)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const includeArchived = searchParams.get("includeArchived") === "true"

  const supabase = createServerSupabaseClient()
  let query = supabase
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true })

  if (!includeArchived) {
    query = query.eq("is_archived", false)
  }

  const { data, error } = await query

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data ?? [])
}
