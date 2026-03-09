import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing — AI Gateway",
  description: "Simple, transparent pricing. Start free. Scale when you're ready.",
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "Perfect for solo developers evaluating the gateway.",
    cta: "Get Started",
    href: "/signup",
    featured: false,
    features: [
      { label: "10,000 requests / month", included: true },
      { label: "2 API keys", included: true },
      { label: "OpenAI only (no fallback)", included: true },
      { label: "24-hour cache TTL", included: true },
      { label: "7-day log retention", included: true },
      { label: "Dashboard access", included: true },
      { label: "Fallback routing", included: false },
      { label: "Smart routing modes", included: false },
      { label: "Priority support", included: false },
      { label: "SSO / SAML", included: false },
      { label: "SLA", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For production apps that need reliability and cost control.",
    cta: "Start Pro Trial",
    href: "/signup?plan=pro",
    featured: true,
    features: [
      { label: "500,000 requests / month", included: true },
      { label: "20 API keys", included: true },
      { label: "All 3 providers (OpenAI, Gemini, Anthropic)", included: true },
      { label: "7-day cache TTL", included: true },
      { label: "90-day log retention", included: true },
      { label: "Dashboard access", included: true },
      { label: "Fallback routing ✅", included: true },
      { label: "cheap / balanced / quality routing ✅", included: true },
      { label: "Priority support ✅", included: true },
      { label: "SSO / SAML", included: false },
      { label: "99.9% SLA ✅", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Unlimited scale, dedicated support, and custom integrations.",
    cta: "Contact Sales",
    href: "mailto:hello@ai-gateway.dev",
    featured: false,
    features: [
      { label: "Unlimited requests", included: true },
      { label: "Unlimited API keys", included: true },
      { label: "All 3 providers + custom endpoints", included: true },
      { label: "Custom cache TTL", included: true },
      { label: "1-year log retention", included: true },
      { label: "Dashboard access", included: true },
      { label: "Fallback routing ✅", included: true },
      { label: "Custom routing strategies ✅", included: true },
      { label: "Dedicated support ✅", included: true },
      { label: "SSO / SAML ✅", included: true },
      { label: "99.99% SLA ✅", included: true },
    ],
  },
]

const faqs = [
  {
    q: "Is this really open source?",
    a: "Yes. MIT license. You can self-host the entire gateway for free, forever. No usage-based fees, no phoning home.",
  },
  {
    q: "How is cost estimated?",
    a: "Based on token usage × published provider pricing. Updated manually in the codebase — always verify with your provider directly for billing-critical applications.",
  },
  {
    q: "Can I use my own Redis or Postgres?",
    a: "Yes. Just update DATABASE_URL and UPSTASH_REDIS_REST_URL in .env. The gateway works with any Postgres-compatible DB and any Redis-compatible store.",
  },
  {
    q: "What happens when I hit the free tier limit?",
    a: "Requests are rejected with HTTP 402 and a clear error message. Upgrade to Pro to continue. There's no silent degradation.",
  },
  {
    q: "Why is fallback routing Pro-only?",
    a: "Caching saves money. Fallback routing saves uptime. They're different value props — one is cost optimization, the other is production reliability. Pro gets both.",
  },
  {
    q: "Can I switch providers at any time?",
    a: "Yes. Use the X-AI-Gateway-Mode header to choose cheap, balanced, or quality routing per request. No code changes, no redeployment.",
  },
]

export default function PricingPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "72px" }}>
        <h1 style={{ fontSize: "56px", fontWeight: 800, color: "white", marginBottom: "16px" }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.6)" }}>
          Start free. Scale when you&apos;re ready.
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginBottom: "80px" }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: plan.featured ? "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(59,130,246,0.12))" : "rgba(255,255,255,0.03)",
              border: `1px solid ${plan.featured ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "20px",
              padding: "36px",
              flex: "1 1 280px",
              maxWidth: "340px",
              position: "relative",
              boxShadow: plan.featured ? "0 0 60px rgba(168,85,247,0.1)" : "none",
            }}
          >
            {plan.featured && (
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 16px",
                  borderRadius: "100px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                }}
              >
                ⭐ Most Popular
              </div>
            )}
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "white", marginBottom: "8px" }}>{plan.name}</h2>
            <div style={{ marginBottom: "12px" }}>
              <span style={{ fontSize: "48px", fontWeight: 800, color: "#a855f7" }}>{plan.price}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>{plan.period}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", marginBottom: "28px", lineHeight: 1.5 }}>{plan.desc}</p>
            <Link
              href={plan.href}
              style={{
                display: "block",
                textAlign: "center",
                background: plan.featured ? "linear-gradient(135deg, #a855f7, #3b82f6)" : "rgba(255,255,255,0.08)",
                color: "white",
                padding: "14px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "15px",
                marginBottom: "28px",
                boxShadow: plan.featured ? "0 4px 20px rgba(147,51,234,0.3)" : "none",
              }}
            >
              {plan.cta}
            </Link>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
              {plan.features.map((f) => (
                <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ color: f.included ? "#a855f7" : "rgba(255,255,255,0.2)", fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>
                    {f.included ? "✓" : "✗"}
                  </span>
                  <span style={{ color: f.included ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)", fontSize: "14px", lineHeight: 1.4 }}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "36px", fontWeight: 800, color: "white", textAlign: "center", marginBottom: "48px" }}>FAQ</h2>
        {faqs.map((faq) => (
          <div
            key={faq.q}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "10px" }}>{faq.q}</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
