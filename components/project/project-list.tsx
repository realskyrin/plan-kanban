"use client"

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from "@/components/providers/auth-provider"
import { useProject } from "@/components/providers/project-provider"
import { ProjectCard } from "./project-card"
import { CreateProjectDialog } from "./create-project-dialog"

export function ProjectList(): JSX.Element {
  const { t } = useTranslation()
  const { user } = useAuth() || {}
  const { projects, isLoading, refreshProjects } = useProject()
  const userId = user?.id
  const initialFetchRef = useRef(false)

  useEffect(() => {
    if (userId && !initialFetchRef.current) {
      initialFetchRef.current = true
      refreshProjects()
    }
  }, [userId, refreshProjects])

  const projectsArray = Array.isArray(projects) ? projects : []
  const filteredProjects = projectsArray.filter(project => 
    project.members?.some(member => member.user.id === userId)
  )

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
          filteredProjects.map((project) => (
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
        <CreateProjectDialog />
      </div>
    </div>
  )
}
