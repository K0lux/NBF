import * as React from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AdminRequestsPage } from "@/pages/admin/requests"

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

  return <AdminRequestsPage />
}
