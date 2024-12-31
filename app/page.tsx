"use client"

import { ProjectList } from "@/components/project/project-list"
import { useProject } from "@/components/providers/project-provider"
import { PageHeader } from "@/components/ui/page-header"

export default function Home() {
  const { projects, isLoading, updateProject, deleteProject } = useProject()

  return (
    <main>
      <PageHeader title="PlanKanban" />
      <div className="container mx-auto py-6 pt-20">
        <ProjectList 
          projects={projects}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
        />
      </div>
    </main>
  )
} 