import type { Metadata } from "next"
import { Activity, Database, DollarSign, Target, Zap, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
export const metadata: Metadata = { title: "Overview — AI Gateway Dashboard" }

// ── DUMMY DATA FOR UI PREVIEW ──────────────────────────────────────────────
const totalRequests = 12_847
const totalTokens = 4_820_300
const totalCost = 38.42
const cacheHitRate = 34

const recent = [
  { id: "1", requestId: "req-a1b2c3d4-e5f6", provider: "openai", model: "gpt-4o", tokens: 1204, cost: 0.0241, cacheHit: false, latencyMs: 312, timestamp: new Date("2025-03-09T17:50:00Z") },
  { id: "2", requestId: "req-b2c3d4e5-f6a7", provider: "anthropic", model: "claude-3-5-sonnet", tokens: 987, cost: 0.0148, cacheHit: true, latencyMs: 198, timestamp: new Date("2025-03-09T17:48:22Z") },
  { id: "3", requestId: "req-c3d4e5f6-a7b8", provider: "gemini", model: "gemini-2.0-flash", tokens: 530, cost: 0.0026, cacheHit: false, latencyMs: 421, timestamp: new Date("2025-03-09T17:45:10Z") },
  { id: "4", requestId: "req-d4e5f6a7-b8c9", provider: "openai", model: "gpt-4o-mini", tokens: 320, cost: 0.0005, cacheHit: true, latencyMs: 89, timestamp: new Date("2025-03-09T17:43:55Z") },
  { id: "5", requestId: "req-e5f6a7b8-c9d0", provider: "openai", model: "gpt-4o", tokens: 1540, cost: 0.0308, cacheHit: false, latencyMs: 504, timestamp: new Date("2025-03-09T17:40:30Z") },
  { id: "6", requestId: "req-f6a7b8c9-d0e1", provider: "anthropic", model: "claude-3-haiku", tokens: 210, cost: 0.0006, cacheHit: true, latencyMs: 72, timestamp: new Date("2025-03-09T17:38:14Z") },
  { id: "7", requestId: "req-g7h8i9j0-k1l2", provider: "gemini", model: "gemini-1.5-pro", tokens: 880, cost: 0.0044, cacheHit: false, latencyMs: 367, timestamp: new Date("2025-03-09T17:35:02Z") },
]
// ──────────────────────────────────────────────────────────────────────────

function formatCost(cost: number) { return `$${cost.toFixed(4)}` }
function formatNumber(n: number) { return n.toLocaleString() }

export default async function DashboardOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-white">Overview</h1>
          <p className="text-[#a3a3a3] mt-1 text-lg leading-relaxed">Monitor your gateway usage, performance, and costs in real-time.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards - Premium Bento Style */}
        {[
          { title: "Total Requests", value: formatNumber(totalRequests), icon: Activity },
          { title: "Tokens Processed", value: totalTokens > 1_000_000 ? `${(totalTokens / 1_000_000).toFixed(1)}M` : formatNumber(totalTokens), icon: Database },
          { title: "Estimated Cost", value: formatCost(totalCost), icon: DollarSign },
          { title: "Cache Hit Rate", value: `${cacheHitRate}%`, icon: Target },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 relative flex flex-col shadow-sm transition-all duration-200 hover:bg-white/[0.02] hover:border-white/20 cursor-default">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">{stat.title}</span>
              <stat.icon className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-3xl font-semibold tracking-tight text-white mt-1">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity - Custom Mac-style Table */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-sm relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium tracking-wide text-white uppercase">Recent Payload Activity</h2>
          </div>
        </div>

        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Cache</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 w-[140px]">Request ID</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 w-[120px]">Provider</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 max-w-[140px]">Model</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Tokens</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Cost</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((r) => (
                <TableRow key={r.id} className="border-white/5 hover:bg-white/[0.02] transition-colors border-b">
                  <TableCell className="py-3">
                    {r.cacheHit ? (
                      <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/10 font-medium tracking-wider text-[10px] uppercase px-2 py-0 rounded-sm">Hit</Badge>
                    ) : (
                      <Badge variant="outline" className="border-[#52525B]/50 text-[#a1a1aa] bg-transparent font-medium tracking-wider text-[10px] uppercase px-2 py-0 rounded-sm">Miss</Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 font-mono text-[12px] text-neutral-400 tracking-tight truncate max-w-[140px]" title={r.requestId}>
                    {r.requestId}
                  </TableCell>
                  <TableCell className="py-3 capitalize text-[#d4d4d4] font-medium tracking-tight text-[13px]">{r.provider}</TableCell>
                  <TableCell className="py-3 font-mono text-[12px] text-neutral-400 tracking-tight max-w-[140px] truncate">{r.model}</TableCell>
                  <TableCell className="py-3 font-mono text-[13px] text-white text-right tracking-tight">{r.tokens.toLocaleString()}</TableCell>
                  <TableCell className="py-3 font-mono text-[13px] text-white text-right tracking-tight">${r.cost.toFixed(4)}</TableCell>
                  <TableCell className="py-3 font-mono text-[13px] text-neutral-400 text-right tracking-tight">{r.latencyMs}ms</TableCell>
                </TableRow>
              ))}
              {recent.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-[#555] font-medium">
                    No payload activity yet. Awaiting upstream connections.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
