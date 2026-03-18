import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

function isAdminRole(role: unknown) {
  return role === "admin"
}

type BulkAction =
  | "archive"
  | "unarchive"
  | "set_access_level"
  | "set_role"
  | "set_stage_dates"
  | "set_intern_type"

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdminRole(user?.publicMetadata?.role)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const body = await req.json()
  const ids = (body?.ids ?? []) as string[]
  const action = body?.action as BulkAction

  if (!ids.length || !action) {
    return new NextResponse("Missing ids or action", { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  let updates: Record<string, unknown> = {}

  if (action === "archive") {
    updates = { is_archived: true, archived_at: new Date().toISOString() }
  } else if (action === "unarchive") {
    updates = { is_archived: false, archived_at: null }
  } else if (action === "set_access_level") {
    const accessLevel = body?.accessLevel as string
    if (!accessLevel) return new NextResponse("Missing accessLevel", { status: 400 })
    updates = { access_level: accessLevel }
  } else if (action === "set_role") {
    const role = body?.role as "admin" | "trainee"
    if (!role) return new NextResponse("Missing role", { status: 400 })
    updates = { role }
  } else if (action === "set_stage_dates") {
    updates = {
      start_date: body?.startDate ?? null,
      end_date: body?.endDate ?? null,
    }
  } else if (action === "set_intern_type") {
    const internType = body?.internType as "ON_SITE" | "REMOTE" | "HYBRID"
    if (!internType) return new NextResponse("Missing internType", { status: 400 })
    updates = { intern_type: internType }
  }

  const { error, count } = await supabase
    .from("profiles")
    .update(updates, { count: "exact" })
    .in("id", ids)

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json({ updatedCount: count ?? 0 })
}
