'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { AuthUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { toast } from '@/lib/toast'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const user = await response.json()
        setUser(user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      const user = await response.json()
      setUser(user)
      toast.success({ title: '登录成功' })
      router.push('/')
    } catch (error) {
      toast.error({ 
        title: error instanceof Error ? error.message : '登录失败'
      })
      throw error
    }
  }

  async function register(email: string, password: string, name: string) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }

      const user = await response.json()
      setUser(user)
      toast.success({ title: '注册成功' })
      router.push('/')
    } catch (error) {
      toast.error({ 
        title: error instanceof Error ? error.message : '注册失败'
      })
      throw error
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      toast.success({ title: '已退出登录' })
      router.push('/login')
    } catch (error) {
      toast.error({ 
        title: '退出登录失败'
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 