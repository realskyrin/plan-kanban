import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 不需要认证的路由
const publicRoutes = ['/login', '/register']

// API 路由
const authApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/me']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 允许公开路由和认证 API 路由
  if (publicRoutes.includes(pathname) || authApiRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // 检查认证状态
  const authToken = request.cookies.get('auth_token')

  // 如果未认证，重定向到登录页面
  if (!authToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路由，除了：
     * - _next (Next.js 系统文件)
     * - static (静态文件)
     * - favicon.ico (浏览器图标)
     */
    '/((?!_next/|static/|favicon.ico).*)',
  ],
} 