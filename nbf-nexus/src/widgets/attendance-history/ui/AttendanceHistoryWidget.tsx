"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { attendanceApi } from "@/entities/attendance/api/attendanceApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { Badge } from "@/shared/ui/badge"
import { format } from "date-fns"
import { MapPin, Clock } from "lucide-react"

interface AttendanceHistoryWidgetProps {
  profileId: string;
}

export function AttendanceHistoryWidget({ profileId }: AttendanceHistoryWidgetProps) {
  const { data: history, isLoading } = useQuery({
    queryKey: ["attendance-history", profileId],
    queryFn: () => attendanceApi.getAttendanceHistoryByProfileId(profileId),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
        <CardDescription>Review your past session arrivals and departures.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-10">Loading history...</div>
        ) : history && history.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {format(new Date(record.schedule.scheduled_date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {record.check_in_at ? format(new Date(record.check_in_at), "HH:mm") : "--:--"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {record.check_out_at ? format(new Date(record.check_out_at), "HH:mm") : "--:--"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {record.check_in_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.check_in_lat ? (
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <MapPin className="h-2 w-2" /> Verified
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">--</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-10 text-center text-muted-foreground italic">
            No attendance records found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
