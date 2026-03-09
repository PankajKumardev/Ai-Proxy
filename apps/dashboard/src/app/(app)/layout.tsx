import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

const sidebarLinks = [
  { href: "/dashboard", icon: "◉", label: "Overview" },
  { href: "/dashboard/analytics", icon: "📊", label: "Analytics" },
  { href: "/dashboard/cache", icon: "⚡", label: "Cache" },
  { href: "/dashboard/requests", icon: "🔍", label: "Requests" },
  { href: "/dashboard/keys", icon: "🔑", label: "API Keys" },
  { href: "/dashboard/settings", icon: "⚙", label: "Settings" },
]

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "hsl(0 0% 3.9%)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", padding: "8px 12px", marginBottom: "24px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "linear-gradient(135deg, #a855f7, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⚡</div>
          <span style={{ fontWeight: 700, color: "white", fontSize: "16px" }}>AI Gateway</span>
        </Link>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "2px",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <span style={{ fontSize: "14px" }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "16px", padding: "16px 12px 4px" }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Signed in as</div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session.user?.email}
          </div>
          <form action="/api/auth/signout" method="POST" style={{ marginTop: "12px" }}>
            <button type="submit" style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", cursor: "pointer", width: "100%" }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "32px 40px", minWidth: 0, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  )
}
