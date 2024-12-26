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

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  projectId: string
  createdAt: string
  updatedAt: string
}

interface KanbanTaskProps {
  task: Task
  index: number
  onUpdate: () => void
}

export function KanbanTask({ task, index, onUpdate }: KanbanTaskProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${task.id}`, {
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
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h4 className="font-semibold">{task.title}</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">打开菜单</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    编辑任务
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleDelete}
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
            <CardFooter>
              <span className="text-sm text-muted-foreground">
                更新于{" "}
                {formatDistanceToNow(new Date(task.updatedAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </CardFooter>
          </Card>
          <EditTaskDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            task={task}
            onTaskUpdated={onUpdate}
          />
        </div>
      )}
    </Draggable>
  )
} 