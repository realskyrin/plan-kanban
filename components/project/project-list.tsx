"use client"

import { ProjectCard } from "./project-card"
import { CreateProjectDialog } from "./create-project-dialog"
import { useTranslation } from 'react-i18next'
import { Project as PrismaProject } from '@prisma/client'

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
  onUpdateProject: (id: string, data: Partial<Project>) => Promise<void>
  onDeleteProject: (id: string) => Promise<void>
}

export function ProjectList({ 
  projects = [], 
  onUpdateProject, 
  onDeleteProject 
}: ProjectListProps) {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={{
              ...project,
              createdAt: new Date(project.createdAt),
              updatedAt: new Date(project.updatedAt)
            }}
          />
        ))}
        <CreateProjectDialog>
          <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <span className="text-muted-foreground">{t('common.createProject')}</span>
          </div>
        </CreateProjectDialog>
      </div>
    </div>
  )
}
