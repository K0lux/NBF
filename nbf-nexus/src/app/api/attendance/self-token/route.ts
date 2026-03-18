import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"
import { calculateDistance } from "@/shared/config/attendance"
import { generateAttendanceToken } from "@/entities/attendance/lib/attendanceTokens"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const coords = body?.coords as { lat?: number; long?: number } | undefined

  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const [{ data: profile, error: profileError }, { data: schedule, error: scheduleError }, { data: settings, error: settingsError }] =
    await Promise.all([
      supabase.from("profiles").select("id, intern_type").eq("id", userId).single(),
      supabase
        .from("schedules")
        .select("id, profile_id, scheduled_date")
        .eq("profile_id", userId)
        .eq("scheduled_date", today)
        .maybeSingle(),
      supabase.from("app_settings").select("*").eq("id", 1).single(),
    ])

  if (profileError) return new NextResponse(profileError.message, { status: 500 })
  if (scheduleError) return new NextResponse(scheduleError.message, { status: 500 })
  if (settingsError) return new NextResponse(settingsError.message, { status: 500 })

  if (!schedule) {
    return new NextResponse("No assignment found for today", { status: 403 })
  }

  if (profile.intern_type === "REMOTE") {
    return new NextResponse("Remote interns cannot generate on-site QR check-in", { status: 403 })
  }

  if (profile.intern_type === "HYBRID" && !settings.allow_hybrid_if_assigned) {
    return new NextResponse("Hybrid QR check-in is disabled by admin settings", { status: 403 })
  }

  if (profile.intern_type === "ON_SITE" && settings.require_geolocation_on_site) {
    if (!coords?.lat || !coords?.long) {
      return new NextResponse("Geolocation is required for on-site interns", { status: 400 })
    }

    const distance = calculateDistance(
      coords.lat,
      coords.long,
      settings.workspace_latitude,
      settings.workspace_longitude
    )

    if (distance > settings.geofence_radius_meters) {
      return new NextResponse(
        `Outside allowed geofence (${Math.round(distance)}m > ${settings.geofence_radius_meters}m)`,
        { status: 403 }
      )
    }
  }

  const token = await generateAttendanceToken({
    scheduleId: schedule.id,
    profileId: userId,
  })

  return NextResponse.json({ token })
}
