// apps/dashboard/src/app/(docs)/docs/introduction/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Introduction — AI Gateway Docs" }

export default function IntroductionPage() {
  return (
    <>
      <h1 style={{ fontSize: "36px", fontWeight: 800, color: "white", marginBottom: "16px" }}>Introduction</h1>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", marginBottom: "32px" }}>
        AI Gateway is an open-source proxy server that sits between your application and AI providers (OpenAI, Gemini, Anthropic).
      </p>

      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white", marginTop: "40px", marginBottom: "16px" }}>Why build it?</h2>
      <p>When your app calls AI providers directly, three painful things happen:</p>
      <ul style={{ paddingLeft: "24px", color: "rgba(255,255,255,0.7)" }}>
        <li style={{ marginBottom: "8px" }}><strong style={{ color: "white" }}>You pay for duplicate requests.</strong> Same question asked 1,000 times = 1,000 API calls.</li>
        <li style={{ marginBottom: "8px" }}><strong style={{ color: "white" }}>One provider goes down, your app goes down.</strong> No fallback, no resilience.</li>
        <li style={{ marginBottom: "8px" }}><strong style={{ color: "white" }}>Zero visibility.</strong> No idea which model costs what or how much you&apos;re burning monthly.</li>
      </ul>

      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white", marginTop: "40px", marginBottom: "16px" }}>Architecture</h2>
      <pre style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "24px", color: "rgba(255,255,255,0.8)", fontFamily: "monospace", overflow: "auto", fontSize: "13px", lineHeight: 1.8 }}>
{`Your App → AI Gateway → OpenAI / Gemini / Anthropic`}
      </pre>

      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white", marginTop: "40px", marginBottom: "16px" }}>Features</h2>
      <ul style={{ paddingLeft: "24px", color: "rgba(255,255,255,0.7)" }}>
        <li style={{ marginBottom: "8px" }}>🗄 <strong style={{ color: "white" }}>Response Caching</strong> — SHA-256 exact match, configurable TTL per plan</li>
        <li style={{ marginBottom: "8px" }}>🔀 <strong style={{ color: "white" }}>Fallback Routing</strong> — Auto-retry across 3 providers with health tracking</li>
        <li style={{ marginBottom: "8px" }}>📊 <strong style={{ color: "white" }}>Usage Analytics</strong> — Tokens, cost, cache hit rate, per-request logging</li>
        <li style={{ marginBottom: "8px" }}>🔌 <strong style={{ color: "white" }}>OpenAI Compatible</strong> — No SDK changes needed in your app</li>
        <li style={{ marginBottom: "8px" }}>⚡ <strong style={{ color: "white" }}>Smart Routing</strong> — cheap / balanced / quality modes per request</li>
      </ul>

      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white", marginTop: "40px", marginBottom: "16px" }}>Tech Stack</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", fontSize: "14px" }}>
        {[
          ["Hono + Node.js", "Edge-ready proxy, 3.5× faster than Express"],
          ["Neon DB (Postgres)", "Serverless Postgres — always use pooled connection"],
          ["Upstash Redis", "HTTP-based Redis for caching + rate limiting"],
          ["Next.js 15 App Router", "Landing page, docs, and dashboard in one app"],
          ["NextAuth v5", "JWT sessions, Prisma adapter, email/password auth"],
        ].map(([tool, why]) => (
          <>
            <div key={`t-${tool}`} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.9)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{tool}</div>
            <div key={`w-${tool}`} style={{ padding: "12px 16px", color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{why}</div>
          </>
        ))}
      </div>
    </>
  )
}
