import * as React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { RequestsPage } from "@/pages/requests"

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return <RequestsPage userId={userId} />
}
