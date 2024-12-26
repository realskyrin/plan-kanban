import axios from "axios"
import type { Project, Board, Task } from "@/types"

const api = axios.create({
  baseURL: "http://localhost:3001",
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