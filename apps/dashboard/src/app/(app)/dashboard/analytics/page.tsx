import type { Metadata } from "next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DailyRequestsChart } from "@/components/daily-requests-chart"

export const metadata: Metadata = { title: "Analytics — AI Gateway Dashboard" }

// ── DUMMY DATA FOR UI PREVIEW ─────────────────────────────────────────────────
const logs = [
  { provider: "openai",    model: "gpt-4o",               tokens: 1250, cost: 0.0125, cacheHit: false, cacheType: "miss",     latencyMs: 480, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { provider: "anthropic", model: "claude-opus-4-6",       tokens: 840,  cost: 0.0126, cacheHit: true,  cacheType: "semantic", latencyMs: 14,  timestamp: new Date(Date.now() - 1000 * 60 * 25) },
  { provider: "gemini",    model: "gemini-2.5-flash",      tokens: 4200, cost: 0.005,  cacheHit: false, cacheType: "miss",     latencyMs: 390, timestamp: new Date(Date.now() - 1000 * 60 * 120) },
  { provider: "openai",    model: "gpt-5.2",               tokens: 85,   cost: 0.0001, cacheHit: true,  cacheType: "exact",    latencyMs: 3,   timestamp: new Date(Date.now() - 1000 * 60 * 300) },
  { provider: "anthropic", model: "claude-sonnet-4-6",     tokens: 550,  cost: 0.0005, cacheHit: false, cacheType: "miss",     latencyMs: 320, timestamp: new Date(Date.now() - 1000 * 60 * 600) },
  { provider: "openai",    model: "gpt-4o",                tokens: 2100, cost: 0.021,  cacheHit: true,  cacheType: "exact",    latencyMs: 2,   timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { provider: "gemini",    model: "gemini-3.1-pro",        tokens: 9050, cost: 0.003,  cacheHit: true,  cacheType: "semantic", latencyMs: 18,  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { provider: "openai",    model: "gpt-5.4",               tokens: 300,  cost: 0.003,  cacheHit: false, cacheType: "miss",     latencyMs: 512, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
]
// ─────────────────────────────────────────────────────────────────────────────

// Provider breakdown
const providerTotals: Record<string, { requests: number; tokens: number; cost: number }> = {}
for (const log of logs) {
  if (!providerTotals[log.provider]) providerTotals[log.provider] = { requests: 0, tokens: 0, cost: 0 }
  providerTotals[log.provider].requests++
  providerTotals[log.provider].tokens += log.tokens
  providerTotals[log.provider].cost += log.cost
}

// Daily breakdown
const dailyMap: Record<string, number> = {}
for (const log of logs) {
  const day = log.timestamp.toISOString().slice(0, 10)
  dailyMap[day] = (dailyMap[day] ?? 0) + 1
}

// Cache type breakdown
const exactHits    = logs.filter(l => l.cacheType === "exact").length
const semanticHits = logs.filter(l => l.cacheType === "semantic").length
const misses       = logs.filter(l => l.cacheType === "miss").length
const total        = logs.length

function pct(n: number) { return total > 0 ? Math.round((n / total) * 100) : 0 }

// Cache badge
function CacheBadge({ cacheType }: { cacheType: string }) {
  if (cacheType === "exact")
    return <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/10 font-medium tracking-wider text-[10px] uppercase px-2 py-0 rounded-sm">Exact</Badge>
  if (cacheType === "semantic")
    return <Badge variant="outline" className="border-sky-500/20 text-sky-400 bg-sky-500/10 font-medium tracking-wider text-[10px] uppercase px-2 py-0 rounded-sm">Semantic</Badge>
  return <Badge variant="outline" className="border-[#52525B]/50 text-[#a1a1aa] bg-transparent font-medium tracking-wider text-[10px] uppercase px-2 py-0 rounded-sm">Miss</Badge>
}

export default async function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-white">Analytics</h1>
          <p className="text-[#a3a3a3] mt-1 text-lg leading-relaxed">Usage metrics overview for the last 7 days.</p>
        </div>
      </div>

      {/* Cache Type Breakdown ─────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 shadow-sm">
        <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest mb-5">Cache Performance Breakdown</div>
        <div className="grid grid-cols-3 gap-4">
          {/* Exact */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-emerald-400 text-[11px] font-semibold uppercase tracking-widest">Exact Hit</span>
              <span className="text-white text-sm font-mono font-semibold">{pct(exactHits)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${pct(exactHits)}%` }} />
            </div>
            <span className="text-neutral-500 text-[11px]">{exactHits} requests · SHA-256 match · &lt;5ms</span>
          </div>
          {/* Semantic */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sky-400 text-[11px] font-semibold uppercase tracking-widest">Semantic Hit</span>
              <span className="text-white text-sm font-mono font-semibold">{pct(semanticHits)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div className="bg-sky-500 h-1.5 rounded-full transition-all" style={{ width: `${pct(semanticHits)}%` }} />
            </div>
            <span className="text-neutral-500 text-[11px]">{semanticHits} requests · Vector similarity · &lt;20ms</span>
          </div>
          {/* Miss */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-neutral-400 text-[11px] font-semibold uppercase tracking-widest">Cache Miss</span>
              <span className="text-white text-sm font-mono font-semibold">{pct(misses)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div className="bg-neutral-600 h-1.5 rounded-full transition-all" style={{ width: `${pct(misses)}%` }} />
            </div>
            <span className="text-neutral-500 text-[11px]">{misses} requests · LLM provider called</span>
          </div>
        </div>
      </div>

      {/* Provider breakdown ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(providerTotals).map(([provider, data]) => (
          <div
            key={provider}
            className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 relative flex flex-col shadow-sm transition-all duration-200 hover:bg-white/[0.02] hover:border-white/20 cursor-default"
          >
            <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest mb-4">{provider}</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-neutral-500 font-medium uppercase tracking-widest mb-1">Requests</div>
                <div className="text-2xl font-semibold tracking-tight text-white">{data.requests.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] text-neutral-500 font-medium uppercase tracking-widest mb-1">Cost</div>
                <div className="text-2xl font-semibold tracking-tight text-white">${data.cost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
        {Object.keys(providerTotals).length === 0 && (
          <div className="col-span-full py-16 text-center text-[#555] font-medium bg-[#0A0A0A] border border-white/10 rounded-xl">
            No data in the last 7 days yet. Awaiting upstream traffic.
          </div>
        )}
      </div>

      {/* Daily usage chart ────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-sm relative transition-all duration-200 hover:bg-white/[0.02] hover:border-white/20 cursor-default">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]/50">
          <h2 className="text-sm font-medium tracking-wide text-white uppercase">Daily Requests</h2>
        </div>
        <div className="p-6">
          <DailyRequestsChart data={dailyMap} />
        </div>
      </div>

      {/* Full log table ───────────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-sm relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
          <h2 className="text-sm font-medium tracking-wide text-white uppercase">Recent Logs (Past 7 Days · limit 50)</h2>
        </div>
        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 w-[130px]">Cache</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 w-[200px]">Timestamp</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Provider</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Model</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Tokens</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Cost</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice().reverse().slice(0, 50).map((r, i) => (
                <TableRow key={i} className="border-white/5 hover:bg-white/[0.02] transition-colors border-b">
                  <TableCell className="py-3">
                    <CacheBadge cacheType={r.cacheType} />
                  </TableCell>
                  <TableCell className="py-3 text-[12px] font-mono tracking-tight text-neutral-400">
                    {r.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3 text-[13px] font-medium tracking-tight text-white capitalize">{r.provider}</TableCell>
                  <TableCell className="py-3 text-[12px] font-mono tracking-tight text-neutral-400">{r.model}</TableCell>
                  <TableCell className="py-3 text-[13px] font-mono tracking-tight text-white text-right">{r.tokens.toLocaleString()}</TableCell>
                  <TableCell className="py-3 text-[13px] font-mono tracking-tight text-white text-right">${r.cost.toFixed(4)}</TableCell>
                  <TableCell className="py-3 text-[13px] font-mono tracking-tight text-neutral-400 text-right">{r.latencyMs}ms</TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-[#555] font-medium">No usage logs yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
