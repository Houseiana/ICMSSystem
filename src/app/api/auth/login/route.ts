import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Check database connection and provide helpful error
    let admin
    try {
      admin = await prisma.admin.findFirst({
        where: {
          OR: [
            { username },
            { email: username }
          ],
          isActive: true
        }
      })
    } catch (dbError) {
      console.error('Database connection error:', dbError)

      // For demo purposes, use hardcoded admin when database is not available
      if (username === 'mo29qr85' && password === 'theline') {
        const token = generateToken({
          adminId: 1,
          username: 'mo29qr85',
          email: 'mo29qr85@icms.com'
        })

        const response = NextResponse.json({
          success: true,
          admin: {
            id: 1,
            username: 'mo29qr85',
            email: 'mo29qr85@icms.com',
            role: 'HR'
          }
        })

        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60
        })

        return response
      }

      return NextResponse.json(
        {
          error: 'Database connection failed. Please check DATABASE_URL environment variable.',
          details: 'The application needs a PostgreSQL database connection to work properly.'
        },
        { status: 503 }
      )
    }

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken({
      adminId: admin.id,
      username: admin.username,
      email: admin.email
    })

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}