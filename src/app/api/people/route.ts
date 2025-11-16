import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'employees', 'stakeholders', or 'all'
    const search = searchParams.get('search')

    let employees: any[] = []
    let stakeholders: any[] = []

    // Fetch employees if requested
    if (type === 'employees' || type === 'all' || !type) {
      const employeeWhere: any = {
        status: 'ACTIVE'
      }

      if (search) {
        employeeWhere.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }

      employees = await prisma.employee.findMany({
        where: employeeWhere,
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          fullName: true,
          email: true,
          nationality: true,
          department: true,
          position: true
        },
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' }
        ]
      })
    }

    // Fetch stakeholders if requested
    if (type === 'stakeholders' || type === 'all' || !type) {
      const stakeholderWhere: any = {}

      if (search) {
        stakeholderWhere.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }

      stakeholders = await prisma.stakeholder.findMany({
        where: stakeholderWhere,
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          nationality: true,
          occupation: true,
          employer: true
        },
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' }
        ]
      })
    }

    // Format response based on request type
    if (type === 'employees') {
      return NextResponse.json({
        employees: employees.map(emp => ({
          ...emp,
          type: 'EMPLOYEE',
          fullName: emp.fullName || `${emp.firstName} ${emp.lastName}`.trim()
        }))
      })
    }

    if (type === 'stakeholders') {
      return NextResponse.json({
        stakeholders: stakeholders.map(stake => ({
          ...stake,
          type: 'STAKEHOLDER',
          fullName: `${stake.firstName} ${stake.lastName}`.trim()
        }))
      })
    }

    // Return both if type is 'all' or not specified
    return NextResponse.json({
      employees: employees.map(emp => ({
        ...emp,
        type: 'EMPLOYEE',
        fullName: emp.fullName || `${emp.firstName} ${emp.lastName}`.trim()
      })),
      stakeholders: stakeholders.map(stake => ({
        ...stake,
        type: 'STAKEHOLDER',
        fullName: `${stake.firstName} ${stake.lastName}`.trim()
      })),
      all: [
        ...employees.map(emp => ({
          ...emp,
          type: 'EMPLOYEE',
          fullName: emp.fullName || `${emp.firstName} ${emp.lastName}`.trim()
        })),
        ...stakeholders.map(stake => ({
          ...stake,
          type: 'STAKEHOLDER',
          fullName: `${stake.firstName} ${stake.lastName}`.trim()
        }))
      ].sort((a, b) => a.fullName.localeCompare(b.fullName))
    })

  } catch (error) {
    console.error('Error fetching people:', error)
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 }
    )
  }
}