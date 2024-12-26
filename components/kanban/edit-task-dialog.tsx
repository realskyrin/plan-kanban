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
import { useToast } from "@/components/ui/use-toast"
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
  description: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
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

const priorityOptions = [
  { value: "low", label: "低优先级" },
  { value: "medium", label: "中优先级" },
  { value: "high", label: "高优先级" },
] as const

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const { toast } = useToast()
  const [form, setForm] = useState<{
    title: string
    description: string
    priority: "low" | "medium" | "high"
  }>({
    title: task.title,
    description: task.description,
    priority: task.priority,
  })

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          updatedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error("更新失败")

      onTaskUpdated()
      onOpenChange(false)
      toast({
        title: "成功",
        description: "任务已更新",
      })
    } catch (error) {
      toast({
        title: "错误",
        description: "更新任务失败",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑任务</DialogTitle>
          <DialogDescription>
            修改任务信息，完成后点击保存。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">任务标题</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">任务描述</Label>
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
            <Label htmlFor="priority">优先级</Label>
            <Select
              value={form.priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setForm((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择优先级" />
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
            取消
          </Button>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 