import Link from "next/link"

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
  return (
    <div style={{ minHeight: "100vh", background: "hsl(0 0% 3.9%)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", gap: "32px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <span style={{ fontSize: "20px" }}>⚡</span>
            <span style={{ fontWeight: 700, color: "white" }}>AI Gateway</span>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Docs</span>
        </div>
      </nav>

      <div style={{ display: "flex", flex: 1, maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {/* Sidebar */}
        <aside style={{ width: "240px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "32px 0", position: "sticky", top: "60px", height: "calc(100vh - 60px)", overflowY: "auto" }}>
          {nav.map((section) => (
            <div key={section.title} style={{ marginBottom: "28px", padding: "0 16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", padding: "0 8px" }}>
                {section.title}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "block",
                    padding: "7px 8px",
                    borderRadius: "6px",
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color 0.15s, background 0.15s",
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "48px 64px", minWidth: 0, maxWidth: "760px" }}>
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.75,
              fontSize: "16px",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
