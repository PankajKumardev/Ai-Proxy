"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function createKey(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const name = (formData.get("name") as string | null)?.trim() || "Default Key"

  // Generate a cryptographically random key — shown plaintext only once
  const rawKey = `sk-gw-${crypto.randomBytes(24).toString("base64url")}`
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex")

  await prisma.apiKey.create({
    data: {
      name,
      keyHash,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/keys")
  // Pass the raw key in the URL so it can be shown once — never stored again
  redirect(`/dashboard/keys?new=${rawKey}`)
}

export async function deleteKey(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const keyId = formData.get("keyId") as string
  if (!keyId) return

  // Ensure the key belongs to the current user before deleting
  await prisma.apiKey.deleteMany({
    where: {
      id: keyId,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/keys")
}
