import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Github } from "lucide-react"
import { useTheme } from "next-themes"

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
    <div className={cn("fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-6", className)}>
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="h-9 w-9"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">切换主题</span>
      </Button>
    </div>
  )
} 