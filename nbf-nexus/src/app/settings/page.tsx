"use client"

import * as React from "react"
import { useI18n, Language } from "@/shared/lib/i18n/i18nContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card"
import { Label } from "@/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Button } from "@/shared/ui/button"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/shared/api/supabase"
import { toast } from "sonner"
import { Loader2, Save, Globe, Bell, User } from "lucide-react"

export default function SettingsPage() {
  const { t, language, setLanguage } = useI18n()
  const { user, isLoaded } = useUser()
  const [isSaving, setIsSaving] = React.useState(false)
  const [notifications, setNotifications] = React.useState("true")

  // Load preferences from Supabase
  React.useEffect(() => {
    async function loadPreferences() {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('language, preferences')
          .eq('id', user.id)
          .single()

        if (data) {
          if (data.language) setLanguage(data.language as Language)
          if (data.preferences?.notifications !== undefined) {
            setNotifications(data.preferences.notifications.toString())
          }
        }
      }
    }
    if (isLoaded) {
      loadPreferences()
    }
  }, [user?.id, isLoaded, setLanguage])

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          language: language,
          preferences: {
            notifications: notifications === "true",
          }
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success(t("success_message"))
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error(t("error_message"))
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("settings")}</h1>
          <p className="text-muted-foreground">{t("settings_description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("language")}
            </CardTitle>
            <CardDescription>{t("language_description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t("language")}</Label>
              <Select value={language} onValueChange={(val: Language) => setLanguage(val)}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t("preferences")}
            </CardTitle>
            <CardDescription>{t("notifications_description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notifications">{t("notifications")}</Label>
              <Select value={notifications} onValueChange={setNotifications}>
                <SelectTrigger id="notifications">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{t("home") === "Accueil" ? "Activées" : "Enabled"}</SelectItem>
                  <SelectItem value="false">{t("home") === "Accueil" ? "Désactivées" : "Disabled"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("account")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{user?.fullName}</p>
              <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  )
}
