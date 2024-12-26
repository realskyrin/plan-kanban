import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ProjectProvider } from '@/components/providers/project-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plan Kanban',
  description: '现代化的项目管理工具，专注于提供简单直观的看板式任务管理功能',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProjectProvider>
            {children}
          </ProjectProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
} 