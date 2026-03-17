"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { requestApi } from "@/entities/request/api/requestApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { format } from "date-fns"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { CreateRequestForm } from "@/features/create-request/ui/CreateRequestForm"
import { PlusCircle } from "lucide-react"
import { useI18n } from "@/shared/lib/i18n/i18nContext"
import { useSupabase } from "@/shared/lib/supabase/useSupabase"

interface RequestListWidgetProps {
  profileId: string;
}

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  APPROVED: "secondary", // Use secondary for success feel in shadcn default
  REJECTED: "destructive",
}

export function RequestListWidget({ profileId }: RequestListWidgetProps) {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const [modalOpen, setModalOpen] = React.useState(false)
  const supabase = useSupabase()

  const { data: requests, isLoading } = useQuery({
    queryKey: ["requests", profileId],
    queryFn: () => requestApi.getMyRequests(supabase, profileId),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("my_requests_title")}</h2>
          <p className="text-muted-foreground">{t("my_requests_description")}</p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-primary/20 transition-all">
              <PlusCircle className="mr-2 h-5 w-5" />
              {t("new_request")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("submit_request")}</DialogTitle>
              <DialogDescription>
                {t("request_form_description")}
              </DialogDescription>
            </DialogHeader>
            <CreateRequestForm 
              profileId={profileId} 
              onSuccess={() => {
                setModalOpen(false)
                queryClient.invalidateQueries({ queryKey: ["requests", profileId] })
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-10">{t("loading_requests")}</div>
        ) : requests && requests.length > 0 ? (
          requests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{request.title}</CardTitle>
                    <CardDescription>{request.type.replace('_', ' ')}</CardDescription>
                  </div>
                  <Badge variant={statusVariants[request.status]}>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {request.description}
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  <span>{t("submitted_on")} {format(new Date(request.created_at), "MMM dd, yyyy")}</span>
                  {request.metadata?.targetDate && (
                    <span className="bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      {t("target_date")}: {request.metadata.targetDate}
                    </span>
                  )}
                </div>
                {request.admin_comment && (
                  <div className="mt-4 p-3 rounded-md bg-muted/50 border text-xs italic">
                    <span className="font-bold block not-italic mb-1 uppercase text-[9px] opacity-70">{t("admin_comment")}:</span>
                    {request.admin_comment}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              {t("no_requests")}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
