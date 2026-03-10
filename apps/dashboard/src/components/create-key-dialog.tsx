"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export function CreateKeyDialog({
  action,
}: {
  action: (formData: FormData) => Promise<void>
}) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    await action(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 gap-2 shrink-0 bg-white text-black hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 transition-colors shadow-sm">
        <Plus className="w-4 h-4" /> Create new key
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-white/10 bg-[#0A0A0A] text-white p-6 shadow-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight text-white mb-1">Create API Key</DialogTitle>
          <DialogDescription className="text-[14px] text-neutral-400">
            Generate a new gateway access key. It will only be shown to you once.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-3">
            <label htmlFor="name" className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">
              Key Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Production Environment"
              className="h-10 rounded-md border-white/10 bg-[#000000] text-[14px] focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 transition-all text-white placeholder:text-neutral-600"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-9 px-4 bg-transparent border-white/10 text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-9 px-4 bg-white text-black hover:bg-neutral-200 font-medium tracking-tight transition-colors">
              Generate Key
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
