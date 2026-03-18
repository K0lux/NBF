import * as React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AIChatInterface } from "@/features/ai-chat/ui/AIChatInterface"

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <AIChatInterface />
    </div>
  )
}
