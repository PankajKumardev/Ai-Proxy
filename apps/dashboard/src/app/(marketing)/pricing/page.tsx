import Link from "next/link"
import type { Metadata } from "next"
import { Check, X } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Pricing — AI Gateway",
  description: "Simple, transparent pricing. Start free. Scale when you're ready.",
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Perfect for solo developers evaluating the gateway.",
    cta: "Start for Free",
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
    period: "/mo",
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
      { label: "Fallback routing", included: true },
      { label: "cheap / balanced / quality routing", included: true },
      { label: "Priority support", included: true },
      { label: "SSO / SAML", included: false },
      { label: "99.9% SLA", included: true },
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
      { label: "Fallback routing", included: true },
      { label: "Custom routing strategies", included: true },
      { label: "Dedicated support", included: true },
      { label: "SSO / SAML", included: true },
      { label: "99.99% SLA", included: true },
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
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tighter text-white mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-[#a3a3a3]">
          Start free. Scale when you're ready.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto text-left mb-24">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col p-10 rounded-2xl transition-all ${
              plan.featured 
                ? "bg-[#111111] border border-white/20 shadow-2xl z-10 md:scale-105 ring-1 ring-white/10" 
                : "bg-black border border-white/10 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-medium text-white">{plan.name}</span>
              {plan.featured && (
                <span className="text-xs uppercase font-bold tracking-widest bg-white text-black px-3 py-1 rounded">Popular</span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-5xl font-medium tracking-tighter text-white">{plan.price}</span>
              {plan.price !== "Custom" && <span className="text-[#a3a3a3] font-medium text-base">{plan.period}</span>}
            </div>
            <p className="text-base text-[#888888] mb-10 flex-1">{plan.desc}</p>
            
            <Link
              href={plan.href}
              className={`inline-flex items-center justify-center shrink-0 transition-transform hover:scale-[0.98] w-full rounded-lg h-14 px-6 text-base font-semibold mb-10 ${
                plan.featured ? "bg-white text-black shadow-lg shadow-white/5" : "border border-white/20 bg-transparent text-white hover:bg-white/10"
              }`}
            >
              {plan.cta}
            </Link>

            <div className="border-t border-white/10 pt-8 space-y-4">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full ${f.included ? "bg-white/10 text-white" : "bg-transparent text-[#333333]"}`}>
                    {f.included ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-[15px] leading-tight ${f.included ? "text-[#d4d4d4]" : "text-[#555555] line-through decoration-[#333]"}`}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-medium tracking-tighter text-white text-center mb-10">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-[#111111] border-x border-t border-b border-white/10 rounded-2xl px-6 sm:px-8 mb-4 hover:bg-[#161616] transition-colors data-[open]:bg-[#161616] tracking-tight group/item">
              <AccordionTrigger className="group flex flex-1 w-full items-center justify-between text-left text-base sm:text-lg font-medium text-white hover:no-underline py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#a3a3a3] text-[14px] sm:text-[15px] leading-relaxed pb-6 text-left">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
