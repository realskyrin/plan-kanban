'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">{t('error.error')}</h2>
      <p className="text-muted-foreground">{t('error.sorry_something_went_wrong')}</p>
      <Button
        onClick={() => reset()}
        variant="outline"
      >
        {t('error.retry')}
      </Button>
    </div>
  )
} 