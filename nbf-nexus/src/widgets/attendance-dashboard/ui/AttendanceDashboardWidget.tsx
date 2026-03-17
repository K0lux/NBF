"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { attendanceApi } from "@/entities/attendance/api/attendanceApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { Badge } from "@/shared/ui/badge"
import { format } from "date-fns"
import { CheckCircle2, Clock, MapPin, UserCheck, UserMinus } from "lucide-react"

export function AttendanceDashboardWidget() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["today-attendances"],
    queryFn: attendanceApi.getTodayAttendances,
    refetchInterval: 30000, // Refresh every 30 seconds for "real-time" feel
  })

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading real-time attendance...</div>
  if (error) return <div className="p-8 text-center text-destructive">Error loading attendance dashboard</div>

  const presentCount = data?.length || 0
  // Note: For a true "absent" count, we'd need to compare against all schedules for today.

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount}</div>
            <p className="text-xs text-muted-foreground">Successfully checked in</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest Check-in</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data && data.length > 0 
                ? format(new Date(data[0].check_in_at!), "HH:mm") 
                : "--:--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {data && data.length > 0 ? data[0].profile.full_name : "No data yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Location Tracking</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.filter(a => a.check_in_lat).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Check-ins with GPS</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check-in Logs</CardTitle>
          <CardDescription>Real-time stream of trainee arrivals</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainee</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell className="font-medium">{attendance.profile.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{attendance.profile.specialty}</Badge>
                    </TableCell>
                    <TableCell>
                      {attendance.check_in_at 
                        ? format(new Date(attendance.check_in_at), "HH:mm:ss") 
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{attendance.check_in_method}</Badge>
                    </TableCell>
                    <TableCell>
                      {attendance.check_in_lat ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>Pinned</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No arrivals recorded for today yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
