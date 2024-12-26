export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "archived"
  createdAt: string
  updatedAt: string
}

export interface Board {
  id: string
  projectId: string
  name: string
  columns: Column[]
}

export interface Column {
  id: string
  name: string
  wipLimit: number | null
}

export interface Task {
  id: string
  boardId: string
  columnId: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = Project["status"]
export type TaskPriority = Task["priority"] 