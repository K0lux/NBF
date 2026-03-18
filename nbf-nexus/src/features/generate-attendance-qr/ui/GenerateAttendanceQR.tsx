"use client"

import * as React from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog"
import { QrCode, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { env } from "@/shared/config/env"

interface GenerateAttendanceQRProps {
  scheduleId: string;
  profileId: string;
  traineeName: string;
}

export function GenerateAttendanceQR({ scheduleId, profileId, traineeName }: GenerateAttendanceQRProps) {
  const [token, setToken] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/attendance/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId, profileId }),
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const data = await response.json()
      setToken(data.token)
    } catch (err) {
      console.error("Failed to generate token:", err)
      toast.error("Failed to generate QR token")
    } finally {
      setLoading(false)
    }
  }

  const appOrigin =
    env.NEXT_PUBLIC_APP_URL && env.NEXT_PUBLIC_APP_URL.trim().length > 0
      ? env.NEXT_PUBLIC_APP_URL
      : typeof window !== "undefined"
        ? window.location.origin
        : ""
  const qrUrl = token ? `${appOrigin}/attendance/check-in?token=${token}` : ""

  return (
    <Dialog onOpenChange={(open) => open && !token && handleGenerate()}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attendance QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Scan this code to check in <strong>{traineeName}</strong> for this session.
          </p>
          
          <div className="bg-white text-black p-4 rounded-lg shadow-sm border">
            {token ? (
              <QRCodeSVG value={qrUrl} size={256} level="H" includeMargin={true} />
            ) : (
              <div className="h-[256px] w-[256px] flex items-center justify-center bg-muted animate-pulse rounded text-black">
                Generating...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Token
            </Button>
          </div>
          
          <p className="text-[10px] text-muted-foreground break-all max-w-[300px] font-mono opacity-50">
            {token || "..."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
