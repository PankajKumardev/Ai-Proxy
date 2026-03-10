import AppLayoutClient from "./client-layout"

// AUTH BYPASSED FOR UI PREVIEW
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient userEmail="demo@aigateway.dev">{children}</AppLayoutClient>
}

