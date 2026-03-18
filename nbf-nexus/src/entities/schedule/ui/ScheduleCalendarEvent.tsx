import * as React from "react"
import { ScheduleWithTrainee } from "../model/types";
import { cn } from "@/shared/lib/utils";
import { GenerateAttendanceQR } from "@/features/generate-attendance-qr/ui/GenerateAttendanceQR";
import { Trash2 } from "lucide-react";

interface ScheduleCalendarEventProps {
  schedule: ScheduleWithTrainee;
  className?: string;
  showQR?: boolean;
  onUnassign?: (scheduleId: string) => void;
}

const specialtyStyles: Record<string, string> = {
  DEV: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  AI: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  NET_SEC: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
};

export function ScheduleCalendarEvent({ schedule, className, showQR = true, onUnassign }: ScheduleCalendarEventProps) {
  const specialty = schedule.profile.specialty || "DEV";
  const style = specialtyStyles[specialty] || specialtyStyles.DEV;

  return (
    <div className={cn(
      "flex flex-row items-center justify-between gap-1 rounded border px-1.5 py-1 text-[10px] sm:text-xs min-w-0 group",
      style,
      className
    )}>
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <span className="font-semibold truncate">
          {schedule.profile.full_name}
        </span>
        <span className="opacity-70 text-[9px] sm:text-[10px] truncate">
          {specialty}
        </span>
      </div>

      {showQR && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
          <GenerateAttendanceQR 
            scheduleId={schedule.id}
            profileId={schedule.profile_id}
            traineeName={schedule.profile.full_name || "Trainee"}
          />
          {onUnassign && (
            <button
              type="button"
              aria-label="Unassign trainee from this date"
              title="Unassign"
              className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-destructive/10 text-destructive"
              onClick={(event) => {
                event.stopPropagation()
                onUnassign(schedule.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

