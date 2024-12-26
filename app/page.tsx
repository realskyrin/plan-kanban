"use client"

import { ProjectList } from "@/components/project/project-list"
import { useProject } from "@/components/providers/project-provider"

export default function Home() {
  const { projects, isLoading, updateProject, deleteProject } = useProject()

  return (
    <main className="container mx-auto py-6">
      <ProjectList 
        projects={projects}
        onUpdateProject={updateProject}
        onDeleteProject={deleteProject}
      />
    </main>
  )
} 