"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
];

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
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-[#a3a3a3]">
          Start free. Scale when you're ready.
        </p>
      </motion.div>

      {/* Plan cards */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left mb-24 items-stretch"
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "group/plan relative flex flex-col p-8 rounded-xl bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-2 hover:border-white/20", 
              plan.featured 
                ? "border border-white/40 shadow-[0_0_30px_-10px_rgba(255,255,255,0.2)] z-10 hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)]" 
                : "border border-white/10"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-semibold text-white">{plan.name}</span>
              {plan.featured && <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 text-white px-2 py-1 rounded-sm">Popular</span>}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-semibold tracking-tight text-white">{plan.price}</span>
              {plan.price !== "Custom" && <span className="text-neutral-500 font-medium text-sm">{plan.period}</span>}
            </div>
            <p className="text-sm text-neutral-400 mb-8 flex-1">{plan.desc}</p>
            
            <Link
              href={plan.href}
              className={cn("relative overflow-hidden inline-flex items-center justify-center shrink-0 transition-transform hover:scale-[0.98] w-full rounded-md h-10 px-4 text-sm font-medium mb-8", plan.featured ? "bg-white text-black hover:bg-neutral-200" : "bg-white/5 border border-white/10 text-white hover:bg-white/10")}
            >
              {/* Sheen effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover/plan:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10">{plan.cta}</span>
            </Link>

            <div className="pt-6 border-t border-white/5 space-y-3 flex-1">
              {plan.features.map((f, i) => (
                <div key={i} className={cn("flex items-center gap-3", !f.included && "opacity-50")}>
                  {f.included ? (
                    <Check className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <X className="w-4 h-4 text-neutral-700" />
                  )}
                  <span className="text-sm text-neutral-300">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* FAQ & Bottom CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-6 max-w-2xl mx-auto border-t border-white/10"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-8 text-center">Frequently asked questions</h2>
        
        <Accordion className="w-full mb-32 transition-all duration-150">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/10 py-2 transition-all">
              <AccordionTrigger className="text-left text-base font-medium text-white hover:no-underline hover:text-neutral-300 transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 text-[14px] leading-relaxed pb-4 mt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-8">
            Ready to stop burning API credits?
          </h2>
          <Link href="/signup" className="group relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap transition-transform hover:scale-95 rounded-md bg-white text-black font-semibold h-14 px-10 text-lg shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10">Get Started Free</span>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
