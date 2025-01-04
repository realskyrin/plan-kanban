"use client"

import { KanbanBoard } from "@/components/kanban/kanban-board"
import { Button } from "@/components/ui/button"
import { ChevronLeft, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { useProject } from "@/components/providers/project-provider"
import { useEffect, useState } from "react"
import { Project } from "@/types"
import { PageHeader } from "@/components/ui/page-header"
import { useSearchParams } from "next/navigation"
import { useTranslation } from 'react-i18next'

interface PageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: PageProps) {
  const { t } = useTranslation()
  const { projects, refreshProjects } = useProject()
  const searchParams = useSearchParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true)
      setError(null)

      try {
        if (!projects || !Array.isArray(projects)) {
          // 如果 projects 为空，尝试重新获取
          await refreshProjects()
          return
        }
        
        const currentProject = projects.find(project => 
          project && project.id && project.id.toString() === params.id
        )

        if (!currentProject) {
          setError(t('project.project_not_found'))
          setProject(null)
          return
        }

        // 如果 URL 中包含项目标题，使用它更新当前项目
        const urlTitle = searchParams.get('title')
        if (urlTitle) {
          currentProject.title = urlTitle
        }

        setProject(currentProject)
        setError(null)
      } catch (error) {
        console.error('Failed to load project:', error)
        setError(t('project.project_data_loading_failed'))
        setProject(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params.id, projects, searchParams, refreshProjects, retryCount])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex-1">
        <PageHeader
          title={t('project.loading')}
          showBack
        >
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </PageHeader>
        <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] pt-14">
          <p className="text-muted-foreground">{t('project.project_loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1">
        <PageHeader
          title={t('project.error')}
          showBack
        >
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </PageHeader>
        <div className="flex flex-col items-center justify-center gap-4 h-[calc(100vh-3.5rem)] pt-14">
          <p className="text-muted-foreground">{error}</p>
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            {t('project.retry')}
          </Button>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex-1">
        <PageHeader
          title={t('project.project_not_found')}
          showBack
        >
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </PageHeader>
        <div className="flex flex-col items-center justify-center gap-4 h-[calc(100vh-3.5rem)] pt-14">
          <p className="text-muted-foreground">{t('project.project_not_found')}</p>
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            {t('project.retry')}
          </Button>
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