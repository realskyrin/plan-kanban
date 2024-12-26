"use client"

import { useEffect, useState } from "react"
import { ProjectCard } from "./project-card"
import { useToast } from "@/components/ui/use-toast"

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "archived"
  createdAt: string
  updatedAt: string
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  async function fetchProjects() {
    try {
      const response = await fetch("http://localhost:3001/projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      toast({
        title: "错误",
        description: "获取项目列表失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("删除失败")
      
      setProjects((prev) => prev.filter((project) => project.id !== projectId))
      toast({
        title: "成功",
        description: "项目已删除",
      })
    } catch (error) {
      toast({
        title: "错误",
        description: "删除项目失败",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (projectId: string, updatedData: Partial<Project>) => {
    try {
      const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) throw new Error("更新失败")

      const updatedProject = await response.json()
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? updatedProject : project
        )
      )
      toast({
        title: "成功",
        description: "项目已更新",
      })
    } catch (error) {
      toast({
        title: "错误",
        description: "更新项目失败",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[200px] rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold">还没有项目</h3>
        <p className="text-muted-foreground mt-2">
          点击右上角的"新建项目"按钮创建你的第一个项目
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
} 