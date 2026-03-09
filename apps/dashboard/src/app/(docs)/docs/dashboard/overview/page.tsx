import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard Overview — AI Gateway Docs" }

export default function DashboardOverviewPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Dashboard Overview</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Managing your gateway, auditing API usage, and configuring keys natively.
        </p>
      </div>

      <h2>The Management Console</h2>
      <p>
        The AI Gateway Dashboard is a completely autonomous application constructed using Next.js interacting directly with the configured Postgres Database natively. It performs metric analysis, configures key allocations, and monitors real-time request architectures without incurring downstream telemetry pipelines directly.
      </p>

      <div className="not-prose border border-white/10 rounded-xl overflow-hidden mb-8 my-6 bg-black p-10 flex items-center justify-center">
        <div className="text-[#333333] italic text-xs uppercase tracking-widest font-mono">
          [ Dashboard Snapshot Rendering Context ]
        </div>
      </div>

      <h2>Available Modules</h2>
      <ul>
        <li><strong>Metrics & Activity</strong> — Time-series visualizations mapping precise token payloads incurred over intervals.</li>
        <li><strong>Requests Log</strong> — A searchable repository displaying precise raw requests containing payload details and specific upstream latencies. Cache operations are explicitly mapped as Instant-Hits here.</li>
        <li><strong>API Cache Explorer</strong> — Manages the active TTL stores maintained inside the Upstash Redis database cluster directly.</li>
        <li><strong>API Key Engine</strong> — A module managing deterministic Gateway Keys mapping usage per client or microservice.</li>
      </ul>
    </>
  )
}
