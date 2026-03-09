import React from "react"
import type { Metadata } from "next"
import { AlertTriangle } from "lucide-react"

export const metadata: Metadata = { title: "Rate Limiting — AI Gateway Docs" }

export default function RateLimitingPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Rate Limiting</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Preventing abuse and tracking token throughput leveraging Upstash Redis at the Edge.
        </p>
      </div>

      <h2>Token Algorithms</h2>
      <p>
        AI Gateway relies on sliding-window mechanisms driven via your Redis Datastore to continuously calculate the number of requests and raw token expenditure authorized within a given unit metric window. 
      </p>

      <div className="not-prose my-8 bg-[#111111] border border-white/10 rounded-xl p-6 relative overflow-hidden flex gap-4 shadow-lg">
        <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-red-500 rounded-l-xl"></div>
        <div className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">HTTP 429 Status Codes</h4>
          <p className="text-sm text-[#888888] leading-relaxed m-0">
            When raw payload throughput limits are breached (usually constrained by Tier usage plans set during signup), the proxy terminates upstream resolution preemptively, guaranteeing downstream token budgets are mathematically enforced securely. An `HTTP 429` error will be returned to the client instead of communicating with OpenAI.
          </p>
        </div>
      </div>

      <h2>Identifying Limits</h2>
      <p>
        Rate limiting limits and limits constraints are managed inside your Dashboard environment. You are free to establish global maximum RPM (Requests Per Minute) boundaries on isolated Gateway API Keys to ensure independent microservices cannot consume pooled API allocations natively.
      </p>
    </>
  )
}
