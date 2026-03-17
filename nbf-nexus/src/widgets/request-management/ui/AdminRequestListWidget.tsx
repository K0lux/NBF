"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { requestApi } from "@/entities/request/api/requestApi"
import { RequestStatus } from "@/entities/request/model/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { format } from "date-fns"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  MessageSquare,
  User,
  Edit2,
  Save,
  X
} from "lucide-react"
import { toast } from "sonner"
import { useI18n } from "@/shared/lib/i18n/i18nContext"

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  APPROVED: "secondary",
  REJECTED: "destructive",
}

export function AdminRequestListWidget() {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const [commentMap, setCommentMap] = React.useState<Record<string, string>>({})
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null)
  const [processing, setProcessing] = React.useState<string | null>(null)

  const { data: requests, isLoading } = useQuery({
    queryKey: ["all-requests"],
    queryFn: requestApi.getAllRequests,
  })

  const handleStatusUpdate = async (id: string, status: RequestStatus) => {
    setProcessing(id)
    try {
      await requestApi.updateRequestStatus(id, status, commentMap[id])
      toast.success(t("success_message"))
      queryClient.invalidateQueries({ queryKey: ["all-requests"] })
    } catch (err) {
      toast.error(t("error_message"))
    } finally {
      setProcessing(null)
    }
  }

  const handleCommentUpdate = async (id: string) => {
    setProcessing(id)
    try {
      await requestApi.updateAdminComment(id, commentMap[id])
      toast.success(t("success_message"))
      setEditingCommentId(null)
      queryClient.invalidateQueries({ queryKey: ["all-requests"] })
    } catch (err) {
      toast.error(t("error_message"))
    } finally {
      setProcessing(null)
    }
  }

  const startEditing = (id: string, currentComment: string | null) => {
    setCommentMap({ ...commentMap, [id]: currentComment || "" })
    setEditingCommentId(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("manage_requests")}</h2>
          <p className="text-muted-foreground">{t("manage_requests_description")}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center py-20">{t("loading_requests")}</div>
        ) : requests && requests.length > 0 ? (
          requests.map((request) => (
            <Card key={request.id} className={request.status === 'PENDING' ? "border-l-4 border-l-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{request.type === 'SCHEDULE_CHANGE' ? t("schedule_change") : t("presentation_slot")}</Badge>
                      <Badge variant={statusVariants[request.status]}>{request.status}</Badge>
                    </div>
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="font-medium">{request.profile.full_name}</span>
                      <span>({request.profile.email})</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="flex items-center md:justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{t("submitted_on")} {format(new Date(request.created_at), "MMM dd, HH:mm")}</span>
                    </div>
                    {request.metadata?.targetDate && (
                      <div className="mt-1 font-semibold text-primary">
                        {t("target_date")}: {request.metadata.targetDate}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-md bg-muted/30 border text-sm">
                  {request.description}
                </div>

                {request.status === 'PENDING' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder={t("add_comment_placeholder")} 
                        value={commentMap[request.id] || ""}
                        onChange={(e) => setCommentMap({ ...commentMap, [request.id]: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                        disabled={processing === request.id}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {t("reject")}
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                        disabled={processing === request.id}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {t("approve")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editingCommentId === request.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <Input 
                            value={commentMap[request.id] || ""}
                            onChange={(e) => setCommentMap({ ...commentMap, [request.id]: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditingCommentId(null)}
                            disabled={processing === request.id}
                          >
                            <X className="mr-2 h-4 w-4" />
                            {t("cancel")}
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleCommentUpdate(request.id)}
                            disabled={processing === request.id}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {t("save_changes")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      request.admin_comment && (
                        <div className="group relative p-3 rounded-md bg-muted/50 border border-dashed text-xs">
                          <span className="font-bold block mb-1 uppercase text-[9px] opacity-70">{t("admin_decision_comment")}</span>
                          <p>{request.admin_comment}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Edit comment"
                            className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => startEditing(request.id, request.admin_comment)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    )}
                    {!request.admin_comment && editingCommentId !== request.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Add comment"
                        className="text-muted-foreground h-auto p-0 hover:bg-transparent"
                        onClick={() => startEditing(request.id, "")}
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
                        {t("add_comment")}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            {t("no_requests_system")}
          </div>
        )}
      </div>
    </div>
  )
}
