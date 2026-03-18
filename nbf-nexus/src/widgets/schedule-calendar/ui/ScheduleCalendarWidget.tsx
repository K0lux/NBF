"use client"

import * as React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import frLocale from "@fullcalendar/core/locales/fr"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"

import { scheduleApi } from "@/entities/schedule/api/scheduleApi"
import { ScheduleCalendarEvent } from "@/entities/schedule/ui/ScheduleCalendarEvent"
import { AssignSlotModal } from "@/features/assign-schedule-slot/ui/AssignSlotModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export function ScheduleCalendarWidget() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
  const [currentViewDate, setCurrentViewDate] = React.useState(new Date())

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["schedules", currentViewDate.getFullYear(), currentViewDate.getMonth()],
    queryFn: () => scheduleApi.getSchedulesByMonth(currentViewDate.getFullYear(), currentViewDate.getMonth()),
  })

  const handleDateClick = (arg: { date: Date }) => {
    setSelectedDate(arg.date)
    setModalOpen(true)
  }

  const handleDatesSet = (arg: { view: { currentStart: Date } }) => {
    // Note: FullCalendar's currentStart might be slightly before the 1st of the month
    // if it shows some days from previous month. We want the mid-month date to be safe.
    const midMonth = new Date(arg.view.currentStart.getTime() + 15 * 24 * 60 * 60 * 1000)
    setCurrentViewDate(midMonth)
  }

  const events = React.useMemo(() => {
    return schedules?.map((s) => ({
      id: s.id,
      title: s.profile.full_name || "Unknown",
      start: s.scheduled_date,
      extendedProps: { schedule: s },
    })) || []
  }, [schedules])

  const handleUnassign = async (scheduleId: string) => {
    const confirmed = window.confirm("Desassigner ce stagiaire de ce jour ?")
    if (!confirmed) return

    try {
      await scheduleApi.deleteScheduleEntry(scheduleId)
      toast.success("Assignation supprimee")
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
    } catch {
      toast.error("Echec de la desassignation")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Master Schedule</CardTitle>
        <Button onClick={() => { setSelectedDate(new Date()); setModalOpen(true); }} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Quick Assign
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="py-4 text-center">Loading schedules...</div>}
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            locale={frLocale}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            datesSet={handleDatesSet}
            eventContent={(eventInfo) => (
              <ScheduleCalendarEvent
                schedule={eventInfo.event.extendedProps.schedule}
                onUnassign={handleUnassign}
              />
            )}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            height="auto"
            aspectRatio={1.5}
          />
        </div>

        <AssignSlotModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["schedules"] })}
          initialDate={selectedDate}
        />
      </CardContent>
      <style jsx global>{`
        .fc {
          font-family: inherit;
          color: var(--foreground);
        }
        .fc-theme-standard .fc-scrollgrid,
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: var(--border);
          background: transparent;
        }
        .fc .fc-col-header-cell-cushion,
        .fc .fc-daygrid-day-number,
        .fc .fc-toolbar-title {
          color: var(--foreground);
        }
        .fc .fc-col-header-cell {
          background: color-mix(in oklab, var(--muted) 45%, transparent);
        }
        .fc .fc-col-header-cell-cushion {
          font-weight: 600;
          opacity: 0.95;
        }
        .fc .fc-button-primary {
          background-color: var(--primary);
          border-color: var(--primary);
          color: var(--primary-foreground);
        }
        .fc .fc-button-primary:hover {
          background-color: color-mix(in oklab, var(--primary) 85%, black);
          border-color: color-mix(in oklab, var(--primary) 85%, black);
          color: var(--primary-foreground);
        }
        .fc .fc-button-primary:focus,
        .fc .fc-button-primary:active {
          background-color: color-mix(in oklab, var(--primary) 80%, black);
          border-color: color-mix(in oklab, var(--primary) 80%, black);
          color: var(--primary-foreground);
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .fc .fc-daygrid-day.fc-day-today {
          background-color: var(--accent);
        }
        .fc .fc-daygrid-event,
        .fc .fc-event {
          background: transparent;
          border: 0;
          color: inherit;
        }
      `}</style>
    </Card>
  )
}
