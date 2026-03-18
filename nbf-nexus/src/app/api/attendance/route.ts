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
  const type = searchParams.get("type")
  const supabase = createServerSupabaseClient()

  if (type === "by-schedule") {
    const scheduleId = searchParams.get("scheduleId")
    if (!scheduleId) return new NextResponse("Missing scheduleId", { status: 400 })

    const { data, error } = await supabase
      .from("attendances")
      .select("*")
      .eq("schedule_id", scheduleId)
      .maybeSingle()
    if (error) return new NextResponse(error.message, { status: 500 })
    return NextResponse.json(data)
  }

  if (type === "by-profile") {
    const profileId = searchParams.get("profileId")
    if (!profileId) return new NextResponse("Missing profileId", { status: 400 })
    if (!isAdmin && profileId !== userId) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { data, error } = await supabase
      .from("attendances")
      .select("*")
      .eq("profile_id", profileId)
      .order("updated_at", { ascending: false })
    if (error) return new NextResponse(error.message, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  if (type === "history") {
    const profileId = searchParams.get("profileId")
    if (!profileId) return new NextResponse("Missing profileId", { status: 400 })
    if (!isAdmin && profileId !== userId) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { data, error } = await supabase
      .from("attendances")
      .select(`
        *,
        schedule:schedules(scheduled_date)
      `)
      .eq("profile_id", profileId)
      .order("updated_at", { ascending: false })
    if (error) return new NextResponse(error.message, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  if (type === "today") {
    if (!isAdmin) return new NextResponse("Forbidden", { status: 403 })
    const today = new Date().toISOString().split("T")[0]
    const { data, error } = await supabase
      .from("attendances")
      .select(`
        *,
        profile:profiles(full_name, specialty),
        schedule:schedules(scheduled_date)
      `)
      .eq("schedule.scheduled_date", today)
    if (error) return new NextResponse(error.message, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  if (type === "filtered") {
    if (!isAdmin) return new NextResponse("Forbidden", { status: 403 })

    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined
    const profileId = searchParams.get("profileId") || undefined
    const specialty = searchParams.get("specialty") || undefined

    let query = supabase
      .from("attendances")
      .select(`
        *,
        profile:profiles!inner(full_name, specialty),
        schedule:schedules!inner(scheduled_date)
      `)

    if (startDate) query = query.gte("schedule.scheduled_date", startDate)
    if (endDate) query = query.lte("schedule.scheduled_date", endDate)
    if (profileId) query = query.eq("profile_id", profileId)
    if (specialty) query = query.eq("profile.specialty", specialty)

    const { data, error } = await query.order("check_in_at", { ascending: false })
    if (error) return new NextResponse(error.message, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  return new NextResponse("Unsupported attendance query type", { status: 400 })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  const isAdmin = isAdminRole(user?.publicMetadata?.role)
  const body = await req.json()

  const scheduleId = body?.scheduleId as string
  const profileId = body?.profileId as string
  const method = body?.method as string
  const coords = body?.coords as { lat?: number; long?: number } | undefined

  if (!scheduleId || !profileId || !method) {
    return new NextResponse("Missing required fields", { status: 400 })
  }
  if (!isAdmin && profileId !== userId) return new NextResponse("Forbidden", { status: 403 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("attendances")
    .upsert({
      schedule_id: scheduleId,
      profile_id: profileId,
      check_in_at: new Date().toISOString(),
      check_in_method: method,
      check_in_lat: coords?.lat,
      check_in_long: coords?.long,
    })
    .select()
    .single()

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const attendanceId = body?.attendanceId as string
  const method = body?.method as string
  const coords = body?.coords as { lat?: number; long?: number } | undefined

  if (!attendanceId || !method) {
    return new NextResponse("Missing attendanceId or method", { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  const { data: existing, error: existingError } = await supabase
    .from("attendances")
    .select("id, profile_id")
    .eq("id", attendanceId)
    .single()

  if (existingError) return new NextResponse(existingError.message, { status: 500 })
  if (existing.profile_id !== userId) {
    const user = await currentUser()
    if (!isAdminRole(user?.publicMetadata?.role)) {
      return new NextResponse("Forbidden", { status: 403 })
    }
  }

  const { data, error } = await supabase
    .from("attendances")
    .update({
      check_out_at: new Date().toISOString(),
      check_out_method: method,
      check_out_lat: coords?.lat,
      check_out_long: coords?.long,
    })
    .eq("id", attendanceId)
    .select()
    .single()

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data)
}
