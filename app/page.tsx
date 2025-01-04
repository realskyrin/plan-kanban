"use client"

import { ProjectList } from "@/components/project/project-list"
import { PageHeader } from "@/components/ui/page-header"
import { useTranslation } from "react-i18next"

export default function Home() {
  const { t } = useTranslation()

  return (
    <main>
      <PageHeader title={t('app.title')} />
      <div className="p-4 pt-[4.5rem] md:p-8 md:pt-[4.5rem]">
        <ProjectList/>
      </div>
    </main>
  )
} 
