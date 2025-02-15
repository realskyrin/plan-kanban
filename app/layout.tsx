import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ProjectProvider } from '@/components/providers/project-provider'
import { ThemeProvider } from 'next-themes'

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
          themes={['light', 'dark', 'default']}
          forcedTheme={undefined}
          storageKey="theme"
        >
          <AuthProvider>
            <I18nProvider>
              <ProjectProvider>
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