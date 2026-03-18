import * as React from "react"
import { AdminRequestListWidget } from "@/widgets/request-management"

export function AdminRequestsPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <AdminRequestListWidget />
    </main>
  )
}
