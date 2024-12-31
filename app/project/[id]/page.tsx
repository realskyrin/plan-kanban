"use client"

import { KanbanBoard } from "@/components/kanban/kanban-board"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useProject } from "@/components/providers/project-provider"
import { useEffect, useState } from "react"
import { Project } from "@/types"
import { PageHeader } from "@/components/ui/page-header"

interface PageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: PageProps) {
  const { projects } = useProject()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const currentProject = projects.find(p => String(p.id) === params.id)
    setProject(currentProject || null)
  }, [params.id, projects])

  if (!project) {
    return (
      <div className="flex-1">
        <PageHeader
          title="加载中..."
          showBack
        >
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </PageHeader>
        <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] pt-14">
          <p className="text-muted-foreground">项目加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <PageHeader title={project.title} showBack>
        <Button variant="ghost" size="icon" asChild className="h-9 w-9">
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>
      <div className="p-4 pt-[4.5rem] md:p-8 md:pt-[4.5rem]">
        <KanbanBoard projectId={params.id} />
      </div>
    </div>
  )
} 