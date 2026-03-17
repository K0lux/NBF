"use client"

import * as React from "react"
import { TraineeManagementWidget } from "@/widgets/trainee-management/ui/TraineeManagementWidget"
import { useI18n } from "@/shared/lib/i18n/i18nContext"

export default function AdminTraineesPage() {
  const { t } = useI18n()
  
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("administration")}</h1>
          <p className="text-muted-foreground">
            {t("manage_trainees")}
          </p>
        </div>
        
        <TraineeManagementWidget />
      </div>
    </main>
  )
}
