'use client'

import { Project, UserRole } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AvatarCircles from '@/components/ui/avatar-circles'
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'

interface ProjectWithMembers extends Project {
  owner: {
    id: string
    name: string
    email: string
  }
  members: {
    role: UserRole
    user: {
      id: string
      name: string
      email: string
    }
  }[]
}

interface ProjectMembersDialogProps {
  project: ProjectWithMembers
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProjectMembersDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: ProjectMembersDialogProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'EDITOR' | 'VIEWER'>('VIEWER')
  const [isAdding, setIsAdding] = useState(false)

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    setIsAdding(true)

    try {
      const response = await fetch(`/api/projects/${project.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('project.addMemberFailed'))
      }

      toast.success({ title: t('project.memberAdded') })
      setEmail('')
      setRole('VIEWER')
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error({
        title: error instanceof Error ? error.message : t('project.addMemberFailed')
      })
    } finally {
      setIsAdding(false)
    }
  }

  async function handleUpdateRole(memberId: string, newRole: UserRole) {
    try {
      const response = await fetch(
        `/api/projects/${project.id}/members/${memberId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('project.updateRoleFailed'))
      }

      toast.success({ title: t('project.roleUpdated') })
      onSuccess?.()
    } catch (error) {
      toast.error({
        title: error instanceof Error ? error.message : t('project.updateRoleFailed')
      })
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!window.confirm(t('project.removeMemberConfirm'))) return

    try {
      const response = await fetch(
        `/api/projects/${project.id}/members/${memberId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t('project.removeMemberFailed'))
      }

      toast.success({ title: t('project.memberRemoved') })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error({
        title: error instanceof Error ? error.message : t('project.removeMemberFailed')
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('project.memberManagement')}</DialogTitle>
          <DialogDescription>
            {t('project.memberManagementDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddMember} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder={t('project.enterEmailToAddMember')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isAdding}
            />
            <Select
              value={role}
              onValueChange={(value: 'EDITOR' | 'VIEWER') => setRole(value)}
              disabled={isAdding}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('project.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDITOR">{t('project.editor')}</SelectItem>
                <SelectItem value="VIEWER">{t('project.viewer')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isAdding}>
            <Plus className="mr-2 h-4 w-4" />
            {isAdding ? t('project.addingMember') : t('project.addMember')}
          </Button>
        </form>

        <div className="grid gap-4">
          <div className="grid gap-2">
            {project.members.map((member) => (
              <div
                key={member.user.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <AvatarCircles
                    avatars={[{
                      name: member.user.name,
                      profileUrl: `/users/${member.user.id}`,
                    }]}
                    size={32}
                  />
                  <div>
                    <div className="font-medium">{member.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.user.email}
                    </div>
                  </div>
                </div>
                {member.user.id === project.owner.id ? (
                  <div className="text-sm font-medium">{t('project.owner')}</div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t('common.openMenu')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateRole(member.user.id, 'EDITOR')
                        }
                        disabled={member.role === 'EDITOR'}
                      >
                        {t('project.setAsEditor')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateRole(member.user.id, 'VIEWER')
                        }
                        disabled={member.role === 'VIEWER'}
                      >
                        {t('project.setAsViewer')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleRemoveMember(member.user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('project.removeMember')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 