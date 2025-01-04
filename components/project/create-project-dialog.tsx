"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"
import { createProject } from "@/lib/api"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useProject } from "@/components/providers/project-provider"
import { useTranslation } from "react-i18next"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "项目名称至少需要2个字符",
  }),
  description: z.string().optional(),
})

interface CreateProjectDialogProps {
  children?: React.ReactNode
}

export function CreateProjectDialog({ }: CreateProjectDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { refreshProjects } = useProject()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createProject({
        title: values.title,
        description: values.description || "",
        status: "ACTIVE",
        ownerId: "",
        owner: {
          id: "",
          name: "",
          email: ""
        },
        members: [],
        _count: {
          tasks: 0
        }
      })
      toast.success({
        title: t('common.success'),
        description: t('common.projectCreated'),
      })
      form.reset()
      setOpen(false)
      refreshProjects()
    } catch (error) {
      console.error(error)
      toast.error({
        title: t('common.error'),
        description: t('common.projectCreationFailed'),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          <span>{t('common.createProject')}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('common.createProject')}</DialogTitle>
          <DialogDescription>
            {t('common.createProjectDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.projectName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('common.enterProjectName')} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('common.aShortAndDescriptiveName')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.projectDescription')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('common.enterProjectDescription')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('common.detailedDescriptionOfProjectObjectivesAndScope')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.createProject')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 