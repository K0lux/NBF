import { ComponentType } from "react"
import { platformStats } from "@/widgets/landing-page/model/content"

export function LandingStatsSection() {
  return (
    <section id="about" className="py-24 border-t">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-4 text-center">
          {platformStats.map((stat) => (
            <StatItem key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label, icon: Icon }: { value: string; label: string; icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center group">
      <div className="mb-4 h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  )
}
