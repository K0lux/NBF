import * as React from "react"
import { AttendanceDashboardWidget } from "@/widgets/attendance-dashboard/ui/AttendanceDashboardWidget"
import { AdminAttendanceHistoryWidget } from "@/widgets/attendance-history/ui/AdminAttendanceHistoryWidget"

export default function AdminAttendancePage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-12">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Real-time Presence</h1>
            <p className="text-muted-foreground">
              Monitor today&apos;s trainee arrivals and check-in status.
            </p>
          </div>
          <AttendanceDashboardWidget />
        </div>

        <div className="border-t pt-12">
          <AdminAttendanceHistoryWidget />
        </div>
      </div>
    </main>
  )
}

