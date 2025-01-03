import axios from "axios"
import type { Project, Task } from "@/types"

const api = axios.create({
  baseURL: "/api",
})

// 操作状态管理
interface OperationState {
  [key: string]: boolean
}

const operationStates: OperationState = {
  createProject: false,
  updateProject: false,
  deleteProject: false,
  createTask: false,
  updateTask: false,
  deleteTask: false,
}

function isOperationInProgress(operation: keyof typeof operationStates): boolean {
  return operationStates[operation]
}

function setOperationState(operation: keyof typeof operationStates, inProgress: boolean) {
  operationStates[operation] = inProgress
}

export async function getProjects() {
  const response = await api.get<Project[]>("/projects")
  return response.data
}

export async function getProject(id: string) {
  const response = await api.get<Project>(`/projects/${id}`)
  return response.data
}

export async function createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">) {
  if (isOperationInProgress('createProject')) {
    console.warn('Create project operation is already in progress')
    return
  }

  try {
    setOperationState('createProject', true)
    const response = await api.post<Project>("/projects", project)
    return response.data
  } finally {
    setTimeout(() => {
      setOperationState('createProject', false)
    }, 100)
  }
}

export async function updateProject(
  id: string,
  project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>
) {
  if (isOperationInProgress('updateProject')) {
    console.warn('Update project operation is already in progress')
    return
  }

  try {
    setOperationState('updateProject', true)
    const response = await api.patch<Project>(`/projects/${id}`, project)
    return response.data
  } finally {
    setTimeout(() => {
      setOperationState('updateProject', false)
    }, 100)
  }
}

export async function deleteProject(id: string) {
  if (isOperationInProgress('deleteProject')) {
    console.warn('Delete project operation is already in progress')
    return
  }

  try {
    setOperationState('deleteProject', true)
    await api.delete(`/projects/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error('您没有权限删除此项目')
    }
    throw error
  } finally {
    setTimeout(() => {
      setOperationState('deleteProject', false)
    }, 100)
  }
}

export async function getTasks(projectId?: string) {
  const params = new URLSearchParams()
  if (projectId) params.append("projectId", projectId)
  
  const response = await api.get<Task[]>(`/tasks?${params.toString()}`)
  return response.data
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
  if (isOperationInProgress('createTask')) {
    console.warn('Create task operation is already in progress')
    return
  }

  try {
    setOperationState('createTask', true)
    const response = await api.post<Task>("/tasks", task)
    return response.data
  } finally {
    setTimeout(() => {
      setOperationState('createTask', false)
    }, 100)
  }
}

export async function updateTask(
  id: string,
  task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
) {
  if (isOperationInProgress('updateTask')) {
    console.warn('Update task operation is already in progress')
    return
  }

  try {
    setOperationState('updateTask', true)
    const response = await api.patch<Task>(`/tasks/${id}`, task)
    return response.data
  } finally {
    setTimeout(() => {
      setOperationState('updateTask', false)
    }, 100)
  }
}

export async function deleteTask(id: string) {
  if (isOperationInProgress('deleteTask')) {
    console.warn('Delete task operation is already in progress')
    return
  }

  try {
    setOperationState('deleteTask', true)
    await api.delete(`/tasks/${id}`)
  } finally {
    setTimeout(() => {
      setOperationState('deleteTask', false)
    }, 100)
  }
}

// 导出状态检查函数
export { isOperationInProgress } 