"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ProjectCard } from "./project-card"
import { CreateProjectDialog } from "./create-project-dialog"
import { useTranslation } from 'react-i18next'
import { Project as PrismaProject } from '@prisma/client'
import { useAuth } from "@/components/providers/auth-provider"
import { getProjects } from "@/lib/api"

interface Project extends Omit<PrismaProject, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
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

interface ProjectListProps {
  projects?: Project[]
}

export function ProjectList({
  projects: initialProjects = [],
}: ProjectListProps): JSX.Element {
  const { t } = useTranslation()
  const { user } = useAuth() || {}
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects)
  const [isLoading, setIsLoading] = useState(false)
  const userId = user?.id
  const fetchingRef = useRef(false)

  const fetchProjects = useCallback(async () => {
    // 防止重复请求
    if (fetchingRef.current) return
    if (!userId) {
      setFilteredProjects([])
      return
    }

    try {
      fetchingRef.current = true
      setIsLoading(true)
      const data = await getProjects() as Project[]
      setFilteredProjects(
        data.filter(project => project.members.some(member => member.user.id === userId))
      )
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setFilteredProjects([])
    } finally {
      setIsLoading(false)
      fetchingRef.current = false
    }
  }, [userId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center text-muted-foreground">
            {t('common.loading')}...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            {t('common.noProjects')}
          </div>
        ) : (
          filteredProjects.map((project: Project) => (
            <ProjectCard
              key={project.id}
              project={{
                ...project,
                createdAt: new Date(project.createdAt),
                updatedAt: new Date(project.updatedAt)
              }}
            />
          ))
        )}
        <CreateProjectDialog>
          <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <span className="text-muted-foreground">{t('common.createProject')}</span>
          </div>
        </CreateProjectDialog>
      </div>
    </div>
  )
}
