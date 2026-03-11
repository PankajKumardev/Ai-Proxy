import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Key } from "lucide-react"
import { CreateKeyDialog } from "@/components/create-key-dialog"
import { CopyButton } from "@/components/copy-button"
import { createKey, deleteKey } from "./actions"

export const dynamic = "force-dynamic"   // auth() reads cookies — can't prerender
export const metadata = { title: "API Keys — AI Gateway Dashboard" }



export default async function KeysPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const resolvedParams = await searchParams
  const newKey = resolvedParams.new

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-white">API Keys</h1>
          <p className="text-[#a3a3a3] mt-1 text-lg leading-relaxed">Manage your gateway access keys for authenticating API requests.</p>
        </div>
        
        <CreateKeyDialog action={createKey} />
      </div>

      {newKey && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none -mt-32 -mr-32" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-medium text-emerald-400 tracking-tight">Your new API key</h3>
          </div>
          <p className="text-[15px] text-emerald-500/80 leading-relaxed max-w-2xl relative z-10">
            Please copy this key and store it securely. For security reasons, <strong className="text-emerald-400 font-medium">it will never be shown again</strong>.
          </p>
          <div className="relative group z-10 pt-2">
            <code className="block w-full rounded-xl bg-black/60 p-5 text-[15px] font-mono tracking-tight text-emerald-400 break-all border border-emerald-500/20 shadow-inner">
              {newKey}
            </code>
          </div>
        </div>
      )}

      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-sm relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
          <h2 className="text-sm font-medium tracking-wide text-white uppercase">Active Keys</h2>
        </div>

        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 w-[250px]">Name</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10">Key Hash</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 w-[150px]">Created</TableHead>
                <TableHead className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest h-10 text-right pr-6 w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-[#555] font-medium">
                    No API keys generated yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                keys.map((key) => (
                  <TableRow key={key.id} className="border-white/5 hover:bg-white/[0.02] transition-colors border-b group">
                    <TableCell className="py-3 font-medium tracking-tight text-white text-[13px]">{key.name}</TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <code className="rounded-md bg-[#111] px-2 py-1 font-mono text-[12px] text-neutral-400 tracking-tight transition-colors border border-white/10">
                          sk-gw-••••••••{key.keyHash.slice(-8)}
                        </code>
                        <CopyButton textToCopy={`sk-gw-••••••••${key.keyHash.slice(-8)}`} />
                      </div>
                    </TableCell>
                    <TableCell className="py-3 font-mono text-neutral-400 tracking-tight text-[12px]">
                      {new Date(key.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="py-3 text-right pr-4">
                      <form action={deleteKey}>
                        <input type="hidden" name="keyId" value={key.id} />
                        <Button type="submit" variant="ghost" size="icon" className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-colors h-7 w-7">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
