import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle, Trash2 } from "lucide-react"
import { updateEmail, updatePassword, updateLogging, deleteAccount } from "./actions"

export const metadata: Metadata = { title: "Settings — AI Gateway Dashboard" }
export const dynamic = "force-dynamic"  // auth() reads cookies — can't prerender


export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, storeRequestLogs: true },
  })
  if (!user) redirect("/login")

  const resolvedParams = await searchParams
  const { email: currentEmail, storeRequestLogs } = user



  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-medium tracking-tighter text-white">Settings</h1>
        <p className="text-[#a3a3a3] mt-1 text-lg leading-relaxed">Manage your account preferences and security configuration.</p>
      </div>

      {/* Toast banners */}
      {resolvedParams.success === "email" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Email updated successfully.
        </div>
      )}
      {resolvedParams.success === "password" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Password updated successfully.
        </div>
      )}
      {resolvedParams.success === "logging" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Privacy settings saved.
        </div>
      )}
      {resolvedParams.error === "password" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
          <XCircle className="h-5 w-5 shrink-0" />
          Current password is incorrect.
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid gap-6">

        {/* Update Email */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 shadow-sm relative flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-medium tracking-tight text-white">Email Address</h2>
          </div>
          <form action={updateEmail} className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">Current email</label>
              <div className="flex h-10 w-full rounded-md border border-white/10 bg-[#000000] px-3 items-center text-[14px] text-neutral-500 cursor-not-allowed">
                {currentEmail}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">New email</label>
              <Input id="email" type="email" name="email" required placeholder="new@example.com" className="h-10 rounded-md border-white/10 bg-[#000000] text-[14px] focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 transition-all text-white placeholder:text-neutral-600" />
            </div>
            <Button type="submit" variant="outline" className="h-9 px-4 bg-transparent border-white/10 text-white hover:bg-white/5 transition-colors">Save Email</Button>
          </form>
        </div>

        {/* Update Password */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 shadow-sm relative flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-medium tracking-tight text-white">Password Security</h2>
          </div>
          <form action={updatePassword} className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">Current password</label>
              <Input id="currentPassword" type="password" name="currentPassword" required placeholder="••••••••" className="h-10 rounded-md border-white/10 bg-[#000000] text-[14px] focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 transition-all text-white placeholder:text-neutral-600" />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">New password</label>
              <Input id="newPassword" type="password" name="newPassword" required minLength={8} placeholder="••••••••" className="h-10 rounded-md border-white/10 bg-[#000000] text-[14px] focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 transition-all text-white placeholder:text-neutral-600" />
            </div>
            <Button type="submit" variant="outline" className="h-9 px-4 bg-transparent border-white/10 text-white hover:bg-white/5 transition-colors">Update Password</Button>
          </form>
        </div>

        {/* Privacy: Request Logging Toggle */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 shadow-sm relative flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-medium tracking-tight text-white">Data Privacy &amp; Logging</h2>
          </div>
          <p className="text-[14px] text-neutral-400 leading-relaxed max-w-2xl mb-8">
            When enabled, the gateway explicitly stores the full prompt and response payload for each request in Postgres. This is required for the <strong className="text-white font-medium">Request Console Replay</strong> feature, but is <strong className="text-white font-medium">off by default</strong> for compliance with sensitive workloads.
          </p>
          <form action={updateLogging} className="p-5 rounded-lg border border-white/10 bg-[#000000] w-full flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <label htmlFor="storeRequestLogs" className="flex items-center gap-4 cursor-pointer select-none group/toggle">
              <div className="relative">
                <input
                  type="checkbox"
                  id="storeRequestLogs"
                  name="storeRequestLogs"
                  defaultChecked={storeRequestLogs}
                  className="peer sr-only"
                />
                {/* Track */}
                <div className={`w-10 h-6 rounded-full border transition-all duration-300 ${
                  storeRequestLogs
                    ? "bg-white text-black border-white"
                    : "bg-neutral-800 border-neutral-700 group-hover/toggle:border-neutral-600"
                } peer-focus-visible:ring-2 peer-focus-visible:ring-white/20 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#111]`} />
                {/* Thumb */}
                <div className={`absolute top-[2px] h-5 w-5 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center ${
                  storeRequestLogs ? "left-[18px] bg-black" : "left-[2px] bg-neutral-400"
                }`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium tracking-tight text-white group-hover/toggle:text-white transition-colors">Store message contents natively</span>
                <span className="text-[13px] text-neutral-500">Enable detailed prompt inspection</span>
              </div>
            </label>
            <Button type="submit" variant="secondary" className="h-9 px-6 bg-white text-black hover:bg-neutral-200 font-medium tracking-tight whitespace-nowrap transition-colors">Save Preferences</Button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#0A0A0A] border border-red-500/20 rounded-xl p-8 shadow-sm relative flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-medium tracking-tight text-red-500">Danger Zone</h2>
          </div>
          <p className="text-[14px] text-neutral-400 leading-relaxed max-w-2xl mb-8">
            Deleting your account is permanent. All programmatic API keys, active streams, and raw usage logs will be cryptographically erased immediately. <strong className="text-white font-medium">This cannot be recovered.</strong>
          </p>
          <form action={deleteAccount}>
            <Button
              type="submit"
              variant="destructive"
              className="h-9 px-4 gap-2 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors rounded-md"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account Permanently
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
