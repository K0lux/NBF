import { AdminSettingsForm } from "@/widgets/admin-settings"

export function AdminSettingsPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure geolocation rules and attendance policies for trainees.
          </p>
        </div>
        <AdminSettingsForm />
      </div>
    </main>
  )
}
