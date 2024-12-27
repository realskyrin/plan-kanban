import axios from "axios"
import type { Project, Task } from "@/types"

const api = axios.create({
  baseURL: "/api",
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
  const response = await api.post<Project>("/projects", project)
  return response.data
}

export async function updateProject(
  id: string,
  project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>
) {
  const response = await api.patch<Project>(`/projects/${id}`, project)
  return response.data
}

export async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`)
}

export async function getTasks(projectId?: string, boardId?: string) {
  const params = new URLSearchParams()
  if (projectId) params.append("projectId", projectId)
  if (boardId) params.append("boardId", boardId)
  
  const response = await api.get<Task[]>(`/tasks?${params.toString()}`)
  return response.data
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
  const response = await api.post<Task>("/tasks", task)
  return response.data
}

export async function updateTask(
  id: string,
  task: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
) {
  const response = await api.patch<Task>(`/tasks/${id}`, task)
  return response.data
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`)
} 