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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { enUS, zhCN, zhTW } from "date-fns/locale"
import { useState } from "react"
import { EditProjectDialog } from "./edit-project-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const { toast } = useToast()
  const { t, i18n } = useTranslation()

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'zh':
      case 'zh-CN':
        return zhCN
      case 'zh-TW':
        return zhTW
      default:
        return enUS
    }
  }

  const statusMap = {
    ACTIVE: { label: t('common.inProgress'), className: "text-green-600" },
    COMPLETED: { label: t('common.completed'), className: "text-blue-600" },
    ARCHIVED: { label: t('common.archived'), className: "text-gray-600" },
  } as const

  const { label, className } = statusMap[project.status] || statusMap.ACTIVE

  const handleDelete = async () => {
    if (deleteConfirmation !== project.title) {
      toast({
        variant: "destructive",
        title: t('common.projectNameMismatch'),
        description: t('common.pleaseEnterCorrectProjectNameToConfirmDelete'),
      })
      return
    }

    await onDelete(project.id)
    setIsDeleteDialogOpen(false)
    setDeleteConfirmation("")
  }

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Link href={`/project/${project.id}`} className="block">
      <Card className="transition-shadow hover:shadow-md border border-gray-600/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="font-semibold">{project.title}</span>
          <div onClick={stopPropagation}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t('common.openMenu')}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  {t('common.editProject')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  {t('common.deleteProject')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || t('common.noDescription')}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <span className={`text-sm ${className}`}>{label}</span>
          <span className="text-sm text-muted-foreground">
            {t('common.updatedAt')} {" "}
            {formatDistanceToNow(new Date(project.updatedAt), {
              addSuffix: true,
              locale: getDateLocale(),
            })}
          </span>
        </CardFooter>
      </Card>

      <div onClick={stopPropagation}>
        <EditProjectDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          project={project}
          onProjectUpdated={onUpdate}
        />

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('common.deleteProject')}</DialogTitle>
              <DialogDescription>
                {t('common.thisOperationCannotBeUndone')}
                {t('common.pleaseEnterProjectName')} <span className="font-semibold text-red-500">{project.title}</span> {t('common.toConfirmDelete')}
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder={t('common.enterProjectName')}
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                {t('common.deleteProject')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Link>
  )
}