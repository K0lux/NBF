import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { LandingPage } from "@/widgets/landing-page/ui/LandingPage"

export default async function HomePage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (userId) {
    const isAdmin = user?.publicMetadata?.role === 'admin'
    if (isAdmin) {
      redirect("/admin/trainees")
    } else {
      redirect("/my-schedule")
    }
  }

  return <LandingPage />
}

