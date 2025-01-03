import { NextRequest, NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  removeAuthCookie()
  
  return new NextResponse(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
} 