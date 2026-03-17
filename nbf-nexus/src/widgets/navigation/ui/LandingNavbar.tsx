"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { useI18n } from "@/shared/lib/i18n/i18nContext"
import { cn } from "@/shared/lib/utils"

export function LandingNavbar() {
  const { t, language } = useI18n()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: t("home"), href: "#home" },
    { name: language === "fr" ? "Services" : "Services", href: "#services" },
    { name: language === "fr" ? "À propos" : "About", href: "#about" },
  ]

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <nav className={cn(
        "flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-md shadow-lg border-primary/20" 
          : "bg-background/40 backdrop-blur-sm border-muted"
      )}>
        <Link href="#home" className="flex items-center gap-2 font-bold text-lg tracking-tighter">
          <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-lg text-sm">NBF</div>
          <span className="hidden sm:inline">Nexus</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <Button asChild size="sm" className="rounded-full px-5 h-9">
            <Link href="/sign-in">{language === "fr" ? "Connexion" : "Login"}</Link>
          </Button>
        </div>
      </nav>
    </div>
  )
}
