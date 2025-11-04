import { auth } from "@/auth"
import type { NextRequest } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname === "/login"

  if (!isLoggedIn && !isOnLoginPage) {
    return Response.redirect(new URL("/login", req.url))
  }

  if (isLoggedIn && isOnLoginPage) {
    return Response.redirect(new URL("/", req.url))
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
