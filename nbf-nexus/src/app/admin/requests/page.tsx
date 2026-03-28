import * as React from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AdminRequestListWidget } from "@/widgets/request-management/ui/AdminRequestListWidget"

export default async function Page() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  const isAdmin = user?.publicMetadata?.role === 'admin'
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <AdminRequestListWidget />
    </main>
  )
}
