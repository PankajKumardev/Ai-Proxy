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
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 gap-2 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors">
        <Plus className="w-4 h-4" /> Create new key
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl">Create API Key</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Generate a new gateway access key. It will only be shown to you once.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-3">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Key Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Production Environment"
              className="bg-background border-border focus-visible:ring-indigo-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border hover:bg-muted focus-visible:ring-indigo-500"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-indigo-500">
              Generate Key
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
