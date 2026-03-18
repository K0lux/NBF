import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

function isAdmin(role: unknown) {
  return role === "admin"
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdmin(user?.publicMetadata?.role)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("app_settings").select("*").eq("id", 1).single()
  if (error) return new NextResponse(error.message, { status: 500 })

  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdmin(user?.publicMetadata?.role)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const payload = await req.json()
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("app_settings")
    .update({
      workspace_latitude: payload.workspace_latitude,
      workspace_longitude: payload.workspace_longitude,
      geofence_radius_meters: payload.geofence_radius_meters,
      require_geolocation_on_site: payload.require_geolocation_on_site,
      allow_hybrid_if_assigned: payload.allow_hybrid_if_assigned,
    })
    .eq("id", 1)
    .select("*")
    .single()

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data)
}
