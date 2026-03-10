import { PrismaClient } from "@prisma/client"
import type { Metadata } from "next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DailyRequestsChart } from "@/components/daily-requests-chart"

export const metadata: Metadata = { title: "Analytics — AI Gateway Dashboard" }

export default async function AnalyticsPage() {
  // Bypassed auth and DB for UI testing
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // Dummy logs for UI preview
  const logs = [
    { provider: "openai", model: "gpt-4o", tokens: 1250, cost: 0.0125, cacheHit: false, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { provider: "anthropic", model: "claude-3-opus", tokens: 840, cost: 0.0126, cacheHit: true, timestamp: new Date(Date.now() - 1000 * 60 * 25) },
    { provider: "gemini", model: "gemini-1.5-pro", tokens: 4200, cost: 0.005, cacheHit: false, timestamp: new Date(Date.now() - 1000 * 60 * 120) },
    { provider: "openai", model: "gpt-3.5-turbo", tokens: 85, cost: 0.0001, cacheHit: true, timestamp: new Date(Date.now() - 1000 * 60 * 300) },
    { provider: "anthropic", model: "claude-3-haiku", tokens: 550, cost: 0.0005, cacheHit: false, timestamp: new Date(Date.now() - 1000 * 60 * 600) },
    { provider: "openai", model: "gpt-4o", tokens: 2100, cost: 0.0210, cacheHit: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { provider: "gemini", model: "gemini-1.5-flash", tokens: 9050, cost: 0.003, cacheHit: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    { provider: "openai", model: "gpt-4-turbo", tokens: 300, cost: 0.003, cacheHit: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
  ]

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-white">Analytics</h1>
          <p className="text-[#a3a3a3] mt-1 text-lg leading-relaxed">Usage metrics overview for the last 7 days.</p>
        </div>
      </div>

      {/* Provider breakdown */}
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

      {/* Daily usage chart placeholder (bars) */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-sm relative transition-all duration-200 hover:bg-white/[0.02] hover:border-white/20 cursor-default">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]/50">
          <h2 className="text-sm font-medium tracking-wide text-white uppercase">Daily Requests</h2>
        </div>
        <div className="p-6">
          <DailyRequestsChart data={dailyMap} />
        </div>
      </div>

      {/* Full log table */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-sm relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
          <h2 className="text-sm font-medium tracking-wide text-white uppercase">Recent Logs (Past 7 Days limit 50)</h2>
        </div>
        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 w-[200px]">Timestamp</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Provider</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Model</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Tokens</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Cost</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 pr-6">Cache</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {logs.slice().reverse().slice(0, 50).map((r, i) => (
                <TableRow key={i} className="border-white/5 hover:bg-white/[0.02] transition-colors border-b">
                  <TableCell className="py-3 text-[12px] font-mono tracking-tight text-neutral-400">
                    {r.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3 text-[13px] font-medium tracking-tight text-white capitalize">{r.provider}</TableCell>
                  <TableCell className="py-3 text-[12px] font-mono tracking-tight text-neutral-400">{r.model}</TableCell>
                  <TableCell className="py-3 text-[13px] font-mono tracking-tight text-white text-right">{r.tokens.toLocaleString()}</TableCell>
                  <TableCell className="py-3 text-[13px] font-mono tracking-tight text-white text-right">${r.cost.toFixed(4)}</TableCell>
                  <TableCell className="py-3 pr-6">
                    {r.cacheHit ? (
                      <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/10 font-medium tracking-wider text-[10px] uppercase px-2 py-0 rounded-sm">Hit</Badge>
                    ) : (
                       <Badge variant="outline" className="border-[#52525B]/50 text-[#a1a1aa] bg-transparent font-medium tracking-wider text-[10px] uppercase px-2 py-0 rounded-sm">Miss</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-[#555] font-medium">No usage logs yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
