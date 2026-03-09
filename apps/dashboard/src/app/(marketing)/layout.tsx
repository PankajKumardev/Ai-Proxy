import Link from "next/link"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "hsl(0 0% 3.9%)" }}>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(10, 10, 10, 0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              ⚡
            </div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "white" }}>AI Gateway</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link href="/docs/introduction" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Docs</Link>
            <Link href="/pricing" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Pricing</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>GitHub</a>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>Login</Link>
            <Link
              href="/signup"
              style={{
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
