import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const COOKIE_NAME = 'auth_token'

export async function hashPassword(password: string) {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

export function generateToken(userId: string) {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  })
}

export function removeAuthCookie() {
  cookies().delete(COOKIE_NAME)
}

export async function getCurrentUser() {
  try {
    const token = cookies().get(COOKIE_NAME)?.value
    if (!token) return null

    const decoded = verify(token, JWT_SECRET) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth(
  request: NextRequest,
  handler: (userId: string) => Promise<NextResponse>
) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const decoded = verify(token, JWT_SECRET) as { userId: string }
    return await handler(decoded.userId)
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export type AuthUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> 