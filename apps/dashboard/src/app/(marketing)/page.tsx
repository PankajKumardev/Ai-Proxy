// apps/dashboard/src/app/(marketing)/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Database, Server, Split, Code, Activity, ShieldCheck, Star, Box, Compass, CloudLightning, RefreshCw, Layers, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AI Gateway — Open-source LLM Proxy with Caching & Fallback Routing",
  description:
    "Stop paying for duplicate AI API calls. AI Gateway adds caching, fallback routing, and usage analytics between your app and OpenAI, Gemini, or Anthropic.",
};

const codeExample = `import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://your-gateway.railway.app/v1",
  apiKey: "sk-gw-xxxx",  // your gateway key
})

// Any supported model — OpenAI, Gemini, or Anthropic ↓
const res = await openai.chat.completions.create({
  model: "gpt-5.2",       // or: gemini-2.5-flash, claude-sonnet-4-6
  messages: [{ role: "user", content: "Hello!" }],
})`;

export default function HomePage() {
  return (
    <>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-transparent px-4 py-1.5 text-sm font-medium text-[#d4d4d4] mb-8">
          <Box className="w-3.5 h-3.5 mr-2 text-[#a3a3a3]" /> Open-source & self-hostable
        </div>

        <h1 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight mb-8 text-white mt-4">
          Stop paying for <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a3a3a3]">duplicate AI calls</span>
        </h1>
        
        <p className="text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-12 leading-relaxed">
          One proxy. Three providers. Response caching, automatic fallbacks, and real-time cost tracking — with zero changes to your existing code.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup" className="inline-flex items-center justify-center shrink-0 whitespace-nowrap transition-transform hover:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-base h-12 px-8 rounded-md bg-white text-black font-semibold">
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/docs/introduction" className="inline-flex items-center justify-center shrink-0 whitespace-nowrap transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-base h-12 px-8 rounded-md font-medium border border-white/10 text-white bg-transparent">
            View Docs
          </Link>
        </div>

        {/* Code snippet relative group */}
        <div className="mt-20 max-w-3xl mx-auto text-left relative group">
          <div className="relative bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* macOS titlebar */}
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#161616]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="mx-auto text-xs text-[#888888] font-mono">api.ts</div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-[13px] leading-loose text-[#d4d4d4] font-mono">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Code Comparison */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white mb-4">Drop-in replacement.</h2>
          <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">Change a single line of code. We handle the rest.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch pt-4">
          <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-[#161616]">
              <span className="text-xs text-[#888888] font-medium uppercase tracking-widest">Direct to OpenAI</span>
              <span className="text-xs text-[#ff5f56] font-medium border border-[#ff5f56]/30 bg-[#ff5f56]/10 px-2 py-0.5 rounded-full">High Latency</span>
            </div>
            <div className="p-6">
              <pre className="text-[13px] leading-loose text-[#888888] font-mono">
                <code dangerouslySetInnerHTML={{ __html: `import OpenAI from "openai"

const openai = new OpenAI({
  <span class="text-[#ff5f56] line-through">baseURL: "https://api.openai.com/v1",</span>
  apiKey: process.env.OPENAI_API_KEY,
})

const res = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{ role: "user", content: "..." }],
})`}} />
              </pre>
            </div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full pointer-events-none -mt-32 -mr-32" />
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-[#161616] relative z-10">
              <span className="text-xs text-[#888888] font-medium uppercase tracking-widest">Via AI Gateway</span>
              <span className="text-xs text-[#27c93f] font-medium border border-[#27c93f]/30 bg-[#27c93f]/10 px-2 py-0.5 rounded-full">Cached • 8ms</span>
            </div>
            <div className="p-6 relative z-10">
              <pre className="text-[13px] leading-loose text-[#d4d4d4] font-mono">
                <code dangerouslySetInnerHTML={{ __html: `import OpenAI from "openai"

const openai = new OpenAI({
  <span class="text-white bg-white/10 px-1 py-0.5 rounded font-bold">baseURL: "https://gateway.yourdomain.com",</span>
  apiKey: process.env.GATEWAY_KEY,
})

const res = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{ role: "user", content: "..." }],
})`}} />
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Performance Bar */}
      <section className="border-y border-white/10 bg-[#111111] py-8 border-dashed">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-8 px-6">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#a3a3a3]" />
            <span className="text-sm font-medium text-[#d4d4d4]">Sub-10ms overhead</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#a3a3a3]" />
            <span className="text-sm font-medium text-[#d4d4d4]">100% Data Privacy</span>
          </div>
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-[#a3a3a3]" />
            <span className="text-sm font-medium text-[#d4d4d4]">Self-hosted Open Source</span>
          </div>
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-[#a3a3a3]" />
            <span className="text-sm font-medium text-[#d4d4d4]">Zero Vendor Lock-in</span>
          </div>
        </div>
      </section>

      {/* Advanced Bento Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white mb-4">Core Architecture</h2>
          <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">Built from the ground up for maximum speed and absolute reliability.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          {/* Caching - Wide */}
          <div className="md:col-span-2 bg-[#111] border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:bg-[#161616] transition-colors flex flex-col justify-end">
            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white-10 transition-colors">
              <Database className="w-32 h-32" strokeWidth={1} />
            </div>
            <div className="w-10 h-10 rounded border border-white/20 bg-black flex items-center justify-center text-white mb-auto mt-2 shadow-inner shadow-white/10">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2 relative z-10">Edge Caching Layer</h3>
            <p className="text-[#a3a3a3] text-sm leading-relaxed max-w-md relative z-10">Instant responses for exact-match payloads via native Redis integration. Stop paying OpenAI for repetitive queries.</p>
          </div>

          {/* Logging - Square */}
          <div className="bg-[#111] border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:bg-[#161616] transition-colors flex flex-col justify-end">
            <div className="absolute -right-4 -bottom-4 text-white/5">
              <Activity className="w-40 h-40" strokeWidth={1} />
            </div>
            <div className="w-10 h-10 rounded border border-white/20 bg-black flex items-center justify-center text-white mb-auto mt-2 shadow-inner shadow-white/10">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2 relative z-10">Zero-Latency Logging</h3>
            <p className="text-[#a3a3a3] text-sm leading-relaxed relative z-10">Non-blocking background workers securely log every request metric.</p>
          </div>

          {/* Fallbacks - Wide */}
          <div className="lg:col-span-3 bg-[#111] border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:bg-[#161616] transition-colors flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 gap-y-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none" />
            
            <div className="max-w-lg z-10 order-2 sm:order-1">
              <h3 className="text-2xl font-medium text-white mb-3">Automated Provider Fallbacks</h3>
              <p className="text-[#a3a3a3] text-sm leading-relaxed">If OpenAI API limits out or throws a 500 error, the gateway invisibly reroutes the identical prompt payload to Google Gemini or Anthropic Claude within milliseconds. Absolute 100% uptime for production.</p>
            </div>

            <div className="w-12 h-12 rounded border border-white/20 bg-black flex items-center justify-center text-white shrink-0 order-1 sm:order-2 shadow-inner shadow-white/10 mb-auto sm:mb-0 sm:mt-auto">
              <Split className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>



      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white mb-4">Everything you need</h2>
          <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">Enterprise-grade capabilities out of the box.</p>
        </div>
        
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 auto-rows-[minmax(260px,auto)]">
          {/* Caching - Wide col-span-2 */}
          <div className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-2xl p-8 hover:bg-[#161616] transition-colors relative overflow-hidden flex flex-col justify-end group">
            <div className="absolute top-0 right-0 p-8 text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none">
              <Database className="w-48 h-48 -mr-16 -mt-16" strokeWidth={1} />
            </div>
            <div className="w-12 h-12 rounded-lg border border-white/20 bg-black flex items-center justify-center text-white mb-auto shadow-inner shadow-white/5 relative z-10">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="relative z-10 mt-8">
              <h3 className="text-xl font-medium text-white mb-2">Response Caching</h3>
              <p className="text-[#a3a3a3] text-[15px] leading-relaxed max-w-sm">SHA-256 exact match caching with per-plan TTL. Cache hits return instantly and cost $0.00.</p>
            </div>
          </div>

          {/* Fallback - Tall row-span-2 col-span-1 */}
          <div className="lg:col-span-1 lg:row-span-2 bg-[#111111] border border-white/10 rounded-2xl p-8 hover:bg-[#161616] transition-colors relative overflow-hidden flex flex-col justify-start group">
             <div className="absolute bottom-0 right-0 p-8 text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none">
                <Split className="w-48 h-48 -mr-12 -mb-12" strokeWidth={1} />
             </div>
             <div className="w-12 h-12 rounded-lg border border-white/20 bg-black flex items-center justify-center text-white mb-8 shadow-inner shadow-white/5 relative z-10">
              <Split className="w-6 h-6 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-white mb-2">Fallback Routing</h3>
              <p className="text-[#a3a3a3] text-[15px] leading-relaxed">Auto-retry across 3 providers with health tracking. If OpenAI is down, Gemini picks up instantly.</p>
            </div>
          </div>

          {/* Security - Tall row-span-2 col-span-1 */}
          <div className="lg:col-span-1 lg:row-span-2 bg-[#111111] border border-white/10 rounded-2xl p-8 hover:bg-[#161616] transition-colors relative overflow-hidden flex flex-col justify-start group">
            <div className="absolute bottom-0 left-0 p-8 text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none">
              <ShieldCheck className="w-48 h-48 -ml-12 -mb-12" strokeWidth={1} />
            </div>
            <div className="w-12 h-12 rounded-lg border border-white/20 bg-black flex items-center justify-center text-white mb-8 shadow-inner shadow-white/5 relative z-10">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-white mb-2">Secure by Default</h3>
              <p className="text-[#a3a3a3] text-[15px] leading-relaxed">API keys stored as SHA-256 hashes. Built-in rate limiting.</p>
            </div>
          </div>

          {/* Analytics - Standard col-span-1 */}
          <div className="lg:col-span-1 bg-[#111111] border border-white/10 rounded-2xl p-8 hover:bg-[#161616] transition-colors relative overflow-hidden flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-lg border border-white/20 bg-black flex items-center justify-center text-white mb-8 shadow-inner shadow-white/5 relative z-10">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-white mb-2">Usage Analytics</h3>
              <p className="text-[#a3a3a3] text-[15px] leading-relaxed">Real-time token counts, cost breakdowns.</p>
            </div>
          </div>

          {/* OpenAI - Standard col-span-1 */}
          <div className="lg:col-span-1 bg-[#111111] border border-white/10 rounded-2xl p-8 hover:bg-[#161616] transition-colors relative overflow-hidden flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-lg border border-white/20 bg-black flex items-center justify-center text-white mb-8 shadow-inner shadow-white/5 relative z-10">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-white mb-2">OpenAI Compatible</h3>
              <p className="text-[#a3a3a3] text-[15px] leading-relaxed">Drop-in replacement. Same SDKs and prompts.</p>
            </div>
          </div>

          {/* Smart Routing - Wide col-span-4 */}
          <div className="lg:col-span-4 bg-[#111111] border border-white/10 rounded-2xl p-8 hover:bg-[#161616] transition-colors relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between group">
             <div className="absolute top-0 right-0 p-8 text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none">
              <Server className="w-64 h-64 -mr-16 -mt-16" strokeWidth={1} />
            </div>
            <div className="max-w-xl relative z-10 order-2 md:order-1 mt-8 md:mt-0">
              <h3 className="text-2xl font-medium text-white mb-3">Smart Routing Control</h3>
              <p className="text-[#a3a3a3] text-[15px] leading-relaxed">Choose cheap, balanced, or quality routing per request. Set entirely different fallback strategies for discrete LLM use cases dynamically.</p>
            </div>
            <div className="w-16 h-16 rounded-xl border border-white/20 bg-black flex items-center justify-center text-white shadow-inner shadow-white/5 relative z-10 order-1 md:order-2 shrink-0">
              <Server className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center border-t border-white/10">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white mb-4">Simple pricing</h2>
        <p className="text-lg text-[#a3a3a3] mb-16">Start free. Scale when you're ready.</p>
        
        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto text-left">
          {[
            {
              name: "Free",
              price: "$0",
              desc: "Perfect for solo developers evaluating the gateway.",
              cta: "Start for Free",
              featured: false,
              features: [
                { label: "10,000 requests / month", included: true },
                { label: "OpenAI only", included: true },
                { label: "24-hour cache TTL", included: true },
                { label: "Dashboard access", included: true },
                { label: "Fallback routing", included: false },
                { label: "Smart routing modes", included: false },
              ],
            },
            {
              name: "Pro",
              price: "$29",
              desc: "For production apps that need reliability.",
              cta: "Start Pro Trial",
              featured: true,
              features: [
                { label: "500,000 requests / month", included: true },
                { label: "All 3 providers", included: true },
                { label: "7-day cache TTL", included: true },
                { label: "Dashboard access", included: true },
                { label: "Fallback routing", included: true },
                { label: "cheap / balanced routing", included: true },
              ],
            },
            {
              name: "Enterprise",
              price: "Custom",
              desc: "Unlimited scale and custom integrations.",
              cta: "Contact Sales",
              featured: false,
              features: [
                { label: "Unlimited requests", included: true },
                { label: "All providers + custom", included: true },
                { label: "Custom cache TTL", included: true },
                { label: "Dashboard access", included: true },
                { label: "Fallback routing", included: true },
                { label: "Custom routing strategies", included: true },
              ],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col p-10 rounded-2xl transition-all", 
                plan.featured 
                  ? "bg-[#111111] border border-white/20 shadow-2xl z-10 md:scale-105 ring-1 ring-white/10" 
                  : "bg-black border border-white/10 opacity-80 hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-medium text-white">{plan.name}</span>
                {plan.featured && (
                  <span className="text-xs uppercase font-bold tracking-widest bg-white text-black px-3 py-1 rounded">Popular</span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-medium tracking-tighter text-white">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-[#a3a3a3] font-medium text-base">/mo</span>}
              </div>
              <p className="text-base text-[#888888] mb-10">{plan.desc}</p>
              
              <Link
                href={plan.name === "Enterprise" ? "mailto:hello@ai-gateway.dev" : "/signup"}
                className={cn("inline-flex items-center justify-center shrink-0 transition-transform hover:scale-[0.98] w-full rounded-lg h-12 px-6 text-base font-semibold mb-8", plan.featured ? "bg-white text-black shadow-lg shadow-white/5" : "border border-white/20 bg-transparent text-white hover:bg-white/10")}
              >
                {plan.cta}
              </Link>

              <div className="border-t border-white/10 pt-8 space-y-4 flex-1">
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
      </section>

      {/* Bottom CTA Block */}
      <section className="py-24 px-6 max-w-4xl mx-auto w-full">
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.02] blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-white mb-4 relative z-10">
            Start saving API costs today.
          </h2>
          <p className="text-[#a3a3a3] mb-8 max-w-xl mx-auto leading-relaxed relative z-10">
            Enterprise-grade LLM routing, minus the enterprise subscription. Deploy locally or via Docker in under 5 minutes.
          </p>
          <Link href="/signup" className="inline-flex items-center justify-center shrink-0 whitespace-nowrap transition-transform hover:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-md bg-white text-black font-semibold h-12 px-8 shadow-lg shadow-white/5 relative z-10">
            Create Free Account
          </Link>
        </div>
      </section>

    </>
  );
}
