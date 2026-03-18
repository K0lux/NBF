import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"
import { RequestType } from "@/entities/request/model/types"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const type = body?.type as RequestType
  const title = body?.title as string
  const description = body?.description as string
  const metadata = (body?.metadata ?? {}) as Record<string, unknown>

  if (!type || !title || !description) {
    return new NextResponse("Missing required fields", { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("requests")
    .insert({
      profile_id: userId,
      type,
      title,
      description,
      metadata,
    })
    .select()
    .single()

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json(data)
}
