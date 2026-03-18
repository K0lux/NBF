import * as React from "react"
import { RequestListWidget } from "@/widgets/request-management"

interface RequestsPageProps {
  userId: string
}

export function RequestsPage({ userId }: RequestsPageProps) {
  return (
    <main className="container mx-auto py-10 px-4">
      <RequestListWidget profileId={userId} />
    </main>
  )
}
