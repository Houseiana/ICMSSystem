import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Finance Manager credentials
    if (username === 'mohamed' && password === 'husain') {
      const token = generateToken({
        adminId: 999,
        username: 'mohamed',
        email: 'mohamed@finance.com',
        role: 'FINANCE_MANAGER'
      })

      const response = NextResponse.json({
        success: true,
        user: {
          id: 999,
          username: 'mohamed',
          email: 'mohamed@finance.com',
          role: 'FINANCE_MANAGER'
        }
      })

      // Set finance-specific auth token
      response.cookies.set('finance-auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Finance login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
