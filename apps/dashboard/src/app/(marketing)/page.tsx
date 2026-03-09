// apps/dashboard/src/app/(marketing)/page.tsx
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Gateway — Open-source LLM Proxy with Caching & Fallback Routing",
  description:
    "Stop paying for duplicate AI API calls. AI Gateway adds caching, fallback routing, and usage analytics between your app and OpenAI, Gemini, or Anthropic.",
}

const codeExample = `import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://your-gateway.railway.app/v1",
  apiKey: "sk-gw-xxxx",  // your gateway key
})

// Any supported model — OpenAI, Gemini, or Anthropic ↓
const res = await openai.chat.completions.create({
  model: "gpt-5.2",       // or: gemini-2.5-flash, claude-sonnet-4-6
  messages: [{ role: "user", content: "Hello!" }],
})`

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          padding: "120px 24px 80px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Glow blob */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(ellipse, rgba(147,51,234,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-block",
            background: "rgba(147,51,234,0.1)",
            border: "1px solid rgba(147,51,234,0.3)",
            borderRadius: "100px",
            padding: "6px 16px",
            fontSize: "13px",
            color: "#a855f7",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          ✦ Open-source & self-hostable
        </div>
        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "24px",
            color: "white",
          }}
        >
          Stop paying for{" "}
          <span className="gradient-text">duplicate AI calls</span>
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          One proxy. Three providers. Response caching, automatic fallbacks, and
          real-time cost tracking — with zero changes to your existing code.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/signup"
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              color: "white",
              padding: "14px 32px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 0 40px rgba(147,51,234,0.4)",
            }}
          >
            Get Started Free →
          </Link>
          <Link
            href="/docs/introduction"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "white",
              padding: "14px 32px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            View Docs →
          </Link>
        </div>

        {/* Code snippet */}
        <div
          style={{
            marginTop: "64px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "left",
            maxWidth: "700px",
            margin: "64px auto 0",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <pre
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: "13px",
              lineHeight: 1.8,
              overflow: "auto",
              margin: 0,
            }}
          >
            <code>{codeExample}</code>
          </pre>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "24px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "64px",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "3", label: "AI Providers" },
            { value: "< 5 min", label: "Setup Time" },
            { value: "40%", label: "Avg Cost Saved" },
            { value: "MIT", label: "License" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#a855f7" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "40px", fontWeight: 800, color: "white", marginBottom: "64px" }}>
          How it works
        </h2>
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { n: 1, title: "Point your app at the gateway", desc: "Change one line — set baseURL to your gateway. Same OpenAI SDK, same API format." },
            { n: 2, title: "Gateway handles everything", desc: "Caching, rate limiting, automatic fallbacks, cost tracking. Zero code changes needed." },
            { n: 3, title: "Monitor in real time", desc: "Track tokens, costs, cache hit rates, and provider usage in your dashboard." },
          ].map((step) => (
            <div
              key={step.n}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "32px",
                maxWidth: "320px",
                flex: "1 1 280px",
                transition: "transform 0.2s, border-color 0.2s",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))",
                  border: "1px solid rgba(168,85,247,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#a855f7",
                  marginBottom: "20px",
                }}
              >
                {step.n}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "white", marginBottom: "12px" }}>{step.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 24px 100px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "40px", fontWeight: 800, color: "white", marginBottom: "64px" }}>
          Everything you need
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            { icon: "🗄", title: "Response Caching", desc: "SHA-256 exact match caching with per-plan TTL (24h free, 7 days Pro). Cache hits cost $0.00." },
            { icon: "🔀", title: "Fallback Routing", desc: "Auto-retry across 3 providers with health tracking. If OpenAI is down, Gemini picks up instantly." },
            { icon: "📊", title: "Usage Analytics", desc: "Real-time token counts, cost breakdown, cache hit rate, and per-model statistics." },
            { icon: "🔌", title: "OpenAI Compatible", desc: "Drop-in replacement. Change baseURL, keep your existing SDK, models, and prompts." },
            { icon: "⚡", title: "Smart Routing", desc: "Choose cheap, balanced, or quality routing per request. Different strategy for each use case." },
            { icon: "🔐", title: "Secure by Default", desc: "API keys stored as SHA-256 hashes. Rate limiting, CORS, body size limits — all built in." },
          ].map((f) => (
            <div
              key={f.title}
              className="stat-card"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "28px",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "white", marginBottom: "10px" }}>{f.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Diagram */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "36px", fontWeight: 800, color: "white", marginBottom: "48px" }}>Architecture</h2>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "40px",
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.8)",
            fontSize: "14px",
            lineHeight: 2,
            textAlign: "left",
          }}
        >
          <pre style={{ margin: 0, overflow: "auto" }}>{`        ┌─────────────┐
        │  Your App   │
        └──────┬──────┘
               │ POST /v1/chat/completions
               ▼
        ┌─────────────────────────┐
        │       AI Gateway        │
        │                         │
        │  Auth → Quota → Cache   │
        │  Rate Limit → Router    │
        │  Logger → Cost Track    │
        └──────┬──────────────────┘
               │
   ┌───────────┼───────────┐
   ▼           ▼           ▼
OpenAI      Gemini    Anthropic`}</pre>
        </div>
      </section>

      {/* Pricing teaser */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "40px", fontWeight: 800, color: "white", marginBottom: "16px" }}>Simple pricing</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "48px", fontSize: "18px" }}>Start free. Scale when you&apos;re ready.</p>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { name: "Free", price: "$0", desc: "10K requests/mo", cta: "Start for Free", featured: false },
            { name: "Pro", price: "$29", desc: "500K requests/mo", cta: "Start Pro Trial", featured: true },
            { name: "Enterprise", price: "Custom", desc: "Unlimited", cta: "Contact Sales", featured: false },
          ].map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.featured ? "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.15))" : "rgba(255,255,255,0.03)",
                border: `1px solid ${plan.featured ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "16px",
                padding: "32px",
                minWidth: "220px",
                flex: "1 1 200px",
                maxWidth: "280px",
                boxShadow: plan.featured ? "0 0 40px rgba(168,85,247,0.15)" : "none",
              }}
            >
              {plan.featured && (
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#a855f7", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>⭐ Most Popular</div>
              )}
              <div style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>{plan.name}</div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#a855f7", margin: "12px 0 4px" }}>{plan.price}<span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>{plan.price !== "Custom" ? "/mo" : ""}</span></div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "24px" }}>{plan.desc}</div>
              <Link
                href={plan.name === "Enterprise" ? "mailto:hello@ai-gateway.dev" : "/signup"}
                style={{
                  display: "block",
                  background: plan.featured ? "linear-gradient(135deg, #a855f7, #3b82f6)" : "rgba(255,255,255,0.08)",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <Link href="/pricing" style={{ display: "inline-block", marginTop: "32px", color: "#a855f7", textDecoration: "none", fontWeight: 600 }}>
          See full pricing details →
        </Link>
      </section>

      {/* CTA */}
      <section
        style={{
          margin: "0 24px 100px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
          background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1))",
          border: "1px solid rgba(168,85,247,0.2)",
          borderRadius: "24px",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "40px", fontWeight: 800, color: "white", marginBottom: "16px" }}>
          Start saving on AI costs today
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", marginBottom: "40px" }}>
          Free forever. Self-hosted. Your data stays yours.
        </p>
        <Link
          href="/signup"
          style={{
            background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            color: "white",
            padding: "16px 40px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: 700,
            boxShadow: "0 0 40px rgba(147,51,234,0.4)",
          }}
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "40px 24px",
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: "14px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>⚡ AI Gateway</div>
          <div style={{ display: "flex", gap: "32px" }}>
            <Link href="/docs/introduction" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Docs</Link>
            <a href="https://github.com" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>GitHub</a>
            <Link href="/pricing" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Pricing</Link>
          </div>
          <div>© 2026 AI Gateway — Open Source (MIT)</div>
        </div>
      </footer>
    </>
  )
}
