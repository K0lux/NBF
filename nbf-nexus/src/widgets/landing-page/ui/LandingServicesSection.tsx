import { impactHighlights, impactStats, servicePainPoints, ArrowRight } from "@/widgets/landing-page/model/content"

export function LandingServicesSection() {
  return (
    <section id="services" className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Services & Problemes resolus</h2>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            Nexus transforme la gestion logistique et administrative de NBF en un processus fluide et automatise.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicePainPoints.map((item) => (
            <div key={item.title} className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${item.gradient} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="mb-4 text-sm font-medium text-primary uppercase tracking-wider">{item.subtitle}</p>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[2.5rem] border bg-card overflow-hidden shadow-lg border-primary/10">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12 bg-gradient-to-br from-primary/5 to-transparent">
              <h3 className="text-3xl font-bold mb-6">Impact Business pour NBF</h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Nexus transforme un centre de cout logistique en un levier de croissance. L'entreprise peut desormais passer de 30 a 100+ stagiaires sans ressources RH supplementaires.
              </p>
              <div className="space-y-4">
                {impactHighlights.map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-medium text-foreground/80">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 p-8 lg:p-12 flex items-center justify-center relative">
              <div className="grid grid-cols-2 gap-4 w-full">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-card p-6 shadow-sm border border-primary/5 flex flex-col items-center text-center">
                    <span className="text-3xl font-bold text-primary mb-1">{stat.value}</span>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
