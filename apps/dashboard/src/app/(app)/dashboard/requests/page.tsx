import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import type { Metadata } from "next"

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
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "4px" }}>Requests</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Inspect and replay individual requests</p>
      </div>

      {/* Detail panel */}
      {detail && (
        <div
          style={{
            background: "rgba(168,85,247,0.05)",
            border: "1px solid rgba(168,85,247,0.2)",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "28px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Request ID</div>
              <code style={{ fontFamily: "monospace", color: "#a855f7", fontSize: "14px" }}>{detail.requestId}</code>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "Provider", value: detail.provider },
                { label: "Model", value: detail.model },
                { label: "Latency", value: `${detail.latencyMs}ms` },
                { label: "Cost", value: `$${detail.cost.toFixed(4)}` },
              ].map((m) => (
                <div key={m.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>{m.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "white", textTransform: "capitalize" }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
          {detail.promptJson && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Prompt</div>
                <pre style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "14px", color: "rgba(255,255,255,0.75)", fontSize: "12px", lineHeight: 1.6, overflow: "auto", maxHeight: "200px" }}>
                  {JSON.stringify(JSON.parse(detail.promptJson), null, 2)}
                </pre>
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Response</div>
                <pre style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "14px", color: "rgba(255,255,255,0.75)", fontSize: "12px", lineHeight: 1.6, overflow: "auto", maxHeight: "200px" }}>
                  {detail.responseJson ? JSON.stringify(JSON.parse(detail.responseJson), null, 2) : "(not stored)"}
                </pre>
              </div>
            </div>
          )}
          {!detail.promptJson && (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
              Prompt content not stored. Enable &quot;Store request content&quot; in Settings to log prompts.
            </p>
          )}
        </div>
      )}

      {/* Requests table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Request ID", "Provider", "Model", "Latency", "Tokens", "Cost", "Cache", "Time", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <code style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{r.requestId}</code>
                  </td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.8)", textTransform: "capitalize", fontWeight: 600 }}>{r.provider}</td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.6)" }}>{r.model}</td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.6)" }}>{r.latencyMs}ms</td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.6)" }}>{r.tokens.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.6)" }}>${r.cost.toFixed(4)}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ background: r.cacheHit ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)", color: r.cacheHit ? "#10b981" : "#ef4444", padding: "2px 6px", borderRadius: "100px", fontSize: "10px", fontWeight: 700 }}>
                      {r.cacheHit ? "HIT" : "MISS"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.35)", fontSize: "11px", whiteSpace: "nowrap" }}>
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <a
                      href={`/dashboard/requests?id=${r.id}`}
                      style={{
                        color: "#a855f7",
                        textDecoration: "none",
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "4px 10px",
                        background: "rgba(168,85,247,0.1)",
                        borderRadius: "6px",
                        border: "1px solid rgba(168,85,247,0.2)",
                      }}
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={9} style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Showing {skip + 1}–{Math.min(skip + PAGE_SIZE, total)} of {total.toLocaleString()}</span>
            <div style={{ display: "flex", gap: "8px" }}>
              {page > 1 && <a href={`/dashboard/requests?page=${page - 1}`} style={{ color: "#a855f7", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>← Prev</a>}
              {page < totalPages && <a href={`/dashboard/requests?page=${page + 1}`} style={{ color: "#a855f7", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>Next →</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
