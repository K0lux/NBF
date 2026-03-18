import * as React from "react"
import { AIChatInterface } from "@/features/ai-chat"

export function AiPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <AIChatInterface />
    </div>
  )
}
