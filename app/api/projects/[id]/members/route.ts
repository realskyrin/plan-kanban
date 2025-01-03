import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'
import { canManageProjectMembers, PermissionError } from '@/lib/permissions'

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['EDITOR', 'VIEWER']),
})

const updateMemberSchema = z.object({
  role: z.enum(['EDITOR', 'VIEWER']),
})

// 获取项目成员列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (userId) => {
    const { id } = params

    // 检查权限
    if (!(await canManageProjectMembers(userId, id))) {
      throw new PermissionError()
    }

    const members = await prisma.userProject.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return new NextResponse(JSON.stringify(members), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
}

// 添加项目成员
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (userId) => {
    try {
      const { id } = params
      const body = await request.json()
      const { email, role } = addMemberSchema.parse(body)

      // 检查权限
      if (!(await canManageProjectMembers(userId, id))) {
        throw new PermissionError()
      }

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return new NextResponse(
          JSON.stringify({ error: 'User not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      // 检查用户是否已经是项目成员
      const existingMember = await prisma.userProject.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: id,
          },
        },
      })

      if (existingMember) {
        return new NextResponse(
          JSON.stringify({ error: 'User is already a member' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      // 添加成员
      const member = await prisma.userProject.create({
        data: {
          userId: user.id,
          projectId: id,
          role,
          assignedBy: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return new NextResponse(JSON.stringify(member), {
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

// 更新成员角色
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  return requireAuth(request, async (userId) => {
    try {
      const { id, memberId } = params
      const body = await request.json()
      const { role } = updateMemberSchema.parse(body)

      // 检查权限
      if (!(await canManageProjectMembers(userId, id))) {
        throw new PermissionError()
      }

      const member = await prisma.userProject.update({
        where: {
          userId_projectId: {
            userId: memberId,
            projectId: id,
          },
        },
        data: { role },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return new NextResponse(JSON.stringify(member), {
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

// 移除成员
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  return requireAuth(request, async (userId) => {
    try {
      const { id, memberId } = params

      // 检查权限
      if (!(await canManageProjectMembers(userId, id))) {
        throw new PermissionError()
      }

      // 检查是否是项目所有者
      const project = await prisma.project.findUnique({
        where: { id },
        select: { ownerId: true },
      })

      if (project?.ownerId === memberId) {
        return new NextResponse(
          JSON.stringify({ error: 'Cannot remove project owner' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      await prisma.userProject.delete({
        where: {
          userId_projectId: {
            userId: memberId,
            projectId: id,
          },
        },
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