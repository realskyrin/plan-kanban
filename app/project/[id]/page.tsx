"use client"

import { KanbanBoard } from "@/components/kanban/kanban-board"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useProject } from "@/components/providers/project-provider"
import { useEffect, useState } from "react"
import { Project } from "@/types"

interface PageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: PageProps) {
  const { projects } = useProject()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const currentProject = projects.find(p => p.id === params.id)
    setProject(currentProject || null)
  }, [params.id, projects])

  if (!project) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <ChevronLeft className="h-4 w-4" />
                <span>返回项目列表</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground">项目加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <ChevronLeft className="h-4 w-4" />
                <span>返回项目列表</span>
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>
      <KanbanBoard projectId={params.id} />
    </div>
  )
} 