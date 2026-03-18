import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { verifyAttendanceToken } from "@/entities/attendance/lib/attendanceTokens"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"
import { calculateDistance } from "@/shared/config/attendance"

type ScanAction = "arrival" | "departure"

function buildPersonalizedMessage(fullName: string, action: ScanAction, time: string) {
  if (action === "arrival") {
    return `Bienvenue ${fullName}. Votre arrivee a ete enregistree a ${time}.`
  }
  return `Au revoir ${fullName}. Votre depart a ete enregistre a ${time}.`
}

export async function POST(req: Request) {
  const { userId } = await auth()

  const body = await req.json()
  const token = body?.token as string | undefined
  const coords = body?.coords as { lat?: number; long?: number } | undefined
  const hasValidCoords =
    typeof coords?.lat === "number" &&
    Number.isFinite(coords.lat) &&
    typeof coords?.long === "number" &&
    Number.isFinite(coords.long)

  if (!token) return new NextResponse("Missing token", { status: 400 })

  const payload = await verifyAttendanceToken(token)
  if (!payload) return new NextResponse("Invalid or expired token", { status: 400 })

  const { scheduleId, profileId } = payload
  if (userId && profileId !== userId) {
    return new NextResponse("Token does not match current user", { status: 403 })
  }

  const supabase = createServerSupabaseClient()
  const [{ data: profile, error: profileError }, { data: settings, error: settingsError }, { data: existing, error: existingError }] =
    await Promise.all([
      supabase.from("profiles").select("id, full_name, intern_type").eq("id", profileId).single(),
      supabase.from("app_settings").select("*").eq("id", 1).single(),
      supabase
        .from("attendances")
        .select("*")
        .eq("schedule_id", scheduleId)
        .eq("profile_id", profileId)
        .maybeSingle(),
    ])

  if (profileError) return new NextResponse(profileError.message, { status: 500 })
  if (settingsError) return new NextResponse(settingsError.message, { status: 500 })
  if (existingError) return new NextResponse(existingError.message, { status: 500 })
  
  const fullName = profile.full_name || "stagiaire"

  const requiresGeo = profile.intern_type === "ON_SITE" && settings.require_geolocation_on_site
  if (requiresGeo && !hasValidCoords) {
    return new NextResponse("Geolocation is required for on-site check-in/check-out", { status: 400 })
  }

  if (hasValidCoords) {
    const distance = calculateDistance(
      coords!.lat!,
      coords!.long!,
      settings.workspace_latitude,
      settings.workspace_longitude
    )
    if (distance > settings.geofence_radius_meters) {
      return new NextResponse(
        `Geofencing check failed: vous etes a environ ${Math.round(distance)}m du site, rayon autorise ${settings.geofence_radius_meters}m.`,
        { status: 403 }
      )
    }
  }

  const nowIso = new Date().toISOString()
  const time = new Date(nowIso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  if (!existing) {
    const { error } = await supabase.from("attendances").insert({
      schedule_id: scheduleId,
      profile_id: profileId,
      check_in_at: nowIso,
      check_in_method: "QR_CODE",
      check_in_lat: hasValidCoords ? coords!.lat : null,
      check_in_long: hasValidCoords ? coords!.long : null,
    })
    if (error) return new NextResponse(error.message, { status: 500 })

    return NextResponse.json({
      success: true,
      action: "arrival",
      message: buildPersonalizedMessage(fullName, "arrival", time),
    })
  }

  if (!existing.check_out_at) {
    const { error } = await supabase
      .from("attendances")
      .update({
        check_out_at: nowIso,
        check_out_method: "QR_CODE",
        check_out_lat: hasValidCoords ? coords!.lat : null,
        check_out_long: hasValidCoords ? coords!.long : null,
      })
      .eq("id", existing.id)
    if (error) return new NextResponse(error.message, { status: 500 })

    return NextResponse.json({
      success: true,
      action: "departure",
      message: buildPersonalizedMessage(fullName, "departure", time),
    })
  }

  return new NextResponse("Attendance already completed for this session", { status: 409 })
}
