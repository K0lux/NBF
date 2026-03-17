"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { useI18n } from "@/shared/lib/i18n/i18nContext"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function InviteTraineeModal() {
  const { t } = useI18n()
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || t("invitation_error"))
      }

      toast.success(t("invitation_sent"))
      setOpen(false)
      setEmail("")
    } catch (error: any) {
      toast.error(error.message || t("invitation_error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t("invite_trainee")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleInvite}>
          <DialogHeader>
            <DialogTitle>{t("invite_trainee")}</DialogTitle>
            <DialogDescription>
              {t("invite_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email_address")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="trainee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("send_invitation")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
