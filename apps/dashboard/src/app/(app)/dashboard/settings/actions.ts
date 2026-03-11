"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// ── Update Email ──────────────────────────────────────────────────────────────
export async function updateEmail(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const email = (formData.get("email") as string | null)?.trim().toLowerCase()
  if (!email) return

  await prisma.user.update({
    where: { id: session.user.id },
    data: { email },
  })

  revalidatePath("/dashboard/settings")
  redirect("/dashboard/settings?success=email")
}

// ── Update Password ───────────────────────────────────────────────────────────
export async function updatePassword(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) redirect("/login")

  const valid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!valid) redirect("/dashboard/settings?error=password")

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  })

  revalidatePath("/dashboard/settings")
  redirect("/dashboard/settings?success=password")
}

// ── Update Logging Preference ─────────────────────────────────────────────────
export async function updateLogging(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  // Checkbox sends "on" when checked, nothing when unchecked
  const storeRequestLogs = formData.get("storeRequestLogs") === "on"

  await prisma.user.update({
    where: { id: session.user.id },
    data: { storeRequestLogs },
  })

  revalidatePath("/dashboard/settings")
  redirect("/dashboard/settings?success=logging")
}

// ── Delete Account ────────────────────────────────────────────────────────────
export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  // Cascade deletes ApiKey + UsageLog rows via Prisma schema onDelete: Cascade
  await prisma.user.delete({ where: { id: session.user.id } })

  redirect("/login")
}
