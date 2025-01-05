'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { PageHeader } from "@/components/ui/page-header"

export default function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await login(email, password)
      const from = searchParams.get('from') || '/'
      router.push(from)
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageHeader showAuthProfile={false} />
      <div className="container relative flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
        <Card className="w-full max-w-[350px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t('login.login')}</CardTitle>
            <CardDescription className="text-center">
              {t('login.enter_your_email_and_password_to_login')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t('login.logging_in') : t('login.login')}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                {t('login.no_account')} {' '}
                <Link
                  href="/register"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t('login.register')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  )
}