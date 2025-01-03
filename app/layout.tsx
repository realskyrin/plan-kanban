import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ProjectProvider } from '@/components/providers/project-provider'
import { ThemeProvider } from 'next-themes'
import { PageHeader } from '@/components/ui/page-header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plan Kanban',
  description: 'A simple kanban board for project management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <I18nProvider>
              <ProjectProvider>
                {/* <PageHeader /> */}
                {children}
                <Toaster />
              </ProjectProvider>
            </I18nProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}