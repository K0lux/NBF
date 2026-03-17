import * as React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { RequestListWidget } from "@/widgets/request-management/ui/RequestListWidget"

export default async function RequestsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <RequestListWidget profileId={userId} />
    </main>
  )
}
