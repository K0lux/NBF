"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { processCheckInAction } from "@/entities/attendance/api/attendanceActions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

function CheckInContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const token = searchParams?.get("token")

  React.useEffect(() => {
    if (!token) {
      setStatus("error")
      setErrorMessage("No check-in token provided")
      return
    }

    const checkIn = async () => {
      let coords: { lat: number; long: number } | undefined = undefined;
      
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          coords = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          };
        } catch (geoErr) {
          console.warn("Could not get geolocation, proceeding without it", geoErr);
        }
      }

      try {
        const result = await processCheckInAction(token, coords)
        if (result.success) {
          setStatus("success")
        } else {
          setStatus("error")
          setErrorMessage(result.error || "Check-in failed")
        }
      } catch (err) {
        setStatus("error")
        setErrorMessage("An unexpected error occurred")
      }
    }

    checkIn()
  }, [token])

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Session Check-In</CardTitle>
          <CardDescription>Validating your attendance via QR Code</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 gap-6">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Processing your check-in...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center gap-2 flex flex-col">
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">Check-In Successful!</h2>
                <p className="text-muted-foreground">Your attendance has been recorded for today&apos;s session.</p>
              </div>
              <Button onClick={() => router.push("/my-schedule")} className="w-full mt-4">
                View My Schedule
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center gap-2 flex flex-col">
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">Check-In Failed</h2>
                <p className="text-muted-foreground">{errorMessage}</p>
              </div>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full mt-4">
                Back to Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default function CheckInPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-16 w-16 text-primary animate-spin" /></div>}>
      <CheckInContent />
    </React.Suspense>
  )
}
