"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { attendanceApi } from "@/entities/attendance/api/attendanceApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { format } from "date-fns"
import { User, MapPin, Search, Calendar, Filter, Download } from "lucide-react"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"

export function AdminAttendanceHistoryWidget() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filters, setFilters] = React.useState({
    startDate: "",
    endDate: "",
    specialty: "ALL"
  })
  
  const { data: allHistory, isLoading } = useQuery({
    queryKey: ["admin-attendance-history", filters],
    queryFn: () => attendanceApi.getFilteredAttendances({
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      specialty: filters.specialty === "ALL" ? undefined : filters.specialty
    }),
  })

  const filtered = allHistory?.filter(a => 
    a.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExport = () => {
    if (!filtered) return
    const csv = [
      ["Trainee", "Date", "Check-in", "Check-out", "Method", "Location"],
      ...filtered.map(r => [
        r.profile.full_name,
        r.schedule.scheduled_date,
        r.check_in_at || "",
        r.check_out_at || "",
        r.check_in_method,
        r.check_in_lat ? `${r.check_in_lat},${r.check_in_long}` : ""
      ])
    ].map(e => e.join(",")).join("\n")

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance Logs</h2>
          <p className="text-muted-foreground">Comprehensive logs of all trainee check-ins and geolocations.</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={!filtered || filtered.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trainee..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input 
                type="date" 
                placeholder="Start Date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input 
                type="date" 
                placeholder="End Date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={filters.specialty} 
                onValueChange={(v) => setFilters({...filters, specialty: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Specialties</SelectItem>
                  <SelectItem value="DEV">Development</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="NET_SEC">Network & Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading logs...</TableCell>
                </TableRow>
              ) : filtered && filtered.length > 0 ? (
                filtered.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{record.profile.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.schedule.scheduled_date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {record.check_in_at ? format(new Date(record.check_in_at), "HH:mm") : "--:--"}
                      <Badge variant="secondary" className="ml-2 text-[8px] uppercase">{record.check_in_method}</Badge>
                    </TableCell>
                    <TableCell>
                      {record.check_out_at ? format(new Date(record.check_out_at), "HH:mm") : "--:--"}
                    </TableCell>
                    <TableCell>
                      {record.check_in_lat ? (
                        <div className="text-[10px] text-muted-foreground flex flex-col">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-2 w-2" />
                            {record.check_in_lat.toFixed(4)}, {record.check_in_long?.toFixed(4)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None recorded</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No matching attendance logs found.
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
