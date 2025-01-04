export interface Project {
  id: string
  title: string
  description: string
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED"
  createdAt: string
  updatedAt: string
  ownerId: string
  owner: {
    id: string
    name: string
    email: string
  }
  members: {
    role: 'OWNER' | 'EDITOR' | 'VIEWER'
    user: {
      id: string
      name: string
      email: string
    }
  }[]
  _count: {
    tasks: number
  }
}

export interface Task {
  id: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  projectId: string
  status: string
  createdAt: string
  updatedAt: string
}

export type ProjectStatus = Project["status"]
export type TaskPriority = Task["priority"]