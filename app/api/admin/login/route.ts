import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_VALUE,
  isValidAdminCredentials,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string
    password?: string
  }

  if (!body.username || !body.password) {
    return NextResponse.json(
      { error: 'Username and password are required.' },
      { status: 400 },
    )
  }

  if (!isValidAdminCredentials(body.username, body.password)) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
  return response
}
