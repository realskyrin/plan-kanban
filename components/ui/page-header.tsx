"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Github, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PageHeaderProps {
  title: string
  className?: string
  children?: React.ReactNode
  showBack?: boolean
}

export function PageHeader({
  title,
  className,
  children,
  showBack,
}: PageHeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-8", className)}>
      {showBack && children}
      <h1 className="text-lg font-medium">{title}</h1>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => window.open('https://github.com/realskyrin/plan-kanban', '_blank')}
        className="h-9 w-9"
      >
        <Github className="h-4 w-4" />
        <span className="sr-only">GitHub 仓库</span>
      </Button>
      <ThemeToggle />
    </div>
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <Monitor className="absolute h-4 w-4 rotate-90 scale-0 transition-all default:rotate-0 default:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("default")}>
          暗淡
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
