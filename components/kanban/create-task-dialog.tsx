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
import LoadingButton from "@/components/ui/loading-button"
import { Plus } from "lucide-react"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  onTaskCreated: () => void
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  status,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState<{
    title: string
    description: string | null
    priority: "LOW" | "MEDIUM" | "HIGH"
  }>({
    title: "",
    description: null,
    priority: "LOW",
  })

  const priorityOptions = [
    { value: "LOW", label: t('common.lowPriority') },
    { value: "MEDIUM", label: t('common.mediumPriority') },
    { value: "HIGH", label: t('common.highPriority') },
  ] as const

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error({
        title: t('common.error'),
        description: t('common.taskTitleEmpty'),
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          status,
          projectId,
          order: 1000, // 默认顺序
        }),
      })

      if (!response.ok) throw new Error(t('common.createFailed'))

      onTaskCreated()
      onOpenChange(false)
      setForm({
        title: "",
        description: null,
        priority: "LOW",
      })
      toast.success({
        title: t('common.success'),
        description: t('common.taskCreated'),
      })
    } catch (error) {
      toast.error({
        title: t('common.error'),
        description: t('common.createFailed'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('common.createTask')}</DialogTitle>
          <DialogDescription>
            {t('common.createTaskDescription')}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">{t('common.priority')}</Label>
            <Select
              value={form.priority}
              onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                setForm((prev) => ({ ...prev, priority: value }))
              }
              disabled={isLoading}
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
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            isLoading={isLoading}
            text={t('common.create')}
            loadingText={t('common.creating')}
            icon={<Plus className="mr-2 h-4 w-4" />}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 