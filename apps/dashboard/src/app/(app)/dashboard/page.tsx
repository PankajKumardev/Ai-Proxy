import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Overview — AI Gateway Dashboard" }

const prisma = new PrismaClient()

function formatCost(cost: number) {
  return `$${cost.toFixed(2)}`
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

  const statCards = [
    { label: "Total Requests", value: formatNumber(totalRequests), icon: "◉", color: "#a855f7" },
    { label: "Total Tokens", value: totalTokens > 1_000_000 ? `${(totalTokens / 1_000_000).toFixed(1)}M` : formatNumber(totalTokens), icon: "⚡", color: "#3b82f6" },
    { label: "Estimated Cost", value: formatCost(totalCost), icon: "$", color: "#10b981" },
    { label: "Cache Hit Rate", value: `${cacheHitRate}%`, icon: "🎯", color: "#f59e0b" },
  ]

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "4px" }}>Overview</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>Your gateway usage at a glance</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className="stat-card"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</span>
              <span style={{ fontSize: "18px" }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Recent requests table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>Recent Requests</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Provider", "Model", "Tokens", "Cost", "Cache", "Latency", "Time"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.85)", fontWeight: 600, textTransform: "capitalize" }}>{r.provider}</td>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.6)" }}>{r.model}</td>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.7)" }}>{r.tokens.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.7)" }}>{`$${r.cost.toFixed(4)}`}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: r.cacheHit ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)", color: r.cacheHit ? "#10b981" : "#ef4444", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 700 }}>
                      {r.cacheHit ? "HIT" : "MISS"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.5)" }}>{r.latencyMs}ms</td>
                  <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", fontSize: "12px" }}>
                    {new Date(r.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                    No requests yet. Make your first API call to see data here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
