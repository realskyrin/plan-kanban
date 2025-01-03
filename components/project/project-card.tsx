"use client"

import { Project, Prisma } from '@prisma/client'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ProjectStatus } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { EditProjectDialog } from '@/components/project/edit-project-dialog'
import { useState, useEffect } from 'react'
import { toast } from '@/lib/toast'
import { ProjectMembersDialog } from '@/components/project/project-members-dialog'
import AvatarCircles from '@/components/ui/avatar-circles'
import { useAuth } from '@/components/providers/auth-provider'
import { useProject } from '@/components/providers/project-provider'
import { updateProject } from '@/lib/api'
import { useTranslation } from 'react-i18next'

interface ProjectWithDetails extends Project {
  _count: {
    tasks: number
  }
  owner: {
    id: string
    name: string
    email: string
  }
  members: {
    role: 'OWNER' | 'EDITOR' | 'VIEWER'
    user: {
      id: string
      name: string
      email: string
    }
  }[]
}

interface ProjectCardProps {
  project: ProjectWithDetails
  onDeleted?: () => void
}

export function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { deleteProject, isOperationInProgress } = useProject()
  const { t } = useTranslation()
  const [projectData, setProjectData] = useState<ProjectWithDetails>(project)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmName, setDeleteConfirmName] = useState('')

  const isDeleting = isOperationInProgress('deleteProject')
  const isUpdating = isOperationInProgress('updateProject')

  const userRole = projectData.members.find(m => m.user.id === user?.id)?.role
  const canEdit = userRole === 'OWNER' || userRole === 'EDITOR'
  const canManageMembers = userRole === 'OWNER'

  useEffect(() => {
    setProjectData(project)
  }, [project])

  async function refreshProjectData() {
    try {
      const response = await fetch(`/api/projects/${projectData.id}`)
      if (!response.ok) {
        throw new Error(t('common.getProjectListFailed'))
      }
      const data = await response.json()
      setProjectData(data)
    } catch (error) {
      toast.error({
        title: error instanceof Error ? error.message : t('common.getProjectListFailed')
      })
    }
  }

  async function handleDelete() {
    if (deleteConfirmName !== projectData.title) {
      toast.error({ title: t('common.deleteNameMismatch') })
      return
    }

    try {
      await deleteProject(projectData.id)
      setShowDeleteDialog(false)
      onDeleted?.()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    // 防止点击下拉菜单或其内部元素时触发卡片跳转
    if (!(e.target instanceof Element)) return
    
    const target = e.target as Element
    if (target.closest('.dropdown-trigger') || target.closest('[role="menu"]')) {
      return
    }
    router.push(`/projects/${projectData.id}`)
  }

  const statusMap: Record<ProjectStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    ACTIVE: { label: t('common.inProgress'), variant: 'default' },
    COMPLETED: { label: t('common.completed'), variant: 'secondary' },
    ARCHIVED: { label: t('common.archived'), variant: 'outline' },
  }

  return (
    <>
      <Card
        className="group relative hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="font-semibold leading-none tracking-tight">
            {projectData.title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant={statusMap[projectData.status].variant}>
              {statusMap[projectData.status].label}
            </Badge>
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 dropdown-trigger"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">{t('common.openMenu')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowEditDialog(true)
                    }}
                  >
                    {t('common.editProject')}
                  </DropdownMenuItem>
                  {canManageMembers && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMembersDialog(true)
                      }}
                    >
                      {t('project.manageMembers')}
                    </DropdownMenuItem>
                  )}
                  {canManageMembers && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDeleteDialog(true)
                        }}
                      >
                        {t('common.deleteProject')}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {projectData.description || t('common.noDescription')}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-4">
            <AvatarCircles
              numPeople={projectData.members.length > 5 ? projectData.members.length - 5 : 0}
              avatars={projectData.members.slice(0, 5).map(member => ({
                name: member.user.name,
                profileUrl: `/users/${member.user.id}`,
              }))}
              size={32}
            />
          </div>
        </CardFooter>
      </Card>

      <EditProjectDialog
        project={{
          id: projectData.id,
          title: projectData.title,
          description: projectData.description || '',
          createdAt: new Date(projectData.createdAt).toDateString(),
          updatedAt: new Date(projectData.updatedAt).toDateString(),
          status: projectData.status,
        }}
        onProjectUpdated={async (projectId, updatedData) => {
          await updateProject(projectId, updatedData)
          const response = await fetch(`/api/projects/${projectId}`)
          const updatedProject = await response.json()
          setProjectData(updatedProject)
        }}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        isUpdating={isUpdating}
      />

      <ProjectMembersDialog
        project={projectData}
        open={showMembersDialog}
        onOpenChange={setShowMembersDialog}
        onSuccess={refreshProjectData}
      />

      <Dialog 
        open={showDeleteDialog} 
        onOpenChange={(open) => {
          if (!isDeleting) {
            setShowDeleteDialog(open)
            if (!open) {
              setDeleteConfirmName('')
            }
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('project.deleteProject')}</DialogTitle>
            <DialogDescription>
              {t('common.thisOperationCannotBeUndone')}
              {t('common.pleaseEnterProjectName')} <span className="font-semibold text-red-500">{project.title}</span> {t('common.toConfirmDelete')}
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder={t('common.enterProjectName')}
            value={deleteConfirmName}
            onChange={(e) => setDeleteConfirmName(e.target.value)}
            disabled={isDeleting}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDelete()
              }}
              disabled={isDeleting || deleteConfirmName !== projectData.title}
            >
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}