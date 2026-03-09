import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Cache — AI Gateway Dashboard" }
const prisma = new PrismaClient()

export default async function CachePage() {
  const session = await auth()
  const userId = session?.user?.id as string

  const [total, hits, missLogs] = await Promise.all([
    prisma.usageLog.count({ where: { userId } }),
    prisma.usageLog.count({ where: { userId, cacheHit: true } }),
    prisma.usageLog.aggregate({
      where: { userId, cacheHit: false },
      _sum: { cost: true },
      _count: { _all: true },
    }),
  ])

  const misses = total - hits
  const hitRate = total > 0 ? Math.round((hits / total) * 100) : 0
  const avgCostPerRequest = missLogs._count._all > 0
    ? (missLogs._sum.cost ?? 0) / missLogs._count._all
    : 0
  const costSaved = hits * avgCostPerRequest

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "4px" }}>Cache Performance</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>How much the cache is saving you</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "Hit Rate", value: `${hitRate}%`, color: "#10b981" },
          { label: "Total Hits", value: hits.toLocaleString(), color: "#3b82f6" },
          { label: "Total Misses", value: misses.toLocaleString(), color: "#ef4444" },
          { label: "Cost Saved", value: `$${costSaved.toFixed(2)}`, color: "#f59e0b" },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>{s.label}</div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Hit vs Miss visual */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "28px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "20px" }}>Cache Distribution</h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ flex: hitRate, background: "#10b981", height: "16px", borderRadius: "4px", minWidth: "4px" }} />
          <div style={{ flex: 100 - hitRate, background: "#ef4444", height: "16px", borderRadius: "4px", minWidth: "4px" }} />
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#10b981" }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Hits: {hitRate}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#ef4444" }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Misses: {100 - hitRate}%</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "28px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "20px" }}>How the Cache Works</h2>
        {[
          ["Cache Key", "SHA-256 hash of the full request body (model + messages + temperature + max_tokens)"],
          ["Free Plan TTL", "24 hours — cache entries expire after 1 day"],
          ["Pro Plan TTL", "7 days — entries stay in cache for a full week"],
          ["Invalidation", "Streaming requests are never cached. Temperature > 0.9 skips cache. Image requests skip cache."],
          ["Opt-out", "Send X-AI-Gateway-No-Cache: true header to bypass cache for a specific request"],
          ["Cost on HIT", "$0.00 — provider is not called, no tokens billed"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", gap: "16px", paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: "140px", flexShrink: 0, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{label}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
