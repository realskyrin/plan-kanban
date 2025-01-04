'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
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

export default function RegisterPage() {
  const { t } = useTranslation()
  const { register } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('register.email') as string
    const password = formData.get('register.password') as string
    const name = formData.get('register.name') as string

    try {
      await register(email, password, name)
      router.push('/')
    } catch (error) {
      // 错误已在 AuthProvider 中处理
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
      <Card className="w-full max-w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{t('register.register')}</CardTitle>
          <CardDescription className="text-center">
            {t('register.create_your_account')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('register.email')}</Label>
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
              <Label htmlFor="name">{t('register.name')}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('register.password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
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
              {isLoading ? t('register.registering') : t('register.register')}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              {t('register.have_an_account')} {' '}
              <Link
                href="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                {t('register.login')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 