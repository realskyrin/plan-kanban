import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ProjectProvider } from '@/components/providers/project-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'Plan Kanban',
  description: '一个简单高效的看板任务管理工具',
  manifest: '/manifest.json',
  icons: {
    apple: [
      { url: '/icons/icon-192x192.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Plan Kanban',
  },
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
          defaultTheme="default"
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