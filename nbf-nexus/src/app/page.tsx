import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/shared/ui/button"
import Link from "next/link"
import { Calendar, CheckSquare, Users, ClipboardList, ArrowRight, Bot, Shield, Zap } from "lucide-react"
import { LandingNavbar } from "@/widgets/navigation/ui/LandingNavbar"

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

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-background pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium">
              <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">New</span>
              <span>Nexus Platform is now live for all trainees.</span>
            </div>
            <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl">
              The <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Nexus</span> of New Brain Factory
            </h1>
            <p className="mb-10 text-xl text-muted-foreground sm:text-2xl">
              An integrated ecosystem for trainee management, automated attendance, and AI-powered support.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                <Link href="/sign-up">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-full">
                <Link href="/sign-in">Member Login</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[100px]" />
      </section>

      {/* Features Grid */}
      <section id="services" className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Platform Capabilities</h2>
            <p className="mt-4 text-muted-foreground">Everything you need to manage your internship journey.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard 
              icon={Calendar} 
              title="Advanced Scheduling" 
              description="Flexible slot management for on-site, remote, and hybrid trainees."
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <FeatureCard 
              icon={CheckSquare} 
              title="Smart Attendance" 
              description="QR Code and Geolocation based check-ins to verify presence effortlessly."
              color="text-green-500"
              bg="bg-green-500/10"
            />
            <FeatureCard 
              icon={Bot} 
              title="AI Companion" 
              description="Personalized AI assistant with RAG to answer all your platform and policy questions."
              color="text-purple-500"
              bg="bg-purple-500/10"
            />
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <StatItem value="100%" label="Uptime" icon={Zap} />
            <StatItem value="24/7" label="Support" icon={Bot} />
            <StatItem value="Secure" label="SSO/RLS" icon={Shield} />
            <StatItem value="Modern" label="FSD Architecture" icon={Zap} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} New Brain Factory. All rights reserved. Built with Next.js, Clerk, and Supabase.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, color, bg }: any) {
  return (
    <div className="rounded-3xl border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function StatItem({ value, label, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center">
      <Icon className="mb-2 h-6 w-6 text-primary opacity-50" />
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
