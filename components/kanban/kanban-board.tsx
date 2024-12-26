"use client"

import { useEffect, useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { useToast } from "@/components/ui/use-toast"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
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
      tasks: tasks.filter((task) => task.status === "todo"),
    },
    in_progress: {
      title: "进行中",
      tasks: tasks.filter((task) => task.status === "in_progress"),
    },
    done: {
      title: "已完成",
      tasks: tasks.filter((task) => task.status === "done"),
    },
  }

  async function fetchTasks() {
    try {
      const response = await fetch(
        `http://localhost:3001/tasks?projectId=${projectId}`
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

    const taskToUpdate = tasks.find((task) => task.id === draggableId)
    if (!taskToUpdate) return

    const updatedTasks = tasks.map((task) =>
      task.id === draggableId
        ? { ...task, status: destination.droppableId as Task["status"] }
        : task
    )
    
    setTasks(updatedTasks)

    try {
      const response = await fetch(
        `http://localhost:3001/tasks/${draggableId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: destination.droppableId as Task["status"],
          }),
        }
      )

      if (!response.ok) {
        throw new Error("更新失败")
      }
    } catch (error) {
      setTasks((prev) => prev.map((task) =>
        task.id === draggableId
          ? { ...task, status: source.droppableId as Task["status"] }
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