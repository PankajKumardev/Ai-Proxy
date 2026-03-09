import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login — AI Gateway",
}

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "hsl(0 0% 3.9%)",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "32px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #a855f7, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚡</div>
            <span style={{ fontWeight: 700, fontSize: "20px", color: "white" }}>AI Gateway</span>
          </Link>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "8px" }}>Welcome back</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>Sign in to your account</p>
        </div>
        <form
          action="/api/auth/signin"
          method="POST"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "white",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(147,51,234,0.3)",
            }}
          >
            Sign in
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "24px", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#a855f7", textDecoration: "none", fontWeight: 600 }}>
            Sign up free →
          </Link>
        </p>
      </div>
    </div>
  )
}
