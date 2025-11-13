import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check database connectivity first
    try {
      await prisma.$connect()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      // Return hardcoded departments as fallback
      return NextResponse.json([
        { id: 1, name: 'Human Resources', code: 'HR', description: 'Human Resources Department' },
        { id: 2, name: 'Information Technology', code: 'IT', description: 'IT Department' },
        { id: 3, name: 'Finance', code: 'FIN', description: 'Finance Department' },
        { id: 4, name: 'Marketing', code: 'MKT', description: 'Marketing Department' },
        { id: 5, name: 'Sales', code: 'SALES', description: 'Sales Department' },
        { id: 6, name: 'Operations', code: 'OPS', description: 'Operations Department' },
        { id: 7, name: 'Senior Management Offices', code: 'SMO', description: 'Senior Management Offices Department' },
        { id: 8, name: 'Private House', code: 'PH', description: 'Private House Department' }
      ])
    }

    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    // Return hardcoded departments as fallback
    return NextResponse.json([
      { id: 1, name: 'Human Resources', code: 'HR', description: 'Human Resources Department' },
      { id: 2, name: 'Information Technology', code: 'IT', description: 'IT Department' },
      { id: 3, name: 'Finance', code: 'FIN', description: 'Finance Department' },
      { id: 4, name: 'Marketing', code: 'MKT', description: 'Marketing Department' },
      { id: 5, name: 'Sales', code: 'SALES', description: 'Sales Department' },
      { id: 6, name: 'Operations', code: 'OPS', description: 'Operations Department' },
      { id: 7, name: 'Senior Management Offices', code: 'SMO', description: 'Senior Management Offices Department' },
      { id: 8, name: 'Private House', code: 'PH', description: 'Private House Department' }
    ])
  }
}