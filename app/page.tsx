"use client"

import { ProjectList } from "@/components/project/project-list"
import { useProject } from "@/components/providers/project-provider"
import { PageHeader } from "@/components/ui/page-header"
import { useTranslation } from "react-i18next"

export default function Home() {
  const { t } = useTranslation()
  const { projects, isLoading, updateProject, deleteProject } = useProject()

  return (
    <main>
      <PageHeader title={t('app.title')} />
      <div className="p-4 pt-[4.5rem] md:p-8 md:pt-[4.5rem]">
        <ProjectList 
          projects={projects}
          onUpdateProject={updateProject}
          onDeleteProject={deleteProject}
        />
      </div>
    </main>
  )
} 