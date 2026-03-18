import { LandingNavbar } from "@/widgets/navigation/ui/LandingNavbar"
import { LandingHeroSection } from "@/widgets/landing-page/ui/LandingHeroSection"
import { LandingServicesSection } from "@/widgets/landing-page/ui/LandingServicesSection"
import { LandingStatsSection } from "@/widgets/landing-page/ui/LandingStatsSection"
import { LandingFooter } from "@/widgets/landing-page/ui/LandingFooter"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <LandingHeroSection />
      <LandingServicesSection />
      <LandingStatsSection />
      <LandingFooter />
    </div>
  )
}
