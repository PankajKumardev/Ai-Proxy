import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AppLayoutClient from "./client-layout"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return <AppLayoutClient userEmail={session.user?.email}>{children}</AppLayoutClient>
}
