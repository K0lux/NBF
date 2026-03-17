import * as React from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AdminRequestListWidget } from "@/widgets/request-management/ui/AdminRequestListWidget"

export default async function AdminRequestsPage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  // Basic admin check (should be more robust in production)
  const isAdmin = user?.publicMetadata?.role === 'admin'
  if (!isAdmin && process.env.NODE_ENV === 'production') {
    redirect("/")
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <AdminRequestListWidget />
    </main>
  )
}
