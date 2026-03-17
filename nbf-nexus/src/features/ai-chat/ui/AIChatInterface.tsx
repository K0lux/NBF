"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Bot, User, Send, Loader2, Sparkles, Plus, Paperclip, FileText, X as CloseIcon } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { useI18n } from "@/shared/lib/i18n/i18nContext"
import { toast } from "sonner"

export function AIChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat()
  const { t } = useI18n()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const startNewChat = () => {
    setMessages([])
    if (typeof setInput === 'function') {
      setInput("")
    }
    setSelectedFile(null)
  }

  const handleSuggestionClick = (text: string) => {
    if (typeof setInput === 'function') {
      setInput(text)
    }
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large (max 5MB)")
        return
      }
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header-like actions */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button variant="ghost" size="sm" onClick={startNewChat} className="gap-2 rounded-full border bg-background/50 backdrop-blur">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t("new_chat")}</span>
        </Button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-20 pb-32 px-4"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">{t("how_can_i_help")}</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Ask me about your schedule, how to point your attendance, or any other platform questions.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-8 text-left">
                <SuggestionCard 
                  text="When is my next workshop?" 
                  onClick={() => handleSuggestionClick("When is my next workshop?")} 
                />
                <SuggestionCard 
                  text="How do I use the QR pointage?" 
                  onClick={() => handleSuggestionClick("How do I use the QR pointage?")} 
                />
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl border shrink-0",
                  m.role === 'user' ? "bg-accent" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {m.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={cn(
                  "px-1 py-1 rounded-lg text-base max-w-[85%] leading-relaxed",
                  m.role === 'user' ? "bg-muted/50 px-4 py-3 rounded-2xl" : "pt-1"
                )}>
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
              <div className="p-2 rounded-xl border bg-primary/5 text-primary/50">
                <Bot className="h-5 w-5" />
              </div>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-8 pt-10 px-4">
        <div className="max-w-3xl mx-auto relative group">
          {/* File attachment preview */}
          {selectedFile && (
            <div className="absolute -top-12 left-4 flex items-center gap-2 bg-muted px-3 py-1.5 rounded-t-xl border-x border-t text-xs animate-in slide-in-from-bottom-2">
              <FileText className="h-3 w-3 text-primary" />
              <span className="max-w-[150px] truncate font-medium">{selectedFile.name}</span>
              <button onClick={removeFile} className="hover:text-destructive">
                <CloseIcon className="h-3 w-3" />
              </button>
            </div>
          )}

          <form 
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 p-2 rounded-[28px] border bg-muted/50 focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileSelect} 
              className="hidden" 
              accept=".pdf,.doc,.docx,.txt"
            />
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 shrink-0 mb-0.5"
              onClick={() => fileInputRef.current?.click()}
              title={t("upload_document")}
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <textarea
              rows={1}
              placeholder={t("message_placeholder")}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
              className="flex-1 max-h-40 min-h-[44px] bg-transparent border-none focus:ring-0 px-2 py-3 resize-none scrollbar-none"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full h-10 w-10 shrink-0 mb-0.5" 
              disabled={isLoading || (!input?.trim() && !selectedFile)}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-2 px-10">
            {t("ai_mistakes")}
          </p>
        </div>
      </div>
    </div>
  )
}

function SuggestionCard({ text, onClick }: { text: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-4 rounded-2xl border bg-card hover:bg-muted/50 transition-colors text-sm text-muted-foreground hover:text-foreground text-left group flex items-center justify-between"
    >
      <span>{text}</span>
      <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
