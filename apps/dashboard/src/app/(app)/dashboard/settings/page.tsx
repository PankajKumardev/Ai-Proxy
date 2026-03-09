import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Settings — AI Gateway Dashboard" }
const prisma = new PrismaClient()

async function updateEmail(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session) redirect("/login")
  const newEmail = formData.get("email") as string
  await prisma.user.update({ where: { id: session.user?.id as string }, data: { email: newEmail } })
  redirect("/dashboard/settings?success=email")
}

async function updatePassword(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session) redirect("/login")
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  const user = await prisma.user.findUnique({ where: { id: session.user?.id as string } })
  if (!user) redirect("/login")

  const valid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!valid) redirect("/dashboard/settings?error=password")

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })
  redirect("/dashboard/settings?success=password")
}

async function deleteAccount(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session) redirect("/login")
  await prisma.user.delete({ where: { id: session.user?.id as string } })
  redirect("/login")
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const session = await auth()
  const resolvedParams = await searchParams

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "11px 14px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  }
  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600 as const,
    color: "rgba(255,255,255,0.6)" as const,
    marginBottom: "8px",
  }
  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "28px",
    marginBottom: "20px",
  }

  return (
    <div style={{ maxWidth: "560px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", marginBottom: "4px" }}>Settings</h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Manage your account</p>
      </div>

      {resolvedParams.success === "email" && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "12px 16px", color: "#10b981", fontSize: "14px", marginBottom: "20px" }}>✓ Email updated successfully</div>}
      {resolvedParams.success === "password" && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", padding: "12px 16px", color: "#10b981", fontSize: "14px", marginBottom: "20px" }}>✓ Password updated successfully</div>}
      {resolvedParams.error === "password" && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "12px 16px", color: "#ef4444", fontSize: "14px", marginBottom: "20px" }}>✗ Current password is incorrect</div>}

      {/* Update email */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "20px" }}>Update Email</h2>
        <form action={updateEmail} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Current email</label>
            <div style={{ ...inputStyle, color: "rgba(255,255,255,0.4)", cursor: "not-allowed" }}>{session?.user?.email}</div>
          </div>
          <div>
            <label style={labelStyle}>New email</label>
            <input type="email" name="email" required placeholder="new@example.com" style={inputStyle} />
          </div>
          <button type="submit" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "8px", padding: "10px 20px", fontWeight: 700, fontSize: "14px", cursor: "pointer", alignSelf: "flex-start" }}>
            Save Email
          </button>
        </form>
      </div>

      {/* Update password */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "20px" }}>Update Password</h2>
        <form action={updatePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Current password</label>
            <input type="password" name="currentPassword" required placeholder="••••••••" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>New password</label>
            <input type="password" name="newPassword" required minLength={8} placeholder="••••••••" style={inputStyle} />
          </div>
          <button type="submit" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "8px", padding: "10px 20px", fontWeight: 700, fontSize: "14px", cursor: "pointer", alignSelf: "flex-start" }}>
            Update Password
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div style={{ ...cardStyle, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#ef4444", marginBottom: "8px" }}>Danger Zone</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "20px" }}>Deleting your account is permanent. All API keys and usage logs will be removed immediately.</p>
        <form action={deleteAccount} onSubmit={(e) => { if (!confirm("Are you sure? This will permanently delete your account and all data.")) e.preventDefault() }}>
          <button type="submit" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 20px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
            Delete Account
          </button>
        </form>
      </div>
    </div>
  )
}
