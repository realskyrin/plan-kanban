import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie, verifyPassword } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid email or password' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid email or password' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // 生成 token 并设置 cookie
    const token = generateToken(user.id)
    setAuthCookie(token)

    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user

    return new NextResponse(JSON.stringify(userWithoutPassword), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
} 