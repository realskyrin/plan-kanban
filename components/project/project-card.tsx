"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useState } from "react"
import { EditProjectDialog } from "./edit-project-dialog"

interface Project {
  id: string
  title: string
  description: string
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED"
  createdAt: string
  updatedAt: string
}

interface ProjectCardProps {
  project: Project
  onDelete: (projectId: string) => Promise<void>
  onUpdate: (projectId: string, updatedData: Partial<Project>) => Promise<void>
}

export function ProjectCard({ project, onDelete, onUpdate }: ProjectCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const statusMap = {
    ACTIVE: { label: "进行中", className: "text-green-600" },
    COMPLETED: { label: "已完成", className: "text-blue-600" },
    ARCHIVED: { label: "已归档", className: "text-gray-600" },
  } as const

  const { label, className } = statusMap[project.status] || statusMap.ACTIVE

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Link
          href={`/project/${project.id}`}
          className="font-semibold hover:underline"
        >
          {project.title}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">打开菜单</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              编辑项目
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(project.id)}
            >
              删除项目
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || "暂无描述"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className={`text-sm ${className}`}>{label}</span>
        <span className="text-sm text-muted-foreground">
          更新于{" "}
          {formatDistanceToNow(new Date(project.updatedAt), {
            addSuffix: true,
            locale: zhCN,
          })}
        </span>
      </CardFooter>

      <EditProjectDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        project={project}
        onProjectUpdated={onUpdate}
      />
    </Card>
  )
} 