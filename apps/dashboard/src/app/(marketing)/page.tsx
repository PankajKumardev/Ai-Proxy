// apps/dashboard/src/app/(marketing)/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Server, Split, Code, Activity, ShieldCheck, Star } from "lucide-react";
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
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
        {/* Glow blob */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent blur-[80px] -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <span className="mr-2">✨</span> Open-source & self-hostable
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8 text-white">
          Stop paying for <span className="text-gradient">duplicate AI calls</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          One proxy. Three providers. Response caching, automatic fallbacks, and real-time cost tracking — with zero changes to your existing code.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup" className="inline-flex items-center justify-center shrink-0 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-base h-14 px-8 py-2 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.4)] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-none font-bold text-white">
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/docs/introduction" className="inline-flex items-center justify-center shrink-0 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-base h-14 px-8 py-2 rounded-full font-semibold border border-white/10 hover:bg-white/5 text-white bg-transparent">
            View Docs
          </Link>
        </div>

        {/* Code snippet */}
        <div className="mt-20 max-w-3xl mx-auto text-left relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 to-cyan-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-background/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* macOS titlebar */}
            <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto text-xs text-muted-foreground font-mono">api.ts</div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-[13px] leading-loose text-primary-foreground/90 font-mono">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/5 backdrop-blur-md py-10 mt-10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-16 px-6">
          {[
            { value: "3", label: "AI Providers" },
            { value: "< 5 min", label: "Setup Time" },
            { value: "40%", label: "Avg Cost Saved" },
            { value: "MIT", label: "License" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{s.value}</div>
              <div className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Drop-in replacement for any OpenAI-compatible SDK.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { n: 1, icon: Code, title: "Point your app at the gateway", desc: "Change one line — set baseURL to your gateway. Same OpenAI SDK, same API format." },
            { n: 2, icon: Server, title: "Gateway handles everything", desc: "Caching, rate limiting, automatic fallbacks, cost tracking. Zero code changes needed." },
            { n: 3, icon: Activity, title: "Monitor in real time", desc: "Track tokens, costs, cache hit rates, and provider usage in your dashboard." },
          ].map((step) => (
            <Card key={step.n} className="bg-white/5 border-none backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 pointer-events-none group-hover:text-primary/10 transition-colors">{step.n}</div>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center text-primary mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <step.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-white">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Everything you need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Enterprise-grade capabilities out of the box.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Database, title: "Response Caching", desc: "SHA-256 exact match caching with per-plan TTL. Cache hits return instantly and cost $0.00." },
            { icon: Split, title: "Fallback Routing", desc: "Auto-retry across 3 providers with health tracking. If OpenAI is down, Gemini picks up instantly." },
            { icon: Activity, title: "Usage Analytics", desc: "Real-time token counts, cost breakdown, cache hit rate, and per-model statistics." },
            { icon: Code, title: "OpenAI Compatible", desc: "Drop-in replacement. Change baseURL, keep your existing SDK, models, and prompts." },
            { icon: Server, title: "Smart Routing", desc: "Choose cheap, balanced, or quality routing per request. Different strategy for each use case." },
            { icon: ShieldCheck, title: "Secure by Default", desc: "API keys stored as SHA-256 hashes. Rate limiting, CORS, body size limits — all built in." },
          ].map((f) => (
            <Card key={f.title} className="bg-transparent border-white/10 hover:bg-white/5 transition-colors group">
              <CardHeader>
                <f.icon className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <CardTitle className="text-lg text-white">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center border-t border-white/5">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Simple pricing</h2>
        <p className="text-lg text-muted-foreground mb-16">Start free. Scale when you&apos;re ready.</p>
        
        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {[
            { name: "Free", price: "$0", desc: "10K requests/mo", cta: "Start for Free", featured: false },
            { name: "Pro", price: "$29", desc: "500K requests/mo", cta: "Start Pro Trial", featured: true },
            { name: "Enterprise", price: "Custom", desc: "Unlimited volume", cta: "Contact Sales", featured: false },
          ].map((plan) => (
            <div
              key={plan.name}
              className={"relative flex flex-col p-8 rounded-3xl border transition-all duration-300 " + (plan.featured ? "bg-gradient-to-b from-primary/10 to-transparent border-primary/50 shadow-[0_0_40px_rgba(168,85,247,0.15)] md:-mt-8 md:mb-8" : "bg-white/5 border-white/10")}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary shadow-[0_0_15px_rgba(168,85,247,0.4)] px-3 py-1 text-xs uppercase tracking-wider font-bold text-white border-none cursor-default items-center">
                    <Star className="w-3 h-3 mr-1 inline" fill="currentColor" /> Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="text-xl font-bold text-white mb-2">{plan.name}</div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted-foreground font-medium">/mo</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-8 flex-1">{plan.desc}</p>
              
              <Link
                href={plan.name === "Enterprise" ? "mailto:hello@ai-gateway.dev" : "/signup"}
                className={cn("inline-flex items-center justify-center shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full rounded-xl h-12 px-4 py-2 font-semibold text-white", plan.featured ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-none shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "border border-white/10 hover:bg-white/10 bg-transparent")}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12">
          <Link href="/pricing" className="text-primary hover:text-primary/80 font-semibold inline-flex items-center transition-colors">
            See full pricing details <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-primary/30 p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
            Ready to integrate?
          </h2>
          <p className="text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto relative z-10">
            Free forever. Self-hosted. Your data stays yours. Join thousands of developers scaling AI applications.
          </p>
          <Link href="/signup" className="inline-flex items-center justify-center shrink-0 whitespace-nowrap transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.4)] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-10 h-16 relative z-10 hover:scale-105">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 mt-auto bg-black/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-white tracking-widest uppercase">
            <span className="text-primary text-xl">⚡</span> AI Gateway
          </div>
          <div className="flex gap-8 font-medium text-sm">
            <Link href="/docs/introduction" className="text-muted-foreground hover:text-white transition-colors">Docs</Link>
            <a href="https://github.com/you/ai-gateway" className="text-muted-foreground hover:text-white transition-colors">GitHub</a>
            <Link href="/pricing" className="text-muted-foreground hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="text-sm text-muted-foreground/60">
            © 2026 AI Gateway — MIT Licensed
          </div>
        </div>
      </footer>
    </div>
  );
}
