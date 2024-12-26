"use client"

import { Droppable } from "@hello-pangea/dnd"
import { KanbanTask } from "./kanban-task"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateTaskDialog } from "./create-task-dialog"
import { cn } from "@/lib/utils"

interface Task {
  id: number
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  projectId: string
  createdAt: string
  updatedAt: string
}

interface KanbanColumnProps {
  id: string
  title: string
  tasks: Task[]
  projectId: string
  onTaskUpdate: () => void
}

export function KanbanColumn({ id, title, tasks, projectId, onTaskUpdate }: KanbanColumnProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="flex flex-col rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">{title}</h3>
          <span className="text-muted-foreground">({tasks.length})</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-4 space-y-4 transition-colors min-h-[200px]",
              snapshot.isDraggingOver && "bg-muted/50 border-2 border-dashed border-primary/50 rounded-lg"
            )}
          >
            {tasks.map((task, index) => (
              <KanbanTask
                key={task.id}
                task={task}
                index={index}
                onUpdate={onTaskUpdate}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        status={id as Task["status"]}
        onTaskCreated={onTaskUpdate}
        projectId={projectId}
      />
    </div>
  )
} 