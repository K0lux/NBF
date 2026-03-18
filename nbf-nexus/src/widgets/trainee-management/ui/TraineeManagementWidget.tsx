"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { traineeApi } from "@/entities/trainee/api/traineeApi"
import { Trainee } from "@/entities/trainee/model/types"
import { TraineeDataTable } from "@/features/list-trainees/ui/TraineeDataTable"
import { getColumns } from "@/features/list-trainees/ui/columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { InviteTraineeModal } from "@/features/invite-trainee/ui/InviteTraineeModal"
import { useI18n } from "@/shared/lib/i18n/i18nContext"
import { RefreshCw } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { toast } from "sonner"

function getRemainingDuration(endDate: string | null | undefined): string {
  if (!endDate) return "N/A"
  const end = new Date(endDate)
  const now = new Date()
  const diffMs = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return "Finished"
  const months = Math.floor(diffDays / 30)
  const days = diffDays % 30
  return `${months} month(s) ${days} day(s)`
}

export function TraineeManagementWidget() {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const [includeArchived, setIncludeArchived] = React.useState(false)
  const [selectedTrainees, setSelectedTrainees] = React.useState<Trainee[]>([])

  const [groupName, setGroupName] = React.useState("")
  const [groupDescription, setGroupDescription] = React.useState("")
  const [selectedGroupId, setSelectedGroupId] = React.useState("")

  const [accessLevel, setAccessLevel] = React.useState("trainee")
  const [systemRole, setSystemRole] = React.useState<"admin" | "trainee">("trainee")
  const [internType, setInternType] = React.useState<"ON_SITE" | "REMOTE" | "HYBRID">("ON_SITE")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")

  const [subject, setSubject] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [channelEmail, setChannelEmail] = React.useState(true)
  const [channelWhatsapp, setChannelWhatsapp] = React.useState(false)
  const [channelSlack, setChannelSlack] = React.useState(false)
  const [channelSms, setChannelSms] = React.useState(false)
  const [targetMode, setTargetMode] = React.useState<"selected" | "group">("selected")

  const { data, isLoading, error } = useQuery({
    queryKey: ["trainees", includeArchived],
    queryFn: () => traineeApi.getTrainees(includeArchived),
  })

  const { data: groups } = useQuery({
    queryKey: ["trainee-groups"],
    queryFn: traineeApi.getGroups,
  })

  const onRefresh = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["trainees"] })
    queryClient.invalidateQueries({ queryKey: ["trainee-groups"] })
  }, [queryClient])

  const columns = React.useMemo(() => getColumns(onRefresh), [onRefresh])
  const selectedIds = React.useMemo(() => selectedTrainees.map((t) => t.id), [selectedTrainees])
  const selectedGroup = React.useMemo(
    () => (groups || []).find((group) => group.id === selectedGroupId),
    [groups, selectedGroupId]
  )
  const selectedGroupMemberIds = React.useMemo(
    () => selectedGroup?.trainee_group_members?.map((member) => member.profile_id) || [],
    [selectedGroup]
  )
  const selectedGroupMembers = React.useMemo(() => {
    if (!selectedGroupMemberIds.length) return []
    const traineesById = new Map((data || []).map((trainee) => [trainee.id, trainee]))
    return selectedGroupMemberIds.map((id) => traineesById.get(id)).filter(Boolean) as Trainee[]
  }, [selectedGroupMemberIds, data])

  const bulkAction = async (action: string, payload: Record<string, unknown> = {}) => {
    if (!selectedIds.length) {
      toast.error("Select at least one trainee")
      return
    }
    try {
      await traineeApi.bulkUpdate(selectedIds, action, payload)
      toast.success("Bulk update applied")
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error("Bulk update failed")
    }
  }

  const createGroupWithSelection = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required")
      return
    }
    if (!selectedIds.length) {
      toast.error("Select trainees first")
      return
    }
    try {
      await traineeApi.createGroup(groupName.trim(), groupDescription.trim(), selectedIds)
      toast.success("Group created")
      setGroupName("")
      setGroupDescription("")
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to create group")
    }
  }

  const addSelectionToGroup = async () => {
    if (!selectedGroupId || !selectedIds.length) {
      toast.error("Select a group and one or more trainees")
      return
    }
    try {
      await traineeApi.updateGroupMembers(selectedGroupId, selectedIds, "add")
      toast.success("Trainees added to group")
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to add members to group")
    }
  }

  const removeSelectionFromGroup = async () => {
    if (!selectedGroupId || !selectedIds.length) {
      toast.error("Select a group and one or more trainees")
      return
    }
    try {
      await traineeApi.updateGroupMembers(selectedGroupId, selectedIds, "remove")
      toast.success("Trainees removed from group")
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove members from group")
    }
  }

  const removeSingleMemberFromGroup = async (profileId: string) => {
    if (!selectedGroupId) return
    try {
      await traineeApi.updateGroupMembers(selectedGroupId, [profileId], "remove")
      toast.success("Member removed from group")
      onRefresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove member")
    }
  }

  const sendMessage = async () => {
    const channels = [
      channelEmail ? "email" : null,
      channelWhatsapp ? "whatsapp" : null,
      channelSlack ? "slack" : null,
      channelSms ? "sms" : null,
    ].filter(Boolean) as string[]

    if (!channels.length) {
      toast.error("Select at least one channel")
      return
    }
    if (!message.trim()) {
      toast.error("Message body is required")
      return
    }

    try {
      await traineeApi.sendMessage({
        channels,
        subject: subject.trim() || undefined,
        message: message.trim(),
        groupId: targetMode === "group" ? selectedGroupId || undefined : undefined,
        recipientIds: targetMode === "selected" ? selectedIds : undefined,
      })
      toast.success("Message dispatch queued")
      setSubject("")
      setMessage("")
    } catch (err) {
      console.error(err)
      toast.error("Failed to send message")
    }
  }

  if (isLoading) return <div className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> {t("loading")}</div>
  if (error) return <div>Error loading trainees</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{t("trainee_management")}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh} title={t("refresh")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant={includeArchived ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIncludeArchived((prev) => !prev)}
            >
              {includeArchived ? "Hide archived" : "Show archived"}
            </Button>
            <InviteTraineeModal />
          </div>
        </CardHeader>
        <CardContent>
          <TraineeDataTable 
            columns={columns} 
            data={data || []} 
            searchKey="full_name"
            onSelectedRowsChange={(rows) => setSelectedTrainees(rows as Trainee[])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unified Operations Console</CardTitle>
          <CardDescription>
            Select trainees from the table, then manage everything from this single form: roles/access, grouping, messaging, archiving, and stage duration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border p-4 space-y-2 max-h-56 overflow-auto bg-muted/20">
            {selectedTrainees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trainee selected.</p>
            ) : (
              selectedTrainees.map((trainee) => (
                <div key={trainee.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm border-b pb-2 last:border-b-0">
                  <div>
                    <p className="font-medium">{trainee.full_name || "Unnamed"}</p>
                    <p className="text-muted-foreground">{trainee.email}</p>
                  </div>
                  <div>
                    <p>Type: {trainee.intern_type}</p>
                    <p>Role: {trainee.role} / {trainee.access_level || "trainee"}</p>
                  </div>
                  <div>
                    <p>Start: {trainee.start_date || "N/A"}</p>
                    <p>End: {trainee.end_date || "N/A"}</p>
                    <p>Remaining: {getRemainingDuration(trainee.end_date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Role, Access, Internship & Stage Duration</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <Select value={systemRole} onValueChange={(v) => setSystemRole(v as "admin" | "trainee")}>
                <SelectTrigger><SelectValue placeholder="System role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="trainee">trainee</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => bulkAction("set_role", { role: systemRole })}>Apply system role</Button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                placeholder="Custom access level (secretary, mentor, director...)"
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
              />
              <Button onClick={() => bulkAction("set_access_level", { accessLevel })}>Apply access level</Button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <Select value={internType} onValueChange={(v) => setInternType(v as "ON_SITE" | "REMOTE" | "HYBRID")}>
                <SelectTrigger><SelectValue placeholder="Internship type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON_SITE">ON_SITE</SelectItem>
                  <SelectItem value="REMOTE">REMOTE</SelectItem>
                  <SelectItem value="HYBRID">HYBRID</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => bulkAction("set_intern_type", { internType })}>Apply intern type</Button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Button onClick={() => bulkAction("set_stage_dates", { startDate, endDate })} className="w-full">
              Apply stage duration
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="destructive" onClick={() => bulkAction("archive")}>Archive selected</Button>
              <Button variant="outline" onClick={() => bulkAction("unarchive")}>Unarchive selected</Button>
            </div>
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Group Management & Messaging (single form)</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                placeholder="New group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Input
                placeholder="Group description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>
            <Button onClick={createGroupWithSelection} className="w-full">Create group from selected</Button>

            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger><SelectValue placeholder="Select an existing group" /></SelectTrigger>
              <SelectContent>
                {(groups || []).map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.trainee_group_members?.length || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={addSelectionToGroup}>Add selected to group</Button>
              <Button variant="outline" onClick={removeSelectionFromGroup}>Remove selected from group</Button>
            </div>

            {selectedGroup && (
              <div className="rounded border p-3 space-y-2">
                <p className="text-sm font-medium">Members of {selectedGroup.name}</p>
                {selectedGroupMembers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No members in this group.</p>
                ) : (
                  selectedGroupMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between text-sm">
                      <span>{member.full_name || member.email}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => removeSingleMemberFromGroup(member.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="flex items-center gap-2"><input type="radio" checked={targetMode === "selected"} onChange={() => setTargetMode("selected")} /> Selected trainees</label>
              <label className="flex items-center gap-2"><input type="radio" checked={targetMode === "group"} onChange={() => setTargetMode("group")} /> Selected group</label>
            </div>

            <Input placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea
              className="w-full min-h-[120px] rounded-md border bg-transparent p-2 text-sm"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={channelEmail} onChange={(e) => setChannelEmail(e.target.checked)} /> Email</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={channelWhatsapp} onChange={(e) => setChannelWhatsapp(e.target.checked)} /> WhatsApp</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={channelSlack} onChange={(e) => setChannelSlack(e.target.checked)} /> Slack</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={channelSms} onChange={(e) => setChannelSms(e.target.checked)} /> SMS</label>
            </div>
            <p className="text-xs text-muted-foreground">
              Target mode "selected trainees" sends to your current selection. Target mode "selected group" sends to group members.
            </p>
            <Button onClick={sendMessage} className="w-full">Send message</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
