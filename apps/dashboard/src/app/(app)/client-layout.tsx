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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, BarChart2, Zap, Search, Key, Settings, Menu, LogOut, Box } from "lucide-react"

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
    <div className="flex min-h-screen bg-[#0A0A0A] text-foreground antialiased">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col border-r border-white/10 bg-[#0A0A0A] transition-all duration-300 relative",
          isCollapsed ? "w-[68px]" : "w-[240px]",
          "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 shrink-0 px-4 border-b border-white/10">
          <Link href="/" className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
            <div className="w-6 h-6 flex items-center justify-center text-white">
              <Box className="w-5 h-5" />
            </div>
            <span className="font-medium text-sm tracking-tight text-white">AI Gateway</span>
          </Link>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className={cn("text-[#888888] hover:text-white transition-colors p-1 rounded-md", isCollapsed && "mx-auto")}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto w-full p-3 space-y-1 z-10">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-ring focus-visible:ring-2 outline-none",
                  isActive ? "bg-white/10 text-white" : "text-[#888888] hover:bg-white/5 hover:text-white",
                  isCollapsed && "justify-center px-0 w-10 mx-auto"
                )}
                title={isCollapsed ? link.label : undefined}
              >
                <link.icon className={cn("w-4 h-4 shrink-0", isActive && "text-white")} />
                {!isCollapsed && <span className="truncate tracking-tight">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Block -> Dropdown Menu */}
        <div className="p-3 border-t border-white/10 shrink-0 relative z-20">
          <DropdownMenu>
            <DropdownMenuTrigger 
              className={cn(
                "flex items-center w-full rounded-lg hover:bg-white/5 transition-colors text-left outline-none",
                isCollapsed ? "justify-center p-2" : "gap-3 p-2"
              )}
            >
              <Avatar className="w-8 h-8 rounded shrink-0 border border-white/10">
                <AvatarImage src="" />
                <AvatarFallback className="rounded bg-black text-xs text-white">{userEmail?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate tracking-tight text-white mb-0.5">{userEmail}</p>
                  <p className="text-[11px] text-[#888888] truncate tracking-wide uppercase">Free Plan</p>
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10 text-white shadow-2xl backdrop-blur-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-[13px] font-medium leading-none tracking-tight text-white">{userEmail}</p>
                  <p className="text-[11px] uppercase tracking-wide leading-none text-[#888888]">Free Plan</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer px-0 py-0">
                <Link href="/dashboard/settings" className="flex w-full items-center px-2 py-1.5 text-[13px]"><Settings className="mr-2 h-4 w-4 text-[#888888]" /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer px-0 py-0">
                <form action="/api/auth/signout" method="POST" className="w-full">
                  <button type="submit" className="flex w-full items-center px-2 py-1.5 text-[13px]"><LogOut className="mr-2 h-4 w-4 opacity-70" /> Sign out</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] relative overflow-hidden">
        {/* Subtle background glow effect for the entire dashboard space */}
        <div className="absolute top-0 left-0 w-[800px] h-[400px] bg-indigo-500/[0.02] blur-3xl pointer-events-none rounded-full" />
        
        {/* Header Bar */}
        <header className="h-14 flex items-center px-6 shrink-0 border-b border-white/10 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md z-20">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="text-[#888888] hover:text-white text-[13px] font-medium tracking-tight">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              {currentLink && currentLink.href !== "/dashboard" && (
                <>
                  <BreadcrumbSeparator className="text-[#444]" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white text-[13px] font-medium tracking-tight">{currentLink.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
          <div className="max-w-[1200px] mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
