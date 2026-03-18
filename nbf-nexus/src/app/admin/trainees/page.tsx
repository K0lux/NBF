import * as React from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AdminTraineesPage } from "@/pages/admin/trainees"

export default async function Page() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  if (user?.publicMetadata?.role !== "admin") {
    redirect("/")
  }

  return <AdminTraineesPage />
}
