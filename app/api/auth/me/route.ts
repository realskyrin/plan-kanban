import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  
  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new NextResponse(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
} 