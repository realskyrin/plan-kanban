"use client"

import { useEffect, useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { useToast } from "@/components/ui/use-toast"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"

interface Task {
  id: number
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
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
  const { toast } = useToast()

  const columns = {
    todo: {
      title: "待办",
      tasks: tasks
        .filter((task) => task.status === "todo")
        .sort((a, b) => a.order - b.order),
    },
    in_progress: {
      title: "进行中",
      tasks: tasks
        .filter((task) => task.status === "in_progress")
        .sort((a, b) => a.order - b.order),
    },
    done: {
      title: "已完成",
      tasks: tasks
        .filter((task) => task.status === "done")
        .sort((a, b) => a.order - b.order),
    },
  }

  async function fetchTasks() {
    try {
      const response = await fetch(
        `/api/tasks?projectId=${projectId}`
      )
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

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const taskToUpdate = tasks.find((task) => String(task.id) === draggableId)
    if (!taskToUpdate) return

    // 获取目标列的任务
    const targetColumnTasks = tasks
      .filter((task) => task.status === destination.droppableId)
      .sort((a, b) => a.order - b.order)

    // 如果是同一列内的拖动，需要移除当前任务
    const targetColumnTasksWithoutCurrent = destination.droppableId === source.droppableId
      ? targetColumnTasks.filter((task) => String(task.id) !== draggableId)
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

    const updatedTasks = tasks.map((task) =>
      String(task.id) === draggableId
        ? { 
            ...task, 
            status: destination.droppableId as Task["status"],
            order: newOrder
          }
        : task
    )
    
    setTasks(updatedTasks)

    try {
      const response = await fetch(
        `/api/tasks/${taskToUpdate.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: destination.droppableId as Task["status"],
            order: newOrder,
            updatedAt: taskToUpdate.updatedAt // 保持原来的更新时间
          }),
        }
      )

      if (!response.ok) {
        throw new Error("更新失败")
      }
    } catch (error) {
      setTasks((prev) => prev.map((task) =>
        String(task.id) === draggableId
          ? { 
              ...task, 
              status: source.droppableId as Task["status"],
              order: taskToUpdate.order 
            }
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
    <DragDropContext onDragEnd={onDragEnd}>
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