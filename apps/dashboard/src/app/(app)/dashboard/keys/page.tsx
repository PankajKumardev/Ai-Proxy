import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, KeyRound, TerminalSquare, AlertCircle, Trash2, Key } from "lucide-react"
import { CreateKeyDialog } from "@/components/create-key-dialog"
import { CopyButton } from "@/components/copy-button"

export const metadata = { title: "API Keys — AI Gateway Dashboard" }

async function createKey() { "use server" }
async function deleteKey(formData: FormData) { "use server" }

export default async function KeysPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const resolvedParams = await searchParams
  const newKey = resolvedParams.new

  // Dummy keys for UI preview
  const keys = [
    { id: "k1", name: "Production Key",    keyHash: "a3f9d2e1b8c74f6521d0e9a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3", createdAt: new Date("2025-02-01") },
    { id: "k2", name: "Development Key",   keyHash: "b4a0d3f2c9d85071e2c1f0a4b5d6e7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4", createdAt: new Date("2025-02-15") },
    { id: "k3", name: "CI/CD Pipeline",    keyHash: "c5b1e4d3a0e96182f3d2a1b5c6e7f8b9c0a1d2e3f4a5b6c7d8e9f0a1b2c3d4e5", createdAt: new Date("2025-03-01") },
  ]

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
