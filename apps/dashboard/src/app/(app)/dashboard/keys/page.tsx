import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import crypto from "crypto"
import type { Metadata } from "next"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Plus, Trash2, Key } from "lucide-react"

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
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your gateway access keys for authenticating API requests.</p>
        </div>
        
        <form action={createKey} className="flex flex-col sm:flex-row gap-3">
          <Input 
            name="name" 
            placeholder="Key name (e.g., Production)" 
            className="w-full sm:w-[250px] bg-background"
          />
          <Button type="submit" className="gap-2 shrink-0">
            <Plus className="w-4 h-4" /> Create new key
          </Button>
        </form>
      </div>

      {newKey && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-500">
            <Key className="w-5 h-5" />
            <h3 className="font-semibold">Your new API key</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Please copy this key and store it securely. For security reasons, <strong className="text-foreground">it will never be shown again</strong>.
          </p>
          <div className="relative group">
            <code className="block w-full rounded-md bg-black/50 p-4 text-sm font-mono text-emerald-400 break-all border border-emerald-500/20 shadow-inner">
              {newKey}
            </code>
          </div>
        </div>
      )}

      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>NAME</TableHead>
              <TableHead>KEY HASH</TableHead>
              <TableHead>CREATED</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No API keys generated yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => (
                <TableRow key={key.id} className="group transition-colors">
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors border border-border/50">
                      sk-gw-••••••••{key.keyHash.slice(-8)}
                    </code>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(key.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={deleteKey}>
                      <input type="hidden" name="keyId" value={key.id} />
                      <Button type="submit" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
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
  )
}
