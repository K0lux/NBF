import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

function isAdminRole(role: unknown) {
  return role === "admin"
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdminRole(user?.publicMetadata?.role)) return new NextResponse("Forbidden", { status: 403 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("trainee_groups")
    .select(`
      *,
      trainee_group_members(profile_id)
    `)
    .order("name", { ascending: true })

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdminRole(user?.publicMetadata?.role)) return new NextResponse("Forbidden", { status: 403 })

  const body = await req.json()
  const name = body?.name as string
  const description = body?.description as string | undefined
  const memberIds = (body?.memberIds ?? []) as string[]

  if (!name) return new NextResponse("Missing group name", { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data: group, error: groupError } = await supabase
    .from("trainee_groups")
    .insert({ name, description })
    .select("*")
    .single()

  if (groupError) return new NextResponse(groupError.message, { status: 500 })

  if (memberIds.length > 0) {
    const membershipRows = memberIds.map((profileId) => ({
      group_id: group.id,
      profile_id: profileId,
    }))
    const { error: memberError } = await supabase
      .from("trainee_group_members")
      .insert(membershipRows)
    if (memberError) return new NextResponse(memberError.message, { status: 500 })
  }

  return NextResponse.json(group)
}
