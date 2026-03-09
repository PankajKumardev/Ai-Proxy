"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const nav = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Environment Variables", href: "/docs/env-vars" },
    ],
  },
  {
    title: "Proxy",
    items: [
      { title: "Authentication", href: "/docs/proxy/authentication" },
      { title: "Caching", href: "/docs/proxy/caching" },
      { title: "Fallback Routing", href: "/docs/proxy/fallback-routing" },
      { title: "Rate Limiting", href: "/docs/proxy/rate-limiting" },
      { title: "Streaming", href: "/docs/proxy/streaming" },
    ],
  },
  {
    title: "Dashboard",
    items: [
      { title: "Overview", href: "/docs/dashboard/overview" },
      { title: "API Key Management", href: "/docs/dashboard/api-keys" },
    ],
  },
  {
    title: "Deployment",
    items: [
      { title: "Docker", href: "/docs/deployment/docker" },
      { title: "Railway", href: "/docs/deployment/railway" },
      { title: "Vercel", href: "/docs/deployment/vercel" },
      { title: "Self-Hosted VPS", href: "/docs/deployment/vps" },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Nav */}
      <nav className="h-14 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50 flex items-center px-6">
        <div className="max-w-[1400px] w-full mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
            <span className="text-primary text-lg">⚡</span>
            <span>AI Gateway</span>
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-muted-foreground text-sm font-medium">Documentation</span>
        </div>
      </nav>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="w-[240px] shrink-0 border-r border-border py-8 hidden md:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto hidden-scrollbar">
          {nav.map((section) => (
            <div key={section.title} className="mb-8 px-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-3 py-1.5 rounded-md text-sm transition-colors",
                        isActive 
                          ? "bg-secondary text-foreground font-medium" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Dynamic Prose Content */}
        <main className="flex-1 min-w-0 py-10 px-6 md:px-12 lg:px-16 overflow-x-hidden">
          <div className="prose prose-invert prose-zinc max-w-3xl prose-pre:bg-transparent prose-pre:p-0">
            {children}
          </div>
        </main>

        {/* Right TOC Placeholder (Optional styling) */}
        <aside className="w-[200px] shrink-0 py-10 px-4 hidden xl:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">On this page</div>
          <div className="space-y-2 text-sm text-muted-foreground/80">
            <p className="hover:text-foreground cursor-pointer transition-colors">Overview</p>
            <p className="hover:text-foreground cursor-pointer transition-colors">Architecture</p>
            <p className="hover:text-foreground cursor-pointer transition-colors">Supported Models</p>
            <p className="hover:text-foreground cursor-pointer transition-colors">Tech Stack</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
