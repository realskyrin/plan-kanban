import axios from "axios"
import type { Project, Board, Task } from "@/types"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

export async function getProjects() {
  const response = await api.get<Project[]>("/projects")
  return response.data
}

export async function getProject(id: string) {
  const response = await api.get<Project>(`/projects/${id}`)
  return response.data
}

export async function createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">) {
  const response = await api.post<Project>("/projects", {
    ...project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return response.data
}

export async function updateProject(
  id: string,
  project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>
) {
  const response = await api.patch<Project>(`/projects/${id}`, {
    ...project,
    updatedAt: new Date().toISOString(),
  })
  return response.data
}

export async function deleteProject(id: string) {
  // 首先获取与项目相关的所有任务
  const tasks = await api.get<Task[]>(`/tasks?projectId=${id}`)
  
  // 删除所有相关任务
  await Promise.all(
    tasks.data.map((task) => api.delete(`/tasks/${task.id}`))
  )
  
  // 最后删除项目本身
  await api.delete(`/projects/${id}`)
}

export async function getBoards(projectId: string) {
  const response = await api.get<Board[]>(`/boards?projectId=${projectId}`)
  return response.data
}

export async function getBoard(id: string) {
  const response = await api.get<Board>(`/boards/${id}`)
  return response.data
}

export async function getTasks(boardId: string) {
  const response = await api.get<Task[]>(`/tasks?boardId=${boardId}`)
  return response.data
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
  const response = await api.post<Task>("/tasks", {
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return response.data
}

export async function updateTask(
  id: string,
  task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
) {
  const response = await api.patch<Task>(`/tasks/${id}`, {
    ...task,
    updatedAt: new Date().toISOString(),
  })
  return response.data
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`)
} 