import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import crypto from "crypto"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "API Keys — AI Gateway Dashboard" }
const prisma = new PrismaClient()

async function createKey(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session) redirect("/login")
  const userId = session?.user?.id as string
  const name = (formData.get("name") as string) || "Default Key"

  const raw = `sk-gw-${crypto.randomBytes(24).toString("hex")}`
  const keyHash = crypto.createHash("sha256").update(raw).digest("hex")
  await prisma.apiKey.create({ data: { keyHash, userId, name } })

  // Redirect with the raw key in the query string (shown once, then gone)
  redirect(`/dashboard/keys?new=${encodeURIComponent(raw)}`)
}

async function deleteKey(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session) redirect("/login")
  const keyId = formData.get("keyId") as string
  await prisma.apiKey.deleteMany({ where: { id: keyId, userId: session?.user?.id as string } })
  redirect("/dashboard/keys")
}

export default async function KeysPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const session = await auth()
  const userId = session?.user?.id as string
  const resolvedParams = await searchParams
  const newKey = resolvedParams.new

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: false },
  })

  return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "4px" }}>API Keys</h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Manage your gateway access keys</p>
        </div>
        <form action={createKey} style={{ display: "flex", gap: "10px" }}>
          <input
            name="name"
            placeholder="Key name (optional)"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "white",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Create New Key
          </button>
        </form>
      </div>

      {/* Show new key (one time only) */}
      {newKey && (
        <div
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "16px" }}>🔑</span>
            <strong style={{ color: "#10b981", fontSize: "15px" }}>Your new API key</strong>
          </div>
          <code
            style={{
              display: "block",
              fontFamily: "monospace",
              fontSize: "14px",
              color: "white",
              background: "rgba(0,0,0,0.3)",
              padding: "12px 16px",
              borderRadius: "8px",
              wordBreak: "break-all",
              marginBottom: "12px",
            }}
          >
            {newKey}
          </code>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
            ⚠️ This key will only be shown once. Copy and store it in a safe place now.
          </p>
        </div>
      )}

      {/* Keys table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", overflow: "hidden" }}>
        {keys.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            No API keys yet. Create your first key to start using the gateway.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Name", "Key (masked)", "Created", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 20px", color: "white", fontWeight: 600 }}>{key.name}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <code style={{ fontFamily: "monospace", fontSize: "13px", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px" }}>
                      sk-gw-••••••••{key.keyHash.slice(-8)}
                    </code>
                  </td>
                  <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <form action={deleteKey}>
                      <input type="hidden" name="keyId" value={key.id} />
                      <button
                        type="submit"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.2)",
                          borderRadius: "6px",
                          padding: "6px 14px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
