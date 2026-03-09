import React from "react"
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

      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white", marginTop: "40px", marginBottom: "16px" }}>Supported Models (March 2026)</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", fontSize: "13px" }}>
        {[
          ["Model ID", "Provider", "In $/1M", "Out $/1M"],
          ["gpt-5.4",            "OpenAI",    "$2.50",  "$15.00"],
          ["gpt-5.2",            "OpenAI",    "$1.75",  "$14.00"],
          ["gpt-5-mini",         "OpenAI",    "$0.25",  "$2.00"],
          ["gpt-5-nano",         "OpenAI",    "$0.05",  "$0.40"],
          ["gpt-4o",             "OpenAI",    "$2.50",  "$10.00"],
          ["gpt-4o-mini",        "OpenAI",    "$0.15",  "$0.60"],
          ["o3-mini",            "OpenAI",    "$1.10",  "$4.40"],
          ["gemini-3.1-pro",     "Gemini",    "$2.00",  "$12.00"],
          ["gemini-2.5-pro",     "Gemini",    "$1.25",  "$10.00"],
          ["gemini-2.5-flash",   "Gemini",    "$0.30",  "$2.50"],
          ["gemini-2.5-flash-lite","Gemini",  "$0.10",  "$0.40"],
          ["claude-opus-4-6",    "Anthropic", "$5.00",  "$25.00"],
          ["claude-sonnet-4-6",  "Anthropic", "$3.00",  "$15.00"],
          ["claude-haiku-4-5",   "Anthropic", "$1.00",  "$5.00"],
        ].map(([model, provider, inp, out], i) => (
          <React.Fragment key={i}>
            <div style={{ padding: "10px 14px", background: i === 0 ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)", color: i === 0 ? "#a855f7" : "rgba(255,255,255,0.85)", fontWeight: i === 0 ? 700 : 500, borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "monospace" }}>{model}</div>
            <div style={{ padding: "10px 14px", background: i === 0 ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)", color: i === 0 ? "#a855f7" : "rgba(255,255,255,0.55)", fontWeight: i === 0 ? 700 : 400, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{provider}</div>
            <div style={{ padding: "10px 14px", background: i === 0 ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)", color: i === 0 ? "#a855f7" : "#10b981", fontWeight: i === 0 ? 700 : 500, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{inp}</div>
            <div style={{ padding: "10px 14px", background: i === 0 ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)", color: i === 0 ? "#a855f7" : "#f59e0b", fontWeight: i === 0 ? 700 : 500, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{out}</div>
          </React.Fragment>
        ))}
      </div>

      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white", marginTop: "40px", marginBottom: "16px" }}>Tech Stack</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", fontSize: "14px" }}>
        {[
          ["Hono 4.12 + Node.js", "Edge-ready proxy, 3.5× faster than Express"],
          ["Neon DB (Postgres)", "Serverless Postgres — always use pooled connection"],
          ["Upstash Redis", "HTTP-based Redis for caching + rate limiting"],
          ["Next.js 16 App Router", "Landing page, docs, and dashboard in one app"],
          ["NextAuth v4", "JWT sessions, Prisma adapter, email/password auth"],
        ].map(([tool, why], i) => (
          <React.Fragment key={i}>
            <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.9)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{tool}</div>
            <div style={{ padding: "12px 16px", color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{why}</div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}
