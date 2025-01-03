import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export async function getUserProjectRole(userId: string, projectId: string) {
  const userProject = await prisma.userProject.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  })

  return userProject?.role
}

export async function canViewProject(userId: string, projectId: string) {
  const role = await getUserProjectRole(userId, projectId)
  return role !== undefined
}

export async function canEditProject(userId: string, projectId: string) {
  const role = await getUserProjectRole(userId, projectId)
  return role === UserRole.OWNER || role === UserRole.EDITOR
}

export async function canDeleteProject(userId: string, projectId: string) {
  const role = await getUserProjectRole(userId, projectId)
  return role === UserRole.OWNER
}

export async function canManageProjectMembers(userId: string, projectId: string) {
  const role = await getUserProjectRole(userId, projectId)
  return role === UserRole.OWNER
}

export async function canCreateTask(userId: string, projectId: string) {
  const role = await getUserProjectRole(userId, projectId)
  return role === UserRole.OWNER || role === UserRole.EDITOR
}

export async function canEditTask(userId: string, projectId: string) {
  const role = await getUserProjectRole(userId, projectId)
  return role === UserRole.OWNER || role === UserRole.EDITOR
}

export async function canDeleteTask(userId: string, projectId: string) {
  const role = await getUserProjectRole(userId, projectId)
  return role === UserRole.OWNER || role === UserRole.EDITOR
}

export async function canAssignTask(userId: string, projectId: string) {
  const role = await getUserProjectRole(userId, projectId)
  return role === UserRole.OWNER || role === UserRole.EDITOR
}

export class PermissionError extends Error {
  constructor(message = '您没有权限执行此操作') {
    super(message)
    this.name = 'PermissionError'
  }
} 