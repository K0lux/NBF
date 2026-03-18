import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/shared/lib/supabase/serverClient"

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const user = await currentUser()
  if (!user) {
    return new NextResponse("User not found", { status: 404 })
  }

  const email = user.primaryEmailAddress?.emailAddress
  if (!email) {
    return new NextResponse("User email is missing", { status: 400 })
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null
  const role = user.publicMetadata?.role === "admin" ? "admin" : "trainee"

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        clerk_id: userId,
        email,
        full_name: fullName,
        role,
      },
      { onConflict: "id" }
    )
    .select()
    .single()

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  return NextResponse.json(data)
}
