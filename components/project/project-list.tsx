"use client"

import { ProjectCard } from "./project-card"
import { CreateProjectDialog } from "./create-project-dialog"

interface Project {
  id: string
  title: string
  description: string
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED"
  createdAt: string
  updatedAt: string
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
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdate={onUpdateProject}
            onDelete={onDeleteProject}
          />
        ))}
        <CreateProjectDialog>
          <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <span className="text-muted-foreground">新建项目</span>
          </div>
        </CreateProjectDialog>
      </div>
    </div>
  )
} 