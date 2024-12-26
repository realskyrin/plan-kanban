"use client"

import { ProjectCard } from "./project-card"
import { useProject } from "@/components/providers/project-provider"

export function ProjectList() {
  const { projects, isLoading, updateProject, deleteProject } = useProject()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[200px] rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold">还没有项目</h3>
        <p className="text-muted-foreground mt-2">
          点击右上角的"新建项目"按钮创建你的第一个项目
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onDelete={deleteProject}
          onUpdate={updateProject}
        />
      ))}
    </div>
  )
} 