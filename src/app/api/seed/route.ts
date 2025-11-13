import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed'

export async function POST() {
  try {
    const success = await seedDatabase()

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully with departments and positions including Senior Management Offices and Private House'
      })
    } else {
      return NextResponse.json({
        error: 'Failed to seed database'
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}