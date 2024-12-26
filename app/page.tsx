import { ProjectList } from "@/components/project/project-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">我的项目</h1>
          <p className="text-muted-foreground mt-1">
            管理和组织你的所有项目
          </p>
        </div>
        <Link href="/project/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建项目
          </Button>
        </Link>
      </div>
      <ProjectList />
    </main>
  )
} 