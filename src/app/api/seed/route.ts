import { NextResponse } from 'next/server'
import { simpleSeedDatabase } from '@/lib/simple-seed'

export async function POST() {
  try {
    const success = await simpleSeedDatabase()

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully'
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