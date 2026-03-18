import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { ArrowRight } from "@/widgets/landing-page/model/content"

export function LandingHeroSection() {
  return (
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

      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[100px]" />
    </section>
  )
}
