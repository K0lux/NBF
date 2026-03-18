"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { cn } from "@/shared/lib/utils"
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  ClipboardList, 
  LayoutDashboard,
  Menu,
  X,
  Settings,
  Bot
} from "lucide-react"
import { Button } from "@/shared/ui/button"
import { ThemeToggle } from "@/shared/ui/theme-toggle"
import { useI18n } from "@/shared/lib/i18n/i18nContext"

export function Navbar() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const { t } = useI18n()
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (!isLoaded || !user?.id) return

    fetch("/api/profile/sync", { method: "POST" }).catch(() => {
      // Keep navbar resilient; profile sync failures are surfaced elsewhere.
    })
  }, [isLoaded, user?.id])

  // Hide Navbar if user is not authenticated
  if (isLoaded && !user) return null;

  // In a real app, role would come from publicMetadata or a separate query
  const isAdmin = user?.publicMetadata?.role === 'admin' || pathname?.startsWith('/admin')

  const navItems = isAdmin 
    ? [
        { name: t("schedules"), href: "/admin/schedule", icon: Calendar },
        { name: t("trainees"), href: "/admin/trainees", icon: Users },
        { name: t("attendance"), href: "/admin/attendance", icon: CheckSquare },
        { name: t("requests"), href: "/admin/requests", icon: ClipboardList },
        { name: t("ai_companion"), href: "/ai", icon: Bot },
      ]
    : [
        { name: t("my_schedule"), href: "/my-schedule", icon: Calendar },
        { name: t("check_in"), href: "/attendance/check-in", icon: CheckSquare },
        { name: t("my_requests"), href: "/requests", icon: ClipboardList },
        { name: t("ai_companion"), href: "/ai", icon: Bot },
      ]

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <div className="bg-primary text-primary-foreground p-1 rounded">NBF</div>
              <span>Nexus</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href={isAdmin ? "/admin/settings" : "/settings"} className="hidden md:block">
              <Button variant="ghost" size="icon" title={t("settings")}>
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <UserButton />
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t p-4 space-y-1 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors",
                pathname === item.href 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <Link
            href={isAdmin ? "/admin/settings" : "/settings"}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors",
              pathname === "/settings" 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            <Settings className="h-5 w-5" />
            {t("settings")}
          </Link>
        </div>
      )}
    </nav>
  )
}
