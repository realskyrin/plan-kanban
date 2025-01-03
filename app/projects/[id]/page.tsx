"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: PageProps) {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/project/${params.id}`)
  }, [params.id, router])

  return null
} 