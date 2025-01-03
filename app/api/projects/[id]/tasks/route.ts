import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { canViewProject, canCreateTask, PermissionError } from '@/lib/permissions'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  assigneeId: z.string().optional(),
})

// 获取项目任务列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (userId) => {
    const { id } = params

    // 检查权限
    if (!(await canViewProject(userId, id))) {
      throw new PermissionError()
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { order: 'asc' },
      ],
    })

    return new NextResponse(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
}

// 创建任务
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (userId) => {
    try {
      const { id } = params
      const body = await request.json()
      const data = createTaskSchema.parse(body)

      // 检查权限
      if (!(await canCreateTask(userId, id))) {
        throw new PermissionError()
      }

      // 获取当前列中最大的 order 值
      const maxOrder = await prisma.task.aggregate({
        where: {
          projectId: id,
          status: data.status || 'TODO',
        },
        _max: {
          order: true,
        },
      })

      const task = await prisma.task.create({
        data: {
          ...data,
          projectId: id,
          order: (maxOrder._max.order || 0) + 1,
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return new NextResponse(JSON.stringify(task), {
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

      if (error instanceof PermissionError) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
          status: 403,
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