"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { LayoutDashboard, BarChart2, Zap, Search, Key, Settings, Menu, LogOut } from "lucide-react"

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/cache", icon: Zap, label: "Cache" },
  { href: "/dashboard/requests", icon: Search, label: "Requests" },
  { href: "/dashboard/keys", icon: Key, label: "API Keys" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export default function AppLayoutClient({ children, userEmail }: { children: React.ReactNode, userEmail: string | undefined | null }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const currentLink = sidebarLinks.find((l) => l.href === pathname)

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-white/20 selection:text-white">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col border-r border-border bg-background transition-all duration-300 relative",
          isCollapsed ? "w-[68px]" : "w-[240px]",
          "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 shrink-0 px-4 border-b border-border">
          <Link href="/" className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
            <div className="w-6 h-6 rounded flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs">A</div>
            <span className="font-semibold text-sm">AI Gateway</span>
          </Link>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className={cn("text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md", isCollapsed && "mx-auto")}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto w-full p-2 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-ring focus-visible:ring-2",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-0 w-10 mx-auto"
                )}
                title={isCollapsed ? link.label : undefined}
              >
                <link.icon className={cn("w-4 h-4 shrink-0", isActive && "text-foreground")} />
                {!isCollapsed && <span className="truncate">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Block */}
        <div className="p-4 border-t border-border shrink-0">
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
            <Avatar className="w-8 h-8 rounded shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="rounded bg-secondary text-xs">{userEmail?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userEmail}</p>
                <form action="/api/auth/signout" method="POST" className="mt-1">
                  <button type="submit" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <LogOut className="w-3 h-3" /> Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 bg-background/50">
        {/* Header Bar */}
        <header className="h-14 flex items-center px-6 shrink-0 border-b border-border sticky top-0 bg-background/80 backdrop-blur z-20">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              {currentLink && currentLink.href !== "/dashboard" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentLink.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
