"use client"

import { useEffect, useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { useToast } from "@/components/ui/use-toast"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { useConfetti } from "@/hooks/use-confetti"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"

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

interface KanbanBoardProps {
  projectId: string
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [isOverDelete, setIsOverDelete] = useState(false)
  const { fireConfetti } = useConfetti()
  const { toast } = useToast()

  const columns = {
    TODO: {
      title: "待办",
      tasks: tasks
        .filter((task) => task.status === "TODO")
        .sort((a, b) => a.order - b.order),
    },
    IN_PROGRESS: {
      title: "进行中",
      tasks: tasks
        .filter((task) => task.status === "IN_PROGRESS")
        .sort((a, b) => a.order - b.order),
    },
    DONE: {
      title: "已完成",
      tasks: tasks
        .filter((task) => task.status === "DONE")
        .sort((a, b) => a.order - b.order),
    },
  }

  async function fetchTasks() {
    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`)
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      toast({
        title: "错误",
        description: "获取任务列表失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("删除失败")

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
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

  const onDragStart = () => {
    setIsDragging(true)
  }

  const onDragEnd = async (result: DropResult) => {
    setIsDragging(false)
    setIsOverDelete(false)

    const { destination, source, draggableId } = result

    if (!destination) {
      // 检查是否在删除区域上方结束拖拽
      if (isOverDelete) {
        await handleDelete(draggableId)
        return
      }
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // 检查是否拖拽到 DONE 列
    if (destination.droppableId === "DONE" && source.droppableId !== "DONE") {
      fireConfetti()
    }

    const taskToUpdate = tasks.find((task) => task.id === draggableId)
    if (!taskToUpdate) return

    // 获取目标列的任务
    const targetColumnTasks = tasks
      .filter((task) => task.status === destination.droppableId)
      .sort((a, b) => a.order - b.order)

    // 如果是同一列内的拖动，需要移除当前任务
    const targetColumnTasksWithoutCurrent = destination.droppableId === source.droppableId
      ? targetColumnTasks.filter((task) => task.id !== draggableId)
      : targetColumnTasks

    // 计算新的 order
    let newOrder: number
    if (targetColumnTasksWithoutCurrent.length === 0) {
      newOrder = 1000 // 初始顺序
    } else if (destination.index === 0) {
      newOrder = targetColumnTasksWithoutCurrent[0].order - 1000 // 放在最前面
    } else if (destination.index >= targetColumnTasksWithoutCurrent.length) {
      newOrder = targetColumnTasksWithoutCurrent[targetColumnTasksWithoutCurrent.length - 1].order + 1000 // 放在最后面
    } else {
      // 放在中间
      const prevOrder = targetColumnTasksWithoutCurrent[destination.index - 1].order
      const nextOrder = targetColumnTasksWithoutCurrent[destination.index].order
      newOrder = (prevOrder + nextOrder) / 2
    }

    // 乐观更新
    const newStatus = destination.droppableId as Task["status"]
    setTasks((prev) => prev.map((task) =>
      task.id === draggableId
        ? { ...task, status: newStatus, order: newOrder }
        : task
    ))

    try {
      const response = await fetch(
        `/api/tasks/${taskToUpdate.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            order: newOrder,
            updatedAt: taskToUpdate.updatedAt
          }),
        }
      )

      if (!response.ok) {
        throw new Error("更新失败")
      }

      const updatedTask = await response.json()
      setTasks((prev) => prev.map((task) =>
        task.id === draggableId ? updatedTask : task
      ))
    } catch (error) {
      // 回滚到原始状态
      setTasks((prev) => prev.map((task) =>
        task.id === draggableId
          ? { ...task, status: source.droppableId as Task["status"], order: taskToUpdate.order }
          : task
      ))
      
      toast({
        title: "错误",
        description: "更新任务状态失败",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[500px] rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {isDragging && (
        <div
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-64 h-24 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200",
            isOverDelete
              ? "border-red-500 bg-red-100 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              : "border-red-300 bg-white",
            !isDragging && "opacity-0 pointer-events-none"
          )}
          onMouseEnter={() => setIsOverDelete(true)}
          onMouseLeave={() => setIsOverDelete(false)}
        >
          <div className="flex flex-col items-center space-y-2 text-red-500">
            <Trash2 className={cn(
              "w-6 h-6 transition-transform duration-200",
              isOverDelete && "scale-125"
            )} />
            <span className="text-sm font-medium">拖到此处删除</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(columns).map(([columnId, column]) => (
          <KanbanColumn
            key={columnId}
            id={columnId}
            title={column.title}
            tasks={column.tasks}
            onTaskUpdate={fetchTasks}
            projectId={projectId}
          />
        ))}
      </div>
    </DragDropContext>
  )
} 