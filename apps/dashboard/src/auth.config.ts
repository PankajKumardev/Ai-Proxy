import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Edge-compatible auth config — NO Prisma (Prisma uses Node.js APIs not available on Edge)
// Used by proxy.ts for route protection middleware
// The full auth config (with Prisma adapter + bcrypt) lives in auth.ts
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isOnDashboard) return isLoggedIn  // redirect to /login if not logged in
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.plan = (user as { plan?: string }).plan
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as Record<string, unknown>).id = token.id as string
        ;(session.user as Record<string, unknown>).plan = token.plan
      }
      return session
    },
  },
  // Credentials provider with no authorize logic here —
  // actual credential validation happens in the full auth.ts
  providers: [Credentials({})],
}
