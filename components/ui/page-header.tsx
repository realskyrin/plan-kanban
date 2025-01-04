"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Github, Monitor, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useAuth } from "@/components/providers/auth-provider"
import AvatarCircles from "@/components/ui/avatar-circles"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PageHeaderProps {
  title?: string
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
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b border-gray-600/60 bg-background px-4 md:px-8", className)}>
      {showBack && children}
      {title && <h1 className="text-lg font-medium">{t(title)}</h1>}
      <div className="flex-1" />
      <LanguageSwitcher />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => window.open('https://github.com/realskyrin/plan-kanban', '_blank')}
        className="h-9 w-9"
      >
        <Github className="h-4 w-4" />
        <span className="sr-only">{t('common.github')}</span>
      </Button>
      <ThemeToggle />
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <AvatarCircles
                avatars={[{ name: user.name }]}
                size={32}
                className="space-x-0"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('common.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <Monitor className="absolute h-4 w-4 rotate-90 scale-0 transition-all default:rotate-0 default:scale-100" />
          <span className="sr-only">{t('common.toggleTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t('common.themeLight')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t('common.themeDark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("default")}>
          {t('common.themeDefault')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
