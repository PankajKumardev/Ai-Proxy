import React from "react"
import type { Metadata } from "next"
import { Database, Route, BarChart3, Plug2, Zap } from "lucide-react"

export const metadata: Metadata = { title: "Introduction — AI Gateway Docs" }

export default function IntroductionPage() {
  return (
    <>
      <h1>Introduction</h1>
      <p className="lead text-lg text-muted-foreground">
        AI Gateway is an open-source proxy server that sits between your application and AI providers (OpenAI, Gemini, Anthropic).
      </p>

      <h2>Why build it?</h2>
      <p>When your app calls AI providers directly, three painful things happen:</p>
      <ul>
        <li><strong>You pay for duplicate requests.</strong> Same question asked 1,000 times = 1,000 API calls.</li>
        <li><strong>One provider goes down, your app goes down.</strong> No fallback, no resilience.</li>
        <li><strong>Zero visibility.</strong> No idea which model costs what or how much you're burning monthly.</li>
      </ul>

      <h2>Architecture</h2>
      <pre className="not-prose bg-black border border-border/50 rounded-lg p-6 font-mono text-sm text-muted-foreground shadow-sm">
        Your App <span className="text-primary px-2">→</span> AI Gateway <span className="text-primary px-2">→</span> OpenAI / Gemini / Anthropic
      </pre>

      <h2>Features</h2>
      <ul className="list-none pl-0">
        <li className="flex items-start gap-4 mb-3">
          <div className="mt-1 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-white/5 border border-white/10">
            <Database className="w-4 h-4 text-white" />
          </div>
          <div className="leading-snug">
            <strong className="text-white block mb-0.5">Response Caching</strong>
            <span className="text-[#888888]">SHA-256 exact match, configurable TTL per plan</span>
          </div>
        </li>
        <li className="flex items-start gap-4 mb-3">
          <div className="mt-1 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-white/5 border border-white/10">
            <Route className="w-4 h-4 text-white" />
          </div>
          <div className="leading-snug">
            <strong className="text-white block mb-0.5">Fallback Routing</strong>
            <span className="text-[#888888]">Auto-retry across 3 providers with health tracking</span>
          </div>
        </li>
        <li className="flex items-start gap-4 mb-3">
          <div className="mt-1 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-white/5 border border-white/10">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div className="leading-snug">
            <strong className="text-white block mb-0.5">Usage Analytics</strong>
            <span className="text-[#888888]">Tokens, cost, cache hit rate, per-request logging</span>
          </div>
        </li>
        <li className="flex items-start gap-4 mb-3">
          <div className="mt-1 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-white/5 border border-white/10">
            <Plug2 className="w-4 h-4 text-white" />
          </div>
          <div className="leading-snug">
            <strong className="text-white block mb-0.5">OpenAI Compatible</strong>
            <span className="text-[#888888]">No SDK changes needed in your app</span>
          </div>
        </li>
        <li className="flex items-start gap-4 mb-3">
          <div className="mt-1 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-white/5 border border-white/10">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="leading-snug">
            <strong className="text-white block mb-0.5">Smart Routing</strong>
            <span className="text-[#888888]">cheap / balanced / quality modes per request</span>
          </div>
        </li>
      </ul>

      <h2>Supported Models (March 2026)</h2>
      <div className="not-prose overflow-x-auto rounded-xl border border-border/50 bg-black">
        <table className="w-full text-sm text-left font-mono">
          <thead className="bg-[#1f2937]/30 text-xs uppercase text-muted-foreground border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-primary">Model ID</th>
              <th className="px-6 py-4 font-semibold text-primary">Provider</th>
              <th className="px-6 py-4 font-semibold text-emerald-500">In $/1M</th>
              <th className="px-6 py-4 font-semibold text-amber-500">Out $/1M</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {[
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
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-3 font-medium text-foreground">{model}</td>
                <td className="px-6 py-3 text-muted-foreground">{provider}</td>
                <td className="px-6 py-3 text-emerald-400 font-medium">{inp}</td>
                <td className="px-6 py-3 text-amber-400 font-medium">{out}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Tech Stack</h2>
      <div className="not-prose grid md:grid-cols-2 gap-4">
        {[
          ["Hono 4.12 + Node.js", "Edge-ready proxy, 3.5× faster than Express"],
          ["Neon DB (Postgres)", "Serverless Postgres — always use pooled connection"],
          ["Upstash Redis", "HTTP-based Redis for caching + rate limiting"],
          ["Next.js 16 App Router", "Landing page, docs, and dashboard in one app"],
          ["NextAuth v4", "JWT sessions, Prisma adapter, email/password auth"],
        ].map(([tool, why], i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-black/50 p-5 shadow-sm hover:shadow transition-shadow">
            <h4 className="text-sm font-semibold text-foreground mb-2">{tool}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed m-0">{why}</p>
          </div>
        ))}
      </div>
    </>
  )
}
