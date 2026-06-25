import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const isLoginPage = pathname === '/admin/login'
  const isAuthenticated =
    request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE

  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

