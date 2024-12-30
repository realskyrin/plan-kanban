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

const statusOptions = [
  { value: "ACTIVE", label: "进行中" },
  { value: "COMPLETED", label: "已完成" },
  { value: "ARCHIVED", label: "已归档" },
] as const

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onProjectUpdated,
}: EditProjectDialogProps) {
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
        ? `更新项目失败: ${error instanceof Error ? error.message : '未知错误'}`
        : '更新项目失败，请稍后重试'

      toast.custom({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
        action: process.env.DEBUG_PROD === 'true' ? (
          <ToastAction altText="复制错误信息" onClick={() => {
            navigator.clipboard.writeText(String(error))
          }}>
            复制错误信息
          </ToastAction>
        ) : undefined
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑项目</DialogTitle>
          <DialogDescription>
            修改项目信息，完成后点击保存。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">项目名称</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">项目描述</Label>
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
            <Label htmlFor="status">项目状态</Label>
            <Select
              value={form.status}
              onValueChange={(value: "ACTIVE" | "COMPLETED" | "ARCHIVED") =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
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
            取消
          </Button>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 