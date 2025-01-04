"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { Project } from "@/types"
import * as api from "@/lib/api"
import { toast } from "@/lib/toast"
import { useTranslation } from "react-i18next"

interface ProjectContextType {
  projects: Project[]
  isLoading: boolean
  refreshProjects: () => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  isOperationInProgress: (operation: string) => boolean
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function refreshProjects() {
    try {
      const data = await api.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
      toast.error({
        title: t('common.error'),
        description: t('common.getProjectListFailed'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateProject(id: string, data: Partial<Project>) {
    try {
      const updatedProject = await api.updateProject(id, data)
      if (!updatedProject) return // 如果操作已在进行中，直接返回
      
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? updatedProject : project
        )
      )
      toast.success({
        title: t('common.success'),
        description: t('common.projectUpdated'),
      })
    } catch (error) {
      toast.error({
        title: t('common.error'),
        description: t('common.updateProjectFailed'),
      })
      throw error
    }
  }

  async function deleteProject(id: string) {
    try {
      await api.deleteProject(id)
      setProjects((prev) => prev.filter((project) => project.id !== id))
      toast.success({
        title: t('common.success'),
        description: t('common.projectDeleted'),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error({
          title: t('common.error'),
          description: error.message,
        })
      } else {
        toast.error({
          title: t('common.error'),
          description: t('common.deleteProjectFailed'),
        })
      }
      throw error
    }
  }

  useEffect(() => {
    refreshProjects().catch((error) => {
      console.error('Failed to load projects:', error)
      toast.error({
        title: t('common.error'),
        description: t('common.initialProjectLoadFailed'),
      })
    })
  }, [t])

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        refreshProjects,
        updateProject,
        deleteProject,
        isOperationInProgress: api.isOperationInProgress,
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