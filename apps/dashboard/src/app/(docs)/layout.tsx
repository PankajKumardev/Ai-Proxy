"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import TableOfContents from "@/components/mdx/toc"

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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans">
      {/* Top Nav */}
      <nav className="h-14 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50 flex items-center px-6">
        <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-widest uppercase text-white text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> 
              AI Gateway
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#a3a3a3] text-sm font-medium">Documentation</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-[#a3a3a3] hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="text-black bg-white hover:bg-white/90 px-3 py-1.5 rounded-md transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="w-[240px] shrink-0 border-r border-white/10 py-8 hidden md:block sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto hidden-scrollbar">
          {nav.map((section) => (
            <div key={section.title} className="mb-8 px-4">
              <h4 className="text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-3 px-2">
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
                        "block px-3 py-1.5 rounded-md text-[13px] transition-colors",
                        isActive 
                          ? "bg-[#111111] text-white font-medium border border-white/5" 
                          : "text-[#a3a3a3] hover:bg-[#111111]/50 hover:text-white"
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
          <div className="prose prose-invert prose-zinc max-w-3xl prose-pre:bg-[#111111] prose-pre:border prose-pre:border-white/10 prose-pre:text-[13px] prose-h2:scroll-mt-24 prose-h3:scroll-mt-24">
            {children}
          </div>
        </main>

        {/* Dynamic Right TOC */}
        <TableOfContents />
      </div>
    </div>
  )
}
