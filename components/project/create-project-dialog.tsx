"use client"

import { useRouter } from "next/navigation"
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

const formSchema = z.object({
  title: z.string().min(2, {
    message: "项目名称至少需要2个字符",
  }),
  description: z.string().optional(),
})

export function CreateProjectDialog() {
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
      })
      toast.success({
        title: "成功",
        description: "项目创建成功",
      })
      form.reset()
      setOpen(false)
      refreshProjects()
    } catch (error) {
      toast.error({
        title: "错误",
        description: "项目创建失败",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新建项目
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新建项目</DialogTitle>
          <DialogDescription>
            创建一个新的项目来组织和管理你的任务
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>项目名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入项目名称" {...field} />
                  </FormControl>
                  <FormDescription>
                    一个简短而有描述性的名称
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
                  <FormLabel>项目描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="输入项目描述"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    详细描述项目的目标和范围
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type="submit">创建项目</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 