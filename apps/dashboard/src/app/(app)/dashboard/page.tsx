import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Database, DollarSign, Target } from "lucide-react"

export const metadata: Metadata = { title: "Overview — AI Gateway Dashboard" }

const prisma = new PrismaClient()

function formatCost(cost: number) {
  return `$${cost.toFixed(4)}`
}
function formatNumber(n: number) {
  return n.toLocaleString()
}

export default async function DashboardOverviewPage() {
  const session = await auth()
  const userId = session?.user?.id as string

  // Aggregate stats
  const stats = await prisma.usageLog.aggregate({
    where: { userId },
    _sum: { tokens: true, cost: true },
    _count: { _all: true },
  })

  const cacheHits = await prisma.usageLog.count({
    where: { userId, cacheHit: true },
  })

  const totalRequests = stats._count._all
  const totalTokens = stats._sum.tokens ?? 0
  const totalCost = stats._sum.cost ?? 0
  const cacheHitRate = totalRequests > 0 ? Math.round((cacheHits / totalRequests) * 100) : 0

  // Recent requests
  const recent = await prisma.usageLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: 10,
    select: {
      id: true,
      requestId: true,
      provider: true,
      model: true,
      tokens: true,
      cost: true,
      cacheHit: true,
      latencyMs: true,
      timestamp: true,
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor your gateway usage, performance, and costs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-none rounded-xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{formatNumber(totalRequests)}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-none rounded-xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Tokens</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-primary">
              {totalTokens > 1_000_000 ? `${(totalTokens / 1_000_000).toFixed(1)}M` : formatNumber(totalTokens)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none rounded-xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Est. Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-emerald-500">{formatCost(totalCost)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-none rounded-xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Cache Hits</CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-amber-500">{cacheHitRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-none overflow-hidden text-sm">
        <div className="p-5 border-b border-border font-semibold text-foreground">Recent Activity</div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">ID</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Provider</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">Model</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground text-right">Tokens</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground text-right">Cost</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground text-center">Cache</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-muted-foreground text-right">Latency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((r) => (
              <TableRow key={r.id} className="border-border/50 hover:bg-white/5 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground max-w-[100px] truncate" title={r.requestId}>
                  {r.requestId.split('-')[0]}
                </TableCell>
                <TableCell className="capitalize text-foreground">{r.provider}</TableCell>
                <TableCell className="font-mono text-muted-foreground text-xs">{r.model}</TableCell>
                <TableCell className="text-right font-mono text-foreground">{r.tokens.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-foreground">${r.cost.toFixed(4)}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${r.cacheHit ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                    {r.cacheHit ? "Hit" : "Miss"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{r.latencyMs}ms</TableCell>
              </TableRow>
            ))}
            {recent.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No requests yet. Make your first API call.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
