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
  const isAdmin = isAdminRole(user?.publicMetadata?.role)

  const { searchParams } = new URL(req.url)
  const year = Number(searchParams.get("year"))
  const month = Number(searchParams.get("month"))

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return new NextResponse("Invalid year or month", { status: 400 })
  }

  const startDate = new Date(year, month, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0]

  const supabase = createServerSupabaseClient()
  let query = supabase
    .from("schedules")
    .select(`
      *,
      profile:profiles(id, full_name, email, specialty)
    `)
    .gte("scheduled_date", startDate)
    .lte("scheduled_date", endDate)
    .order("scheduled_date", { ascending: true })

  if (!isAdmin) {
    query = query.eq("profile_id", userId)
  }

  const { data, error } = await query
  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdminRole(user?.publicMetadata?.role)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const body = await req.json()
  const profileId = body?.profileId as string
  const date = body?.date as string

  if (!profileId || !date) {
    return new NextResponse("Missing profileId or date", { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("schedules")
    .insert({
      profile_id: profileId,
      scheduled_date: date,
      status: "PLANNED",
    })
    .select()
    .single()

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data)
}
