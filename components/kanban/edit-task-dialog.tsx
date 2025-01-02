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
import { useTranslation } from "react-i18next"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Task {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  order: number
  projectId: string
  createdAt: string
  updatedAt: string
}

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  onTaskUpdated: () => void
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState<{
    title: string
    description: string | null
    priority: "LOW" | "MEDIUM" | "HIGH"
  }>({
    title: task.title,
    description: task.description,
    priority: task.priority,
  })

  const priorityOptions = [
    { value: "LOW", label: t('common.lowPriority') },
    { value: "MEDIUM", label: t('common.mediumPriority') },
    { value: "HIGH", label: t('common.highPriority') },
  ] as const

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          updatedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error(t('common.updateFailed'))

      onTaskUpdated()
      onOpenChange(false)
      toast.success({
        title: t('common.success'),
        description: t('common.taskUpdated'),
      })
    } catch (error) {
      toast.error({
        title: t('common.error'),
        description: t('common.updateFailed'),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('common.editTask')}</DialogTitle>
          <DialogDescription>
            {t('common.editTaskDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t('common.taskTitle')}</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t('common.taskDescription')}</Label>
            <Textarea
              id="description"
              value={form.description || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value || null,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">{t('common.priority')}</Label>
            <Select
              value={form.priority}
              onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                setForm((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('common.selectPriority')} />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
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