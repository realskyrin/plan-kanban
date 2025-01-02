"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { KanbanColumn } from "./kanban-column"
import { toast } from "@/lib/toast"
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd"
import { useConfetti } from "@/hooks/use-confetti"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { ToastAction } from "@/components/ui/toast"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const { fireConfetti } = useConfetti()
  const deleteTimeoutRef = useRef<number>()
  const taskRef = useRef<Task | null>(null)

  const columns = {
    TODO: {
      title: t('common.todo'),
      tasks: tasks
        .filter((task): task is Task => task !== null && task.status === "TODO")
        .sort((a, b) => a.order - b.order),
    },
    IN_PROGRESS: {
      title: t('common.inProgress'),
      tasks: tasks
        .filter((task): task is Task => task !== null && task.status === "IN_PROGRESS")
        .sort((a, b) => a.order - b.order),
    },
    DONE: {
      title: t('common.done'),
      tasks: tasks
        .filter((task): task is Task => task !== null && task.status === "DONE")
        .sort((a, b) => a.order - b.order),
    },
  }

  async function fetchTasks() {
    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`)
      const data = await response.json()
      setTasks(data.filter((task: Task | null): task is Task => task !== null))
    } catch (error) {
      toast.error({
        title: t('common.error'),
        description: t('common.getTaskListFailed'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const handleRestore = useCallback(() => {
    console.log('Restore clicked', { taskRef: taskRef.current, timeoutRef: deleteTimeoutRef.current })
    
    if (!taskRef.current) return

    // 清除删除定时器
    if (deleteTimeoutRef.current) {
      window.clearTimeout(deleteTimeoutRef.current)
      deleteTimeoutRef.current = undefined
    }

    // 恢复 UI
    const taskToRestore = taskRef.current
    setTasks(prev => {
      // 确保不会添加重复的任务
      if (prev.some(task => task?.id === taskToRestore.id)) {
        return prev
      }
      return [...prev, taskToRestore]
    })
    taskRef.current = null
    
    toast.success({
      title: t('common.success'),
      description: t('common.taskRestored'),
    })
  }, [])

  const handleDelete = async (taskId: string) => {
    try {
      console.log('Delete clicked', { taskId })
      const taskToDelete = tasks.find(t => t.id === taskId)
      if (!taskToDelete) return

      // 清除之前的定时器（如果存在）
      if (deleteTimeoutRef.current) {
        window.clearTimeout(deleteTimeoutRef.current)
        deleteTimeoutRef.current = undefined
      }

      // 保存任务到 ref 中
      taskRef.current = taskToDelete
      
      // 先从 UI 移除
      setTasks(prev => prev.filter(task => task.id !== taskId))

      // 显示 toast 并设置延迟删除
      toast.success({
        title: t('common.success'),
        description: t('common.taskDeleted'),
        duration: 5000,
        action: (
          <ToastAction altText="撤回" onClick={handleRestore}>
            {t('common.undo')}
          </ToastAction>
        ),
      })

      // 设置定时器，5秒后真正从数据库删除
      deleteTimeoutRef.current = window.setTimeout(async () => {
        console.log('Executing delete from database', { taskId, taskRef: taskRef.current })
        try {
          const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || t('common.deleteFailed'))
          }
          
          // 删除成功后清除引用
          deleteTimeoutRef.current = undefined
          taskRef.current = null
        } catch (error) {
          console.error('Delete from database failed', error)
          toast.error({
            title: t('common.error'),
            description: t('common.deleteFailed'),
          })
          // 如果删除失败，恢复 UI
          if (taskRef.current) {
            const taskToRestore = taskRef.current as Task
            setTasks(prev => [...prev, taskToRestore])
          }
          taskRef.current = null
        }
      }, 5000)

    } catch (error) {
      console.error('Delete operation failed', error)
      toast.error({
        title: t('common.error'),
        description: t('common.deleteFailed'),
      })
      // 发生错误时恢复 UI
      if (taskRef.current) {
        const taskToRestore = taskRef.current as Task
        setTasks(prev => [...prev, taskToRestore])
      }
      taskRef.current = null
    }
  }

  const onDragStart = () => {
    setIsDragging(true)
  }

  const onDragEnd = async (result: DropResult) => {
    setIsDragging(false)

    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    // 检查是否拖拽到删除区域
    if (destination.droppableId === "DELETE_ZONE") {
      await handleDelete(draggableId)
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
        throw new Error(t('common.updateFailed'))
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
      
      toast.error({
        title: t('common.error'),
        description: t('common.updateFailed'),
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
      <Droppable droppableId="DELETE_ZONE">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-64 h-24 border-2 border-dashed rounded-lg transition-all duration-200 overflow-hidden",
              snapshot.isDraggingOver
                ? "border-red-500 bg-red-100 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                : "border-red-300 bg-white",
              !isDragging && "opacity-0 pointer-events-none"
            )}
          >
            {provided.placeholder}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center space-y-2 text-red-500">
                <Trash2 className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  snapshot.isDraggingOver && "scale-125"
                )} />
                <span className="text-sm font-medium">{t('common.dragToDelete')}</span>
              </div>
            </div>
          </div>
        )}
      </Droppable>
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