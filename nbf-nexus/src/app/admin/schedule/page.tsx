import * as React from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ScheduleCalendarWidget } from "@/widgets/schedule-calendar/ui/ScheduleCalendarWidget"

export default async function Page() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  if (user?.publicMetadata?.role !== "admin") {
    redirect("/")
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Schedule</h1>
          <p className="text-muted-foreground">
            Manage and view trainee assignments across the calendar.
          </p>
        </div>
        
        <ScheduleCalendarWidget />
      </div>
    </main>
  )
}
