"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { Project } from "@/types"
import * as api from "@/lib/api"
import { toast } from "@/lib/toast"

interface ProjectContextType {
  projects: Project[]
  isLoading: boolean
  refreshProjects: () => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function refreshProjects() {
    try {
      const data = await api.getProjects()
      setProjects(data)
    } catch (error) {
      toast.error({
        title: "错误",
        description: "获取项目列表失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateProject(id: string, data: Partial<Project>) {
    try {
      const updatedProject = await api.updateProject(id, data)
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? updatedProject : project
        )
      )
      toast.success({
        title: "成功",
        description: "项目已更新",
      })
    } catch (error) {
      toast.error({
        title: "错误",
        description: "更新项目失败",
      })
      throw error
    }
  }

  async function deleteProject(id: string) {
    try {
      await api.deleteProject(id)
      setProjects((prev) => prev.filter((project) => project.id !== id))
      toast.success({
        title: "成功",
        description: "项目已删除",
      })
    } catch (error) {
      toast.error({
        title: "错误",
        description: "删除项目失败",
      })
      throw error
    }
  }

  useEffect(() => {
    refreshProjects()
  }, [])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        refreshProjects,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
} 