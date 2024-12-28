"use client"

import { Draggable } from "@hello-pangea/dnd"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useState } from "react"
import { EditTaskDialog } from "./edit-task-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

const priorityConfig = {
  LOW: {
    label: "低优先级",
    color: "bg-green-800",
  },
  MEDIUM: {
    label: "中优先级",
    color: "bg-yellow-500",
  },
  HIGH: {
    label: "高优先级",
    color: "bg-red-800",
  },
} as const

interface KanbanTaskProps {
  task: Task
  index: number
  onUpdate: () => void
}

export function KanbanTask({ task, index, onUpdate }: KanbanTaskProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("删除失败")

      onUpdate()
      toast({
        title: "成功",
        description: "任务已删除",
      })
    } catch (error) {
      toast({
        title: "错误",
        description: "删除任务失败",
        variant: "destructive",
      })
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "touch-none select-none",
            snapshot.isDragging && "rotate-2"
          )}
        >
          <Card 
            className={cn(
              "border shadow-sm transition-all cursor-pointer hover:shadow-md",
              snapshot.isDragging && "shadow-lg opacity-60"
            )}
            onClick={() => setIsViewDialogOpen(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h4 className="font-semibold">{task.title}</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">打开菜单</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    setIsEditDialogOpen(true)
                  }}>
                    编辑任务
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                  >
                    删除任务
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description || "暂无描述"}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="flex items-center justify-between w-full">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-white",
                    priorityConfig[task.priority].color
                  )}
                >
                  {priorityConfig[task.priority].label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  更新于{" "}
                  {formatDistanceToNow(new Date(task.updatedAt), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
              </div>
            </CardFooter>
          </Card>
          <EditTaskDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            task={task}
            onTaskUpdated={onUpdate}
          />
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{task.title}</DialogTitle>
                <DialogDescription>
                  创建于{" "}
                  {formatDistanceToNow(new Date(task.createdAt), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">任务描述</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {task.description || "暂无描述"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-white",
                      priorityConfig[task.priority].color
                    )}
                  >
                    {priorityConfig[task.priority].label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    更新于{" "}
                    {formatDistanceToNow(new Date(task.updatedAt), {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Draggable>
  )
} 