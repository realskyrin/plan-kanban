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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">我的项目</h2>
        <CreateProjectDialog />
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">还没有项目，点击右上角按钮创建新项目</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onUpdate={onUpdateProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  )
} 