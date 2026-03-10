"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Activity, ShieldCheck, Box, Database, Split, Key, Globe, Check, Code2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";

export function ClientPage() {
  const bentoRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (bentoRef.current) {
      const rect = bentoRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 1. Hero & Minimal Editor Block */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight mb-8 text-white mt-4">
          Stop paying for <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">duplicate AI calls</span>
        </h1>
        
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          One proxy. Three providers. Response caching, automatic fallbacks, and real-time cost tracking, with zero changes to your existing code.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup" className="group relative inline-flex items-center justify-center shrink-0 whitespace-nowrap transition-transform hover:bg-white/90 text-base h-12 px-8 rounded-md bg-white text-black font-semibold overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10 flex items-center">Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></span>
          </Link>
          <Link href="/docs/introduction" className="inline-flex items-center justify-center shrink-0 whitespace-nowrap transition-colors hover:bg-white/5 text-base h-12 px-8 rounded-md font-medium border border-white/10 text-white bg-transparent">
            View Docs
          </Link>
        </div>

        <div className="mt-20 max-w-3xl mx-auto text-left relative group">
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/50">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-neutral-500" />
                <span className="text-xs text-neutral-500 font-mono">api.ts</span>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed font-mono">
                <code dangerouslySetInnerHTML={{ __html: `import <span class="text-[#c678dd]">OpenAI</span> from <span class="text-[#98c379]">"openai"</span>

<span class="text-[#c678dd]">const</span> <span class="text-[#e5c07b]">openai</span> = <span class="text-[#c678dd]">new</span> <span class="text-[#e5c07b]">OpenAI</span>({
  baseURL: <span class="text-[#98c379]">"https://gateway.yourdomain.com"</span>,
  apiKey: process.env.<span class="text-[#d19a66]">GATEWAY_KEY</span>,
})

<span class="text-[#c678dd]">const</span> res = <span class="text-[#c678dd]">await</span> <span class="text-[#e5c07b]">openai</span>.chat.completions.create({
  model: <span class="text-[#98c379]">"gpt-4-turbo"</span>,
  messages: [{ role: <span class="text-[#98c379]">"user"</span>, content: <span class="text-[#98c379]">"..."</span> }],
})`}} />
              </pre>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. Trust & Performance Bar */}
      <section className="border-y border-white/10 bg-black py-6 mt-12 mb-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center sm:justify-between items-center gap-8 px-6">
          <div className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors duration-300 cursor-pointer">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">Sub-10ms overhead</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors duration-300 cursor-pointer">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">100% Data Privacy</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors duration-300 cursor-pointer">
            <Box className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">Open-source & self-hostable</span>
          </div>
        </div>
      </section>

      {/* 3. Supported Models Marquee */}
      <section className="pt-12 pb-12 px-6 max-w-full overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold tracking-tight text-white">One API for every frontier model.</h2>
        </div>
        <div className="relative flex overflow-hidden w-full max-w-6xl mx-auto">
          {/* Fading edges left/right */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 transition-all"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 transition-all"></div>
          
          <Marquee 
            speed={40} 
            gradient={false} 
            pauseOnHover={true}
            autoFill={true}
            className="overflow-hidden"
          >
            {[
              "OpenAI", "Anthropic", "Gemini", "Mistral", "Llama", "Cohere"
            ].map((model, i) => (
              <div key={i} className="text-2xl font-bold tracking-tighter text-neutral-500 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap pr-16 md:pr-24">
                {model}
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* 4. Code Comparison (Side-by-Side) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">Drop-in replacement.</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">Change a single line of code. We handle the rest natively.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch pt-4">
          <div className="bg-[#0A0A0A] border border-red-500/20 rounded-xl overflow-hidden shadow-2xl opacity-60 group/left">
            <div className="flex justify-between items-center px-4 py-3 border-b border-red-500/10 bg-black/50">
              <span className="text-xs text-neutral-500 font-mono">Direct to OpenAI</span>
              <span className="text-xs text-red-500/80 font-medium bg-red-500/10 px-2 py-0.5 rounded-sm">High Latency</span>
            </div>
            <div className="p-6 relative">
              <pre className="text-[13px] leading-relaxed text-neutral-500 font-mono">
                <code dangerouslySetInnerHTML={{ __html: `import OpenAI from "openai"

const openai = new OpenAI({
  <span class="text-red-500/50 line-through">baseURL: "https://api.openai.com/v1",</span>
  apiKey: process.env.OPENAI_API_KEY,
})

const res = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{ role: "user", content: "..." }],
})`}} />
              </pre>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl group/right">
            <div className="flex justify-between items-center px-4 py-3 border-b border-emerald-500/20 bg-black/50">
              <span className="text-xs text-neutral-300 font-mono">Via AI Gateway</span>
              <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-sm">Cached • 8ms</span>
            </div>
            <div className="p-6 relative">
              <pre className="text-[13px] leading-relaxed font-mono">
                <code dangerouslySetInnerHTML={{ __html: `import <span class="text-[#c678dd]">OpenAI</span> from <span class="text-[#98c379]">"openai"</span>

<span class="text-[#c678dd]">const</span> <span class="text-[#e5c07b]">openai</span> = <span class="text-[#c678dd]">new</span> <span class="text-[#e5c07b]">OpenAI</span>({
  <span class="text-white bg-white/10 px-1 py-0.5 ml-[-4px] rounded font-bold">baseURL: <span class="text-[#98c379]">"https://gateway.yourdomain.com"</span>,</span>
  apiKey: process.env.<span class="text-[#d19a66]">GATEWAY_KEY</span>,
})

<span class="text-[#c678dd]">const</span> res = <span class="text-[#c678dd]">await</span> <span class="text-[#e5c07b]">openai</span>.chat.completions.create({
  model: <span class="text-[#98c379]">"gpt-4-turbo"</span>,
  messages: [{ role: <span class="text-[#98c379]">"user"</span>, content: <span class="text-[#98c379]">"..."</span> }],
})`}} />
              </pre>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. Core Architecture (Bento Grid) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">Built for edge performance.</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">Engineered from the ground up for maximum speed and absolute reliability.</p>
        </div>

        <div 
          ref={bentoRef}
          onMouseMove={handleMouseMove}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)] relative group/bento"
        >
          {/* Spotlight overlay on the entire bento grid */}
          <div 
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/bento:opacity-100 z-10"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
            }}
          />

          <div className="md:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-xl p-8 hover:bg-neutral-900/50 transition-colors flex flex-col justify-end relative overflow-hidden group/card hover:-translate-y-1 hover:border-white/20 duration-300">
            <div className="w-10 h-10 rounded border border-white/10 bg-black flex items-center justify-center text-white mb-auto mt-2 transition-colors group-hover/card:border-white/30">
              <Database className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Edge Caching</h3>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md relative z-10">Instant responses for exact-match payloads via native Redis integration. Stop paying upstream providers for repetitive queries.</p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 hover:bg-neutral-900/50 transition-colors flex flex-col justify-end relative overflow-hidden group/card hover:-translate-y-1 hover:border-white/20 duration-300">
             <div className="w-10 h-10 rounded border border-white/10 bg-black flex items-center justify-center text-white mb-auto mt-2 transition-colors group-hover/card:border-white/30">
              <Activity className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Zero-Latency Logging</h3>
            <p className="text-neutral-400 text-sm leading-relaxed relative z-10">Non-blocking background queues securely log every request metric to your database without adding latency.</p>
          </div>

          <div className="lg:col-span-3 bg-[#0A0A0A] border border-white/10 rounded-xl p-8 hover:bg-neutral-900/50 transition-colors flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 gap-y-16 relative overflow-hidden group/card hover:-translate-y-1 hover:border-white/20 duration-300">
             <div className="max-w-lg z-10 order-2 sm:order-1">
              <h3 className="text-2xl font-semibold text-white mb-3">Automatic Fallbacks</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">If OpenAI API limits out or throws a 500 error, the gateway invisibly reroutes the identical prompt payload to Google Gemini or Anthropic Claude within milliseconds.</p>
            </div>
            <div className="w-12 h-12 rounded border border-white/10 bg-black flex items-center justify-center text-white shrink-0 order-1 sm:order-2 shadow-inner mb-auto sm:mb-0 sm:mt-auto transition-colors group-hover/card:border-white/30">
              <Split className="w-6 h-6 text-neutral-300" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. Request Lifecycle (Visual Flow) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">How a request travels.</h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">Zero-trust architecture ensuring fast, resilient API resolution.</p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 max-w-4xl mx-auto py-8">
          {/* Static dashed line */}
          <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-[1px] -translate-y-1/2 border-t border-dashed border-white/20 z-0"></div>
          
          {/* Animated dot moving across the line */}
          <motion.div 
            className="hidden md:block absolute top-1/2 left-[5%] w-2 h-2 rounded-full bg-white z-10 -translate-y-[calc(50%+1px)] shadow-[0_0_15px_3px_rgba(255,255,255,0.4)]"
            animate={{ left: ["5%", "95%"] }}
            transition={{ ease: "easeInOut", duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
          />

          {/* Nodes */}
          {[
            { label: "Your App", icon: Code2, delay: 0 },
            { label: "Gateway Cache", icon: Database, delay: 0.75 },
            { label: "Router", icon: Split, delay: 1.5 },
            { label: "Provider", icon: Globe, delay: 2.25 }
          ].map((node, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-4">
              <motion.div 
                className="w-16 h-16 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-lg relative"
                animate={{ 
                  borderColor: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.1)"],
                  backgroundColor: ["rgba(10,10,10,1)", "rgba(30,30,30,1)", "rgba(10,10,10,1)"],
                }}
                transition={{ 
                  duration: 0.6, 
                  times: [0, 0.5, 1], 
                  repeat: Infinity, 
                  repeatDelay: 2.9,
                  delay: node.delay 
                }}
              >
                <node.icon className="w-6 h-6 text-neutral-300" />
              </motion.div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{node.label}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 7. Features Map */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10"
      >
        <div className="text-left mb-16 md:text-center md:mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">Core architecture.</h2>
          <p className="text-lg text-neutral-400 max-w-2xl md:mx-auto">Built for maximum performance, security, and developer experience.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {[
            { icon: Database, title: "Semantic Caching", desc: "Instantly return cached responses for semantically similar prompts to save costs and reduce latency." },
            { icon: Split, title: "Smart Routing", desc: "Dynamically route requests based on model availability, latency, or provider costs." },
            { icon: Activity, title: "Cost Analytics", desc: "Real-time visibility into your token usage, provider costs, and cache savings." },
            { icon: ShieldCheck, title: "Rate Limiting", desc: "Protect your upstream API keys with customizable global and per-user rate limits." },
            { icon: Key, title: "BYOK", desc: "Bring your own keys. Your credentials never leave your infrastructure when self-hosting." },
            { icon: Globe, title: "Edge Deployment", desc: "Deploy globally on Vercel Edge, Cloudflare Workers, or natively via Docker." }
          ].map((feature, i) => (
            <div key={i} className="group/feature flex flex-col gap-3 p-6 -mx-6 rounded-2xl transition-all duration-300 hover:bg-[#0A0A0A] border border-transparent hover:border-white/10 hover:-translate-y-1">
              <feature.icon className="w-5 h-5 text-neutral-400 group-hover/feature:text-white transition-colors" />
              <h3 className="text-base font-semibold text-white group-hover/feature:text-white transition-colors">{feature.title}</h3>
              <p className="text-[14px] text-neutral-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 8. Pricing Teaser */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">Simple, transparent pricing.</h2>
        <p className="text-lg text-neutral-400 mb-16">Start free. Scale when you're ready.</p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {[
            {
              name: "Free",
              price: "$0",
              desc: "Perfect for solo developers sharing open-source tools.",
              cta: "Start for Free",
              featured: false,
              features: ["10,000 requests / month", "OpenAI only", "24-hour cache TTL", "Dashboard access", "Community support"],
            },
            {
              name: "Pro",
              price: "$29",
              desc: "For production apps that need reliability and speed.",
              cta: "Start Pro Trial",
              featured: true,
              features: ["500,000 requests / month", "All 3 providers", "7-day cache TTL", "Smart routing & fallbacks", "Priority email support"],
            },
            {
              name: "Enterprise",
              price: "Custom",
              desc: "Unlimited scale and custom integrations for teams.",
              cta: "Contact Sales",
              featured: false,
              features: ["Unlimited requests", "All providers + custom", "Custom cache TTL", "Dedicated routing strategies", "24/7 SLA"],
            },
          ].map((plan) => (
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
                {plan.price !== "Custom" && <span className="text-neutral-500 font-medium text-sm">/mo</span>}
              </div>
              <p className="text-sm text-neutral-400 mb-8">{plan.desc}</p>
              
              <Link
                href={plan.name === "Enterprise" ? "mailto:hello@ai-gateway.dev" : "/signup"}
                className={cn("relative overflow-hidden inline-flex items-center justify-center shrink-0 transition-transform hover:scale-[0.98] w-full rounded-md h-10 px-4 text-sm font-medium mb-8", plan.featured ? "bg-white text-black hover:bg-neutral-200" : "bg-white/5 border border-white/10 text-white hover:bg-white/10")}
              >
                {/* Sheen effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover/plan:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10">{plan.cta}</span>
              </Link>

              <div className="pt-6 border-t border-white/5 space-y-3 flex-1">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 9. FAQ & Bottom CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 px-6 max-w-2xl mx-auto border-t border-white/10"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-8 text-center">Frequently asked questions</h2>
        
        <Accordion className="w-full mb-32 transition-all duration-150">
          {[
            { q: "Is it really free to self-host?", a: "Yes. The AI Gateway core is open-source under the MIT license. You can run it on your own infrastructure entirely for free.", value: "item-1" },
            { q: "Do I need to change my existing prompts?", a: "No. AI Gateway is 100% compatible with the standard OpenAI API format. Just point your client at the gateway instead of api.openai.com.", value: "item-2" },
            { q: "How secure are my API keys?", a: "Keys are encrypted at rest using AES-256. If you self-host, your keys never leave your infrastructure.", value: "item-3" },
            { q: "Does response caching work with streaming?", a: "Yes. Cached responses are instantly streamed back in the identical SSE format your client expects.", value: "item-4" }
          ].map((faq) => (
            <AccordionItem key={faq.value} value={faq.value} className="border-b border-white/10 py-2 transition-all">
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
          <Link href="/signup" className="group relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap hover:bg-white/90 rounded-md bg-white text-black font-semibold h-14 px-10 text-lg shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10">Get Started Free</span>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
