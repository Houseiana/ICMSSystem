import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check for regular admin auth token (full access)
    const authToken = request.cookies.get('auth-token')?.value
    if (authToken) {
      const decoded = verifyToken(authToken)
      if (decoded) {
        return NextResponse.json({
          authenticated: true,
          user: {
            username: decoded.username,
            email: decoded.email,
            role: decoded.role || 'ADMIN',
            accessLevel: 'full' // Admin has full access
          }
        })
      }
    }

    // Check for finance-specific auth token (finance only)
    const financeToken = request.cookies.get('finance-auth-token')?.value
    if (financeToken) {
      const decoded = verifyToken(financeToken)
      if (decoded) {
        return NextResponse.json({
          authenticated: true,
          user: {
            username: decoded.username,
            email: decoded.email,
            role: 'FINANCE_MANAGER',
            accessLevel: 'finance' // Finance manager only has finance access
          }
        })
      }
    }

    return NextResponse.json({
      authenticated: false,
      user: null
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({
      authenticated: false,
      user: null
    })
  }
}
