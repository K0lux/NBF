import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { generateAttendanceToken } from "@/entities/attendance/lib/attendanceTokens"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const user = await currentUser()
  if (user?.publicMetadata?.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const body = await req.json()
  const scheduleId = body?.scheduleId as string
  const profileId = body?.profileId as string

  if (!scheduleId || !profileId) {
    return new NextResponse("Missing scheduleId or profileId", { status: 400 })
  }

  const token = await generateAttendanceToken({ scheduleId, profileId })
  return NextResponse.json({ token })
}
