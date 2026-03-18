"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { scheduleApi } from "@/entities/schedule"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { format } from "date-fns"
import { useUser } from "@clerk/nextjs"
import { AttendanceHistoryWidget } from "@/widgets/attendance-history"
import { useI18n } from "@/shared/lib"

export function MySchedulePage() {
  const { user } = useUser()
  const { t } = useI18n()
  const currentViewDate = new Date()
  
  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ["my-schedules", currentViewDate.getFullYear(), currentViewDate.getMonth()],
    queryFn: () => scheduleApi.getSchedulesByMonth(currentViewDate.getFullYear(), currentViewDate.getMonth()),
  })
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("my_schedule_title")}</h1>
            <p className="text-muted-foreground">
              {t("my_schedule_description")}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("upcoming_assignments")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="text-center py-4">{t("loading_schedule")}</div>}
              {error && <div className="text-center py-4 text-destructive">Error loading schedule</div>}
              
              {schedules && schedules.length > 0 ? (
                <div className="grid gap-4">
                  {schedules.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                      <div className="font-semibold text-sm sm:text-base">
                        {format(new Date(s.scheduled_date), "EEEE, MMMM do, yyyy")}
                      </div>
                      <div className="text-xs sm:text-sm px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                        {s.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !isLoading && <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                  {t("no_assignments")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="border-t pt-12">
          {user?.id && <AttendanceHistoryWidget profileId={user.id} />}
        </div>
      </div>
    </main>
  )
}
