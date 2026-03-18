"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

type AdminSettings = {
  workspace_latitude: number
  workspace_longitude: number
  geofence_radius_meters: number
  require_geolocation_on_site: boolean
  allow_hybrid_if_assigned: boolean
}

export function AdminSettingsForm() {
  const queryClient = useQueryClient()
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState<AdminSettings | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings")
      if (!response.ok) throw new Error(await response.text())
      return (await response.json()) as AdminSettings
    },
  })

  React.useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const save = async () => {
    if (!form) return
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error(await response.text())

      toast.success("Settings saved")
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] })
    } catch (error) {
      console.error(error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Rules</CardTitle>
        <CardDescription>
          Rules that control who can check in and when the trainee QR code can be generated.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Workspace Latitude</Label>
            <Input
              type="number"
              step="0.000001"
              value={form.workspace_latitude}
              onChange={(e) => setForm({ ...form, workspace_latitude: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Workspace Longitude</Label>
            <Input
              type="number"
              step="0.000001"
              value={form.workspace_longitude}
              onChange={(e) => setForm({ ...form, workspace_longitude: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Geofence Radius (meters)</Label>
          <Input
            type="number"
            min={10}
            value={form.geofence_radius_meters}
            onChange={(e) => setForm({ ...form, geofence_radius_meters: Number(e.target.value) })}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>On-site Geolocation</Label>
            <Select
              value={String(form.require_geolocation_on_site)}
              onValueChange={(value) => setForm({ ...form, require_geolocation_on_site: value === "true" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Required</SelectItem>
                <SelectItem value="false">Optional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Hybrid Rule</Label>
            <Select
              value={String(form.allow_hybrid_if_assigned)}
              onValueChange={(value) => setForm({ ...form, allow_hybrid_if_assigned: value === "true" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Allow if assigned</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
