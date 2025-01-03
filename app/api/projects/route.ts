import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

// 获取用户的项目列表
export async function GET(request: NextRequest) {
  return requireAuth(request, async (userId) => {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return new NextResponse(JSON.stringify(projects), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
}

// 创建新项目
export async function POST(request: NextRequest) {
  return requireAuth(request, async (userId) => {
    try {
      const body = await request.json()
      const { title, description } = createProjectSchema.parse(body)

      const project = await prisma.project.create({
        data: {
          title,
          description,
          ownerId: userId,
          members: {
            create: {
              userId,
              role: 'OWNER',
            },
          },
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          members: {
            select: {
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })

      return new NextResponse(JSON.stringify(project), {
        status: 201,
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
  })
} 