"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

function CheckInContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [scanAction, setScanAction] = React.useState<"arrival" | "departure" | null>(null)
  const [gpsDebug, setGpsDebug] = React.useState<string | null>(null)

  const token = searchParams?.get("token")
  const [selfToken, setSelfToken] = React.useState<string | null>(null)
  const [selfTokenError, setSelfTokenError] = React.useState<string | null>(null)
  const [selfTokenLoading, setSelfTokenLoading] = React.useState(false)

  React.useEffect(() => {
    if (!token) {
      setStatus("loading")
      return
    }

    const checkIn = async () => {
      let coords: { lat: number; long: number } | undefined = undefined;
      
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            });
          });
          coords = {
            lat: position.coords.latitude,
            long: position.coords.longitude
          };
        } catch (geoErr) {
          const geoError = geoErr as GeolocationPositionError
          const reason =
            geoError?.code === 1
              ? "Permission de localisation refusee sur le navigateur."
              : geoError?.code === 2
                ? "Position indisponible. Activez GPS/precision elevee."
                : geoError?.code === 3
                  ? "Delai de localisation depasse. Reessayez a l'exterieur."
                  : "Impossible de recuperer la geolocalisation."
          setStatus("error")
          setErrorMessage(reason)
          setGpsDebug("Aucune coordonnee GPS transmise au serveur.")
          return
        }
      } else {
        setStatus("error")
        setErrorMessage("La geolocalisation n'est pas supportee sur ce navigateur.")
        setGpsDebug("Navigateur sans API geolocation.")
        return
      }

      try {
        const response = await fetch("/api/attendance/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, coords }),
        })

        if (!response.ok) {
          setStatus("error")
          setErrorMessage(await response.text())
          return
        }

        const result = await response.json()
        if (result.success) {
          setStatus("success")
          setSuccessMessage(result.message || "Attendance validated")
          setScanAction(result.action || "arrival")
          setGpsDebug(`GPS transmis: lat=${coords?.lat?.toFixed(6)}, long=${coords?.long?.toFixed(6)}`)
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

  const generateMyQr = async () => {
    setSelfTokenLoading(true)
    setSelfTokenError(null)
    try {
      let coords: { lat: number; long: number } | undefined

      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            })
          })
          coords = { lat: position.coords.latitude, long: position.coords.longitude }
        } catch {
          // Keep coords undefined; server decides if it is mandatory by intern type/rules.
        }
      }

      const response = await fetch("/api/attendance/self-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coords }),
      })

      if (!response.ok) {
        setSelfTokenError(await response.text())
        return
      }

      const data = await response.json()
      setSelfToken(data.token)
    } catch {
      setSelfTokenError("Failed to generate your QR token")
    } finally {
      setSelfTokenLoading(false)
    }
  }

  const selfQrUrl =
    selfToken && typeof window !== "undefined"
      ? `${window.location.origin}/attendance/check-in?token=${selfToken}`
      : ""

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">My Check-In QR</CardTitle>
            <CardDescription>
              Available only when your internship type and assignment match admin rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {selfToken ? (
              <div className="bg-white text-black p-4 rounded-lg border">
                <QRCodeSVG value={selfQrUrl} size={256} includeMargin />
              </div>
            ) : (
              <div className="h-[256px] w-[256px] rounded border flex items-center justify-center text-sm text-muted-foreground">
                QR not generated yet
              </div>
            )}

            <Button onClick={generateMyQr} disabled={selfTokenLoading}>
              {selfTokenLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Generate My QR
            </Button>

            {selfTokenError && <p className="text-sm text-destructive text-center">{selfTokenError}</p>}
          </CardContent>
        </Card>
      </main>
    )
  }

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
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  {scanAction === "departure" ? "Check-Out Successful!" : "Check-In Successful!"}
                </h2>
                <p className="text-muted-foreground">
                  {successMessage || "Your attendance has been recorded for today&apos;s session."}
                </p>
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
                {gpsDebug && <p className="text-xs text-muted-foreground">{gpsDebug}</p>}
                {errorMessage?.toLowerCase().includes("geofencing check failed") && (
                  <p className="text-xs text-muted-foreground">
                    Activez la localisation precise (GPS), rapprochez-vous du site, puis reessayez.
                  </p>
                )}
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
