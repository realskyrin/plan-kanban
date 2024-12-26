import { KanbanBoard } from "@/components/kanban/kanban-board"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
  }
}

async function getProject(id: string) {
  const res = await fetch(`http://localhost:3001/projects/${id}`)
  if (!res.ok) throw new Error('Failed to fetch project')
  return res.json()
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await getProject(params.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
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