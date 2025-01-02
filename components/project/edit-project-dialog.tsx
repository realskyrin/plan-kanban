"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"
import { ToastAction } from "@/components/ui/toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "react-i18next"

interface Project {
  id: string
  title: string
  description: string
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED"
  createdAt: string
  updatedAt: string
}

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  onProjectUpdated: (projectId: string, updatedData: Partial<Project>) => Promise<void>
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const { t } = useTranslation()
  
  const statusOptions = [
    { value: "ACTIVE", label: t('common.inProgress') },
    { value: "COMPLETED", label: t('common.completed') },
    { value: "ARCHIVED", label: t('common.archived') },
  ] as const

  const [form, setForm] = useState<{
    title: string
    description: string
    status: "ACTIVE" | "COMPLETED" | "ARCHIVED"
  }>({
    title: project.title,
    description: project.description,
    status: project.status,
  })

  const handleSubmit = async () => {
    try {
      await onProjectUpdated(project.id, {
        ...form,
        updatedAt: new Date().toISOString(),
      })
      onOpenChange(false)
    } catch (error) {
      const errorMessage = process.env.DEBUG_PROD === 'true'
        ? `更新项目失败: ${error instanceof Error ? error.message : t('common.unknownError')}`
        : t('common.updateProjectFailed')

      toast.custom({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
        action: process.env.DEBUG_PROD === 'true' ? (
          <ToastAction altText={t('common.copyErrorInfo')} onClick={() => {
            navigator.clipboard.writeText(String(error))
          }}>
            {t('common.copyErrorInfo')}
          </ToastAction>
        ) : undefined
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('common.editProject')}</DialogTitle>
          <DialogDescription>
            {t('common.modifyProjectInfo')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t('common.projectName')}</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t('common.projectDescription')}</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">{t('common.projectStatus')}</Label>
            <Select
              value={form.status}
              onValueChange={(value: "ACTIVE" | "COMPLETED" | "ARCHIVED") =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('common.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit}>{t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 