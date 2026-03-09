import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Analytics — AI Gateway Dashboard" }
const prisma = new PrismaClient()

export default async function AnalyticsPage() {
  const session = await auth()
  const userId = session?.user?.id as string

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const logs = await prisma.usageLog.findMany({
    where: { userId, timestamp: { gte: sevenDaysAgo } },
    select: { provider: true, model: true, tokens: true, cost: true, cacheHit: true, timestamp: true },
    orderBy: { timestamp: "asc" },
  })

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

  const providerColors: Record<string, string> = {
    openai: "#10b981",
    gemini: "#3b82f6",
    anthropic: "#f59e0b",
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "4px" }}>Analytics</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Last 7 days of usage</p>
      </div>

      {/* Provider breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        {Object.entries(providerTotals).map(([provider, data]) => (
          <div
            key={provider}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${providerColors[provider] ?? "#a855f7"}33`,
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: providerColors[provider] ?? "#a855f7", marginBottom: "16px" }}>{provider}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Requests</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>{data.requests.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Cost</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>${data.cost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
        {Object.keys(providerTotals).length === 0 && (
          <div style={{ gridColumn: "1/-1", padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px" }}>
            No data in the last 7 days yet.
          </div>
        )}
      </div>

      {/* Daily usage table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflow: "hidden", marginBottom: "32px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>Daily Requests — Last 7 Days</h2>
        </div>
        <div style={{ padding: "24px" }}>
          {Object.entries(dailyMap).length > 0 ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "120px" }}>
              {Object.entries(dailyMap).map(([day, count]) => {
                const maxCount = Math.max(...Object.values(dailyMap))
                const h = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
                return (
                  <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{count}</div>
                    <div style={{ width: "100%", height: `${h}%`, minHeight: "4px", background: "linear-gradient(180deg, #a855f7, #3b82f6)", borderRadius: "4px 4px 0 0" }} />
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{day.slice(5)}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "32px" }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Full log table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>Usage Log</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Timestamp", "Provider", "Model", "Tokens", "Cost", "Cache"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.slice().reverse().slice(0, 50).map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", fontSize: "12px" }}>{r.timestamp.toLocaleString()}</td>
                  <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.85)", textTransform: "capitalize" }}>{r.provider}</td>
                  <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.6)" }}>{r.model}</td>
                  <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.7)" }}>{r.tokens.toLocaleString()}</td>
                  <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.7)" }}>${r.cost.toFixed(4)}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ background: r.cacheHit ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)", color: r.cacheHit ? "#10b981" : "#ef4444", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 700 }}>
                      {r.cacheHit ? "HIT" : "MISS"}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No usage logs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
