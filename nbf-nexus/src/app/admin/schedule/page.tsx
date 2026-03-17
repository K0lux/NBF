import * as React from "react"
import { ScheduleCalendarWidget } from "@/widgets/schedule-calendar/ui/ScheduleCalendarWidget"

export default function AdminSchedulePage() {
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
