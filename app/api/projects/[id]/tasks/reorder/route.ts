import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { canEditTask, PermissionError } from '@/lib/permissions'

const reorderTasksSchema = z.object({
  taskId: z.string(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  order: z.number(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (userId) => {
    try {
      const { id } = params
      const body = await request.json()
      const { taskId, status, order } = reorderTasksSchema.parse(body)

      // 检查权限
      if (!(await canEditTask(userId, id))) {
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

      // 开始事务处理
      await prisma.$transaction(async (tx) => {
        // 如果状态改变了，需要更新其他任务的顺序
        if (status !== task.status) {
          // 在原状态中，将该任务后面的任务顺序前移
          await tx.task.updateMany({
            where: {
              projectId: id,
              status: task.status,
              order: {
                gt: task.order,
              },
            },
            data: {
              order: {
                decrement: 1,
              },
            },
          })

          // 在新状态中，将目标位置及之后的任务顺序后移
          await tx.task.updateMany({
            where: {
              projectId: id,
              status,
              order: {
                gte: order,
              },
            },
            data: {
              order: {
                increment: 1,
              },
            },
          })
        } else {
          // 同一状态内移动
          if (order > task.order) {
            // 向下移动，将中间的任务顺序前移
            await tx.task.updateMany({
              where: {
                projectId: id,
                status,
                order: {
                  gt: task.order,
                  lte: order,
                },
              },
              data: {
                order: {
                  decrement: 1,
                },
              },
            })
          } else {
            // 向上移动，将中间的任务顺序后移
            await tx.task.updateMany({
              where: {
                projectId: id,
                status,
                order: {
                  gte: order,
                  lt: task.order,
                },
              },
              data: {
                order: {
                  increment: 1,
                },
              },
            })
          }
        }

        // 更新任务状态和顺序
        await tx.task.update({
          where: { id: taskId },
          data: {
            status,
            order,
          },
        })
      })

      return new NextResponse(JSON.stringify({ success: true }), {
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