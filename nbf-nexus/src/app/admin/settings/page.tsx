import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AdminSettingsForm } from "@/widgets/admin-settings/ui/AdminSettingsForm"

export default async function Page() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) redirect("/sign-in")
  if (user?.publicMetadata?.role !== "admin") redirect("/")

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
