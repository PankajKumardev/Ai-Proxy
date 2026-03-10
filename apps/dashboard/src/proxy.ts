import { NextRequest, NextResponse } from "next/server"

// AUTH BYPASSED FOR UI PREVIEW — re-enable when done testing
export async function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
