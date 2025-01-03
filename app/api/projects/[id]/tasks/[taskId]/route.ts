import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import {
  canViewProject,
  canEditTask,
  canDeleteTask,
  PermissionError,
} from '@/lib/permissions'

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  assigneeId: z.string().optional().nullable(),
  order: z.number().optional(),
})

// 获取单个任务
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  return requireAuth(request, async (userId) => {
    const { id, taskId } = params

    // 检查权限
    if (!(await canViewProject(userId, id))) {
      throw new PermissionError()
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
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

    if (!task || task.projectId !== id) {
      return new NextResponse(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new NextResponse(JSON.stringify(task), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
}

// 更新任务
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  return requireAuth(request, async (userId) => {
    try {
      const { id, taskId } = params
      const body = await request.json()
      const data = updateTaskSchema.parse(body)

      // 检查权限
      if (!(await canEditTask(userId, id))) {
        throw new PermissionError()
      }

      // 检查任务是否存在且属于该项目
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
      })

      if (!existingTask || existingTask.projectId !== id) {
        return new NextResponse(JSON.stringify({ error: 'Task not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // 如果更新了状态，需要重新计算顺序
      if (data.status && data.status !== existingTask.status) {
        const maxOrder = await prisma.task.aggregate({
          where: {
            projectId: id,
            status: data.status,
          },
          _max: {
            order: true,
          },
        })
        data.order = (maxOrder._max.order || 0) + 1
      }

      const task = await prisma.task.update({
        where: { id: taskId },
        data,
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

// 删除任务
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  return requireAuth(request, async (userId) => {
    try {
      const { id, taskId } = params

      // 检查权限
      if (!(await canDeleteTask(userId, id))) {
        throw new PermissionError()
      }

      // 检查任务是否存在且属于该项目
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })

      if (!task || task.projectId !== id) {
        return new NextResponse(JSON.stringify({ error: 'Task not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      await prisma.task.delete({
        where: { id: taskId },
      })

      return new NextResponse(null, { status: 204 })
    } catch (error) {
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