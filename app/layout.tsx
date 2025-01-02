import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ProjectProvider } from '@/components/providers/project-provider'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { Toaster } from '@/components/ui/toaster'
import { PageHeader } from '@/components/ui/page-header'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const defaultLang = acceptLanguage.includes('zh') 
    ? acceptLanguage.includes('TW') ? 'zh-TW' : 'zh-CN'
    : 'en';

  // 根据语言加载对应的翻译文件
  const translations = await import(`@/public/locales/${defaultLang}.json`);

  return {
    title: translations.default.app.title,
    description: translations.default.app.description,
    manifest: '/manifest.json',
    icons: {
      apple: [
        { url: '/icons/icon-192x192.png' },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: translations.default.app.title,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 从请求头中获取语言
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const defaultLang = acceptLanguage.includes('zh') 
    ? acceptLanguage.includes('TW') ? 'zh-TW' : 'zh-CN'
    : 'en';

  return (
    <html lang={defaultLang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="default"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <ProjectProvider>
              <PageHeader />
              {children}
            </ProjectProvider>
          </I18nProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}