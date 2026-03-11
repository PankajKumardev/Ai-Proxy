
import Credentials from "next-auth/providers/credentials"

// Edge-compatible auth config — NO Prisma (Prisma uses Node.js APIs not available on Edge)
// Used by proxy.ts for route protection middleware
// The full auth config (with Prisma adapter + bcrypt) lives in auth.ts
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isOnDashboard) return isLoggedIn  // redirect to /login if not logged in
      return true
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.plan = (user as { plan?: string }).plan
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as Record<string, unknown>).id = token.id as string
        ;(session.user as Record<string, unknown>).plan = token.plan
      }
      return session
    },
  },
  // Credentials provider with dummy authorize here to satisfy type checks —
  // actual credential validation happens in the full auth.ts which overrides this
  providers: [
    Credentials({
      credentials: {},
      authorize: async () => null,
    })
  ],
}
