"use client"

import { useState, useEffect } from "react"
import { ProjectStatus } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import LoadingButton from "@/components/ui/loading-button"
import { Save } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

interface EditProjectDialogProps {
  project: {
    id: string
    title: string
    description: string
    createdAt: string
    updatedAt: string
    status: ProjectStatus
  }
  onProjectUpdated: (projectId: string, updatedData: Partial<Project>) => Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProjectDialog({
  project,
  onProjectUpdated,
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description)
  const [status, setStatus] = useState<ProjectStatus>(project.status)

  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(project.title)
      setDescription(project.description)
      setStatus(project.status)
    }
  }, [open, project])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isUpdating) return
    setIsUpdating(true)
    try {
      await onProjectUpdated(project.id, {
        title,
        description,
        status,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update project:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('common.editProject')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t('common.projectName')}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div>
              <Label htmlFor="description">{t('common.projectDescription')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div>
              <Label htmlFor="status">{t('common.projectStatus')}</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ProjectStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">{t('common.inProgress')}</SelectItem>
                  <SelectItem value="COMPLETED">{t('common.completed')}</SelectItem>
                  <SelectItem value="ARCHIVED">{t('common.archived')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              {t('common.cancel')}
            </Button>
            <LoadingButton
              type="submit"
              isLoading={isUpdating}
              text={t('common.save')}
              loadingText={t('common.updating')}
              icon={<Save className="mr-2 h-4 w-4" />}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 