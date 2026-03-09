import { auth } from "@/auth"
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
const prisma = new PrismaClient()

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; id?: string }>
}) {
  const session = await auth()
  const userId = session?.user?.id as string
  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams.page ?? "1")
  const PAGE_SIZE = 20
  const skip = (page - 1) * PAGE_SIZE

  const [requests, total] = await Promise.all([
    prisma.usageLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.usageLog.count({ where: { userId } }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Detail view
  const detailId = resolvedParams.id
  const detail = detailId
    ? await prisma.usageLog.findUnique({ where: { id: detailId } })
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">Inspect and replay individual requests across your providers.</p>
      </div>

      {detail && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border pb-6 mb-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Request ID</p>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground border border-border/50">
                    {detail.requestId}
                  </code>
                </div>
              </div>
              <div className="flex flex-wrap gap-8 md:gap-12">
                {[
                  { label: "Provider", value: detail.provider },
                  { label: "Model", value: detail.model },
                  { label: "Latency", value: `${detail.latencyMs}ms` },
                  { label: "Cost", value: `$${detail.cost.toFixed(4)}` },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{m.label}</p>
                    <p className="text-base font-semibold text-foreground capitalize">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {detail.promptJson ? (
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Prompt Payload</h3>
                  </div>
                  <pre className="mt-2 w-full rounded-md bg-black border border-border/50 p-4 text-sm font-mono text-muted-foreground overflow-auto max-h-[300px] shadow-inner">
                    {JSON.stringify(JSON.parse(detail.promptJson), null, 2)}
                  </pre>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Response JSON</h3>
                  </div>
                  <pre className="mt-2 w-full rounded-md bg-black border border-border/50 p-4 text-sm font-mono text-muted-foreground overflow-auto max-h-[300px] shadow-inner">
                    {detail.responseJson ? JSON.stringify(JSON.parse(detail.responseJson), null, 2) : "// Content not stored for this request"}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-muted/20 border border-border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Prompt content not stored. Enable "Store request content" in Settings to log payloads.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[180px]">REQUEST ID</TableHead>
                <TableHead>PROVIDER</TableHead>
                <TableHead>MODEL</TableHead>
                <TableHead>LATENCY</TableHead>
                <TableHead>TOKENS</TableHead>
                <TableHead>COST</TableHead>
                <TableHead>CACHE</TableHead>
                <TableHead>TIME</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No requests recorded yet. Data will appear here once you start using the proxy.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((r) => (
                  <TableRow key={r.id} className="group transition-colors data-[state=selected]:bg-muted">
                    <TableCell>
                      <code className="text-xs font-mono text-muted-foreground hidden sm:inline-block">
                        {r.requestId.split('-')[0]}...
                      </code>
                      <code className="text-xs font-mono text-muted-foreground sm:hidden inline-block truncate w-24">
                        {r.requestId}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium capitalize">{r.provider}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.model}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.latencyMs}ms</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.tokens.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">${r.cost.toFixed(4)}</TableCell>
                    <TableCell>
                      <Badge variant={r.cacheHit ? "default" : "secondary"} className={r.cacheHit ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" : "text-muted-foreground"}>
                        {r.cacheHit ? "HIT" : "MISS"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/requests?page=${page}&id=${r.id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground h-8 px-3 border border-border/50 bg-background/50 outline-none focus-visible:ring-1">
                        View
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing {skip + 1} to {Math.min(skip + PAGE_SIZE, total)} of <span className="font-medium text-foreground">{total.toLocaleString()}</span> entries
            </span>
            <div className="flex gap-2">
              <Link 
                href={page > 1 ? `/dashboard/requests?page=${page - 1}` : "#"}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border h-8 px-3 ${page <= 1 ? "pointer-events-none opacity-50 bg-muted/50" : "bg-transparent hover:bg-muted"}`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Link>
              <Link 
                href={page < totalPages ? `/dashboard/requests?page=${page + 1}` : "#"}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border h-8 px-3 ${page >= totalPages ? "pointer-events-none opacity-50 bg-muted/50" : "bg-transparent hover:bg-muted"}`}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
