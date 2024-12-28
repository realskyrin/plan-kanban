export interface Project {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "archived"
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  projectId: string
  status: string
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = Project["status"]
export type TaskPriority = Task["priority"]