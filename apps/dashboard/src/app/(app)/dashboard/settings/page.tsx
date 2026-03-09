import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle, ShieldAlert, Lock, Mail, ScanEye, Trash2 } from "lucide-react"

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

async function updateLogging(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session) redirect("/login")
  const storeRequestLogs = formData.get("storeRequestLogs") === "on"
  await prisma.user.update({
    where: { id: session.user?.id as string },
    data: { storeRequestLogs },
  })
  redirect("/dashboard/settings?success=logging")
}

async function deleteAccount() {
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
  if (!session) redirect("/login")
  const resolvedParams = await searchParams

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user?.id as string },
    select: { storeRequestLogs: true },
  })
  const storeRequestLogs = userRecord?.storeRequestLogs ?? false

  return (
    <div className="max-w-xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and security.</p>
      </div>

      {/* Toast banners */}
      {resolvedParams.success === "email" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Email updated successfully.
        </div>
      )}
      {resolvedParams.success === "password" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Password updated successfully.
        </div>
      )}
      {resolvedParams.success === "logging" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Privacy settings saved.
        </div>
      )}
      {resolvedParams.error === "password" && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <XCircle className="h-4 w-4 shrink-0" />
          Current password is incorrect.
        </div>
      )}

      {/* Update Email */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Update Email</h2>
        </div>
        <form action={updateEmail} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current email</label>
            <div className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed">
              {session?.user?.email}
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">New email</label>
            <Input id="email" type="email" name="email" required placeholder="new@example.com" />
          </div>
          <Button type="submit" variant="outline" size="sm">Save Email</Button>
        </form>
      </div>

      {/* Update Password */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Update Password</h2>
        </div>
        <form action={updatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current password</label>
            <Input id="currentPassword" type="password" name="currentPassword" required placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">New password</label>
            <Input id="newPassword" type="password" name="newPassword" required minLength={8} placeholder="••••••••" />
          </div>
          <Button type="submit" variant="outline" size="sm">Update Password</Button>
        </form>
      </div>

      {/* Privacy: Request Logging Toggle */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ScanEye className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Privacy &amp; Request Logging</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, the gateway stores the full prompt and response payload for each request. Required for the{" "}
          <span className="font-medium text-foreground">Request Replay</span> feature.{" "}
          <span className="font-medium text-foreground">Off by default</span> — recommended for sensitive workloads (healthcare, legal, finance).
        </p>
        <form action={updateLogging} className="flex items-center gap-4">
          {/* Native toggle built with Tailwind */}
          <label htmlFor="storeRequestLogs" className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                id="storeRequestLogs"
                name="storeRequestLogs"
                defaultChecked={storeRequestLogs}
                className="peer sr-only"
              />
              {/* Track */}
              <div className={`w-11 h-6 rounded-full border transition-colors ${
                storeRequestLogs
                  ? "bg-primary/20 border-primary/50"
                  : "bg-muted border-border"
              } peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2`} />
              {/* Thumb */}
              <div className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all ${
                storeRequestLogs ? "left-[22px]" : "left-[3px]"
              }`} />
            </div>
            <span className="text-sm font-medium">Store request &amp; response content</span>
          </label>
          <Button type="submit" variant="outline" size="sm">Save</Button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <h2 className="font-semibold text-destructive">Danger Zone</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Deleting your account is permanent. All API keys and usage logs will be removed immediately and cannot be recovered.
        </p>
        <form action={deleteAccount}>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </form>
      </div>
    </div>
  )
}
