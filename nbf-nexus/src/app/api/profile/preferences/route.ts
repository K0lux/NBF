import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("language, preferences")
    .eq("id", userId)
    .single()

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const language = body?.language as string | undefined
  const preferences = body?.preferences as Record<string, unknown> | undefined

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({ language, preferences })
    .eq("id", userId)
    .select("language, preferences")
    .single()

  if (error) return new NextResponse(error.message, { status: 500 })
  return NextResponse.json(data)
}
