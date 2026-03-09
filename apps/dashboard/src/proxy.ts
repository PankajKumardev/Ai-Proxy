import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Next.js 16 proxy.ts — edge-compatible auth guard
// Uses next-auth/jwt getToken directly (no Prisma, works on Edge)
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard")

  if (isOnDashboard && !token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
