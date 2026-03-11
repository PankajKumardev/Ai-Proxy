import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import type { Metadata } from "next"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Activity, Code2, Copy } from "lucide-react"

export const metadata: Metadata = { title: "Requests — AI Gateway Dashboard" }

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; id?: string }>
}) {
  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams.page ?? "1")
  const PAGE_SIZE = 20
  const skip = (page - 1) * PAGE_SIZE

  // Bypassed auth and DB for UI testing
  const total = 145
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Dummy requests for UI preview
  const requests = Array.from({ length: 15 }).map((_, i) => ({
    id: `req_${i}`,
    requestId: `req_${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 6)}`,
    provider: i % 3 === 0 ? "anthropic" : i % 2 === 0 ? "gemini" : "openai",
    model: i % 3 === 0 ? "claude-3-opus" : i % 2 === 0 ? "gemini-1.5-pro" : "gpt-4o",
    latencyMs: Math.floor(Math.random() * 2000) + 200,
    tokens: Math.floor(Math.random() * 5000) + 100,
    cost: Math.random() * 0.05,
    cacheHit: Math.random() > 0.7,
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24),
    promptJson: JSON.stringify({ messages: [{ role: "user", content: "Hello world" }] }),
    responseJson: JSON.stringify({ choices: [{ message: { content: "Hi there!" } }] }),
  }))

  const detailId = resolvedParams.id
  const detail = detailId ? requests.find(r => r.id === detailId) || requests[0] : null

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-white">Requests</h1>
          <p className="text-[#a3a3a3] mt-1 text-lg leading-relaxed">Inspect and replay individual requests across your providers.</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">

        {/* Requests Table (Left Pane mostly) */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl shadow-sm relative flex flex-col flex-1 min-w-0 xl:sticky xl:top-20">

          <div className="overflow-x-auto p-2">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-[180px] text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Request ID</TableHead>
                  <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Provider</TableHead>
                  <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Model</TableHead>
                  <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Latency</TableHead>
                  <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Tokens</TableHead>
                  <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right">Cost</TableHead>
                  <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Cache</TableHead>
                  <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Time</TableHead>
                  <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-12 text-center text-neutral-500 font-medium text-[13px]">
                      No requests recorded yet. Data will appear here once you start using the proxy.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((r) => (
                    <TableRow key={r.id} className="border-white/5 hover:bg-white/5 transition-colors border-b group data-[state=selected]:bg-white/[0.04]">
                      <TableCell>
                        <code className="rounded-md bg-[#000000] px-2 py-1 text-[12px] font-mono tracking-tight text-neutral-400 hidden sm:inline-block border border-white/10">
                          {r.requestId.split('-')[0]}...
                        </code>
                        <code className="text-[12px] font-mono tracking-tight text-neutral-400 sm:hidden inline-block truncate w-24">
                          {r.requestId}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium tracking-tight text-white text-[13px] capitalize">{r.provider}</TableCell>
                      <TableCell className="text-neutral-400 text-[12px] tracking-tight font-mono">{r.model}</TableCell>
                      <TableCell className="text-neutral-400 text-[12px] tracking-tight font-mono">{r.latencyMs}ms</TableCell>
                      <TableCell className="text-white text-[12px] tracking-tight font-mono text-right">{r.tokens.toLocaleString()}</TableCell>
                      <TableCell className="text-white text-[12px] tracking-tight font-mono text-right">${r.cost.toFixed(4)}</TableCell>
                      <TableCell>
                        {r.cacheHit ? (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-medium tracking-widest text-[9px] uppercase px-2 py-0.5 rounded-sm">Hit</Badge>
                        ) : (
                          <Badge variant="outline" className="border-[#52525B]/50 text-[#a1a1aa] bg-transparent font-medium tracking-widest text-[9px] uppercase px-2 py-0.5 rounded-sm">Miss</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-500 text-[12px] tracking-tight font-mono whitespace-nowrap">
                        {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Link href={`/dashboard/requests?page=${page}&id=${r.id}`} className="inline-flex items-center justify-center rounded-md text-[12px] font-medium transition-colors text-neutral-400 hover:text-white h-7 px-3 border border-white/10 bg-transparent hover:bg-white/10 outline-none">
                          Inspect
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#0A0A0A]">
              <span className="text-[13px] text-neutral-500 tracking-tight">
                Showing {skip + 1} to {Math.min(skip + PAGE_SIZE, total)} of <span className="font-medium text-white">{total.toLocaleString()}</span> entries
              </span>
              <div className="flex gap-2">
                <Link
                  href={page > 1 ? `/dashboard/requests?page=${page - 1}` : "#"}
                  className={`inline-flex items-center justify-center rounded-md text-[12px] font-medium transition-colors border border-white/10 h-8 px-3 ${page <= 1 ? "pointer-events-none opacity-50 bg-white/5 text-neutral-500" : "bg-transparent hover:bg-white/10 text-neutral-400 hover:text-white"}`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Link>
                <Link
                  href={page < totalPages ? `/dashboard/requests?page=${page + 1}` : "#"}
                  className={`inline-flex items-center justify-center rounded-md text-[12px] font-medium transition-colors border border-white/10 h-8 px-3 ${page >= totalPages ? "pointer-events-none opacity-50 bg-white/5 text-neutral-500" : "bg-transparent hover:bg-white/10 text-neutral-400 hover:text-white"}`}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Request Detail Pane */}
        {detail && (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl shadow-sm relative animate-in slide-in-from-right-8 duration-500 shrink-0 w-full xl:w-[600px] flex flex-col">
            <div className="p-6">
              <div className="flex flex-col gap-6 border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-2">Request ID</p>
                    <code className="bg-[#0A0A0A] px-3 py-1.5 rounded-md text-[13px] tracking-tight text-white border border-white/10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {detail.requestId}
                    </code>
                  </div>
                  <Link href={`/dashboard/requests?page=${page}`} className="text-[12px] font-medium text-neutral-400 hover:text-white transition-colors bg-transparent hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/10">
                    Close Details
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { label: "Provider", value: detail.provider },
                    { label: "Model", value: detail.model },
                    { label: "Latency", value: `${detail.latencyMs}ms`, color: "text-neutral-400" },
                    { label: "Cost", value: `$${detail.cost.toFixed(4)}`, color: "text-white" },
                  ].map((m) => (
                    <div key={m.label}>
                      <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mb-1">{m.label}</p>
                      <p className={`text-[13px] font-medium tracking-tight capitalize font-mono ${m.color || 'text-white'}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {detail.promptJson ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-neutral-500" />
                        <h3 className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">Prompt Payload</h3>
                      </div>
                    </div>
                    <div className="relative group">
                      <pre className="mt-2 w-full rounded-lg bg-[#0A0A0A] border border-white/10 p-4 text-[12px] tracking-tight text-neutral-300 overflow-auto max-h-[400px] leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {JSON.stringify(JSON.parse(detail.promptJson), null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-neutral-500" />
                        <h3 className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">Response JSON</h3>
                      </div>
                    </div>
                    <div className="relative group">
                      <pre className="mt-2 w-full rounded-lg bg-[#0A0A0A] border border-white/10 p-4 text-[12px] tracking-tight text-neutral-300 overflow-auto max-h-[400px] leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {detail.responseJson ? JSON.stringify(JSON.parse(detail.responseJson), null, 2) : "// Content not stored for this request"}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center bg-[#0A0A0A] border border-white/10 rounded-xl">
                  <p className="text-[13px] text-neutral-500 max-w-[250px] mx-auto leading-relaxed">
                    Prompt content not stored. Enable explicitly in <strong className="text-white font-medium">Settings</strong> to log payloads.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
