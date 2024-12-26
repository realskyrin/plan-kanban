"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
import { useToast } from "@/components/ui/use-toast"
import { createProject } from "@/lib/api"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "项目名称至少需要2个字符",
  }),
  description: z.string().optional(),
})

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createProject({
        name: values.name,
        description: values.description || "",
        status: "active",
      })
      toast({
        title: "成功",
        description: "项目创建成功",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "错误",
        description: "项目创建失败",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">新建项目</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                取消
              </Button>
              <Button type="submit">创建项目</Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
} 