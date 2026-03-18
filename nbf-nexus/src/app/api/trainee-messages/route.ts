import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

function isAdminRole(role: unknown) {
  return role === "admin"
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const user = await currentUser()
  if (!isAdminRole(user?.publicMetadata?.role)) return new NextResponse("Forbidden", { status: 403 })

  const body = await req.json()
  const channels = (body?.channels ?? []) as string[]
  const subject = (body?.subject ?? null) as string | null
  const message = body?.message as string
  const groupId = body?.groupId as string | undefined
  const recipientIds = (body?.recipientIds ?? []) as string[]

  if (!channels.length) return new NextResponse("At least one channel is required", { status: 400 })
  if (!message) return new NextResponse("Message is required", { status: 400 })

  const supabase = createServerSupabaseClient()
  let targetIds = [...recipientIds]
  let scope: "individual" | "group" | "bulk" = recipientIds.length > 1 ? "bulk" : "individual"

  if (groupId) {
    scope = "group"
    const { data: members, error: membersError } = await supabase
      .from("trainee_group_members")
      .select("profile_id")
      .eq("group_id", groupId)
    if (membersError) return new NextResponse(membersError.message, { status: 500 })
    targetIds = members?.map((m) => m.profile_id) ?? []
  }

  targetIds = Array.from(new Set(targetIds))
  if (!targetIds.length) return new NextResponse("No recipients resolved", { status: 400 })

  const { data: broadcast, error: broadcastError } = await supabase
    .from("message_broadcasts")
    .insert({
      scope,
      channels,
      subject,
      body: message,
      status: "sent",
      created_by: userId,
    })
    .select("*")
    .single()

  if (broadcastError) return new NextResponse(broadcastError.message, { status: 500 })

  const recipientsRows = targetIds.flatMap((profileId) =>
    channels.map((channel) => ({
      broadcast_id: broadcast.id,
      profile_id: profileId,
      channel,
      status: "sent",
      sent_at: new Date().toISOString(),
    }))
  )

  const { error: recipientsError } = await supabase.from("message_recipients").insert(recipientsRows)
  if (recipientsError) return new NextResponse(recipientsError.message, { status: 500 })

  // Placeholder status "sent" is persisted; actual channel integration can be plugged here.
  return NextResponse.json({ success: true, recipients: targetIds.length, channels: channels.length })
}
