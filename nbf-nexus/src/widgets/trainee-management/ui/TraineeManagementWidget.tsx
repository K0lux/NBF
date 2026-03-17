"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { traineeApi } from "@/entities/trainee/api/traineeApi"
import { TraineeDataTable } from "@/features/list-trainees/ui/TraineeDataTable"
import { getColumns } from "@/features/list-trainees/ui/columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { InviteTraineeModal } from "@/features/invite-trainee/ui/InviteTraineeModal"
import { useI18n } from "@/shared/lib/i18n/i18nContext"
import { RefreshCw } from "lucide-react"
import { Button } from "@/shared/ui/button"

export function TraineeManagementWidget() {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["trainees"],
    queryFn: traineeApi.getTrainees,
  })

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["trainees"] })
  }

  const columns = React.useMemo(() => getColumns(onRefresh), [onRefresh])

  if (isLoading) return <div className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> {t("loading")}</div>
  if (error) return <div>Error loading trainees</div>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t("trainee_management")}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} title={t("refresh")}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <InviteTraineeModal />
        </div>
      </CardHeader>
      <CardContent>
        <TraineeDataTable 
          columns={columns} 
          data={data || []} 
          searchKey="full_name" 
        />
      </CardContent>
    </Card>
  )
}
