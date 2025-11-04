import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authjs.session-token') || request.cookies.get('__Secure-authjs.session-token')
  const isLoggedIn = !!token
  const isOnLoginPage = request.nextUrl.pathname === '/login'

  if (!isLoggedIn && !isOnLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
