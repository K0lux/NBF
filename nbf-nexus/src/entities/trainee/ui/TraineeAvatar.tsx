import * as React from "react"
import { cn } from "@/shared/lib/utils"

interface TraineeAvatarProps {
  fullName: string | null;
  className?: string;
}

export function TraineeAvatar({ fullName, className }: TraineeAvatarProps) {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
        {initials}
      </div>
      <span className="text-sm font-medium">{fullName || "Unknown Trainee"}</span>
    </div>
  );
}
