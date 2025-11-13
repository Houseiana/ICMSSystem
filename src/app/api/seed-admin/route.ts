import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'mo29qr85' }
    })

    if (!existingAdmin) {
      const hashedPassword = await hashPassword('theline')

      await prisma.admin.create({
        data: {
          username: 'mo29qr85',
          email: 'mo29qr85@icms.com',
          password: hashedPassword,
          role: 'HR',
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin seeded successfully'
    })
  } catch (error) {
    console.error('Seed admin error:', error)
    return NextResponse.json({
      error: 'Failed to seed admin'
    }, { status: 500 })
  }
}