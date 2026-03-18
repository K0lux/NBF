import * as React from "react"
import { TraineeManagementWidget } from "@/widgets/trainee-management"

export function AdminTraineesPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground">
            Manage trainees
          </p>
        </div>
        
        <TraineeManagementWidget />
      </div>
    </main>
  )
}
