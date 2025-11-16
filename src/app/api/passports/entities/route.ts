import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('type') // EMPLOYEE, EMPLOYER, STAKEHOLDER, or ALL

    let entities = []

    // Fetch employees
    if (!entityType || entityType === 'ALL' || entityType === 'EMPLOYEE') {
      const employees = await prisma.employee.findMany({
        select: {
          id: true,
          empId: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          nationality: true,
          passportNumber: true,
          status: true
        },
        where: {
          status: 'ACTIVE'
        },
        orderBy: { firstName: 'asc' }
      })

      const formattedEmployees = employees.map(emp => ({
        id: emp.id,
        type: 'EMPLOYEE',
        name: `${emp.firstName} ${emp.middleName ? emp.middleName + ' ' : ''}${emp.lastName}`,
        identifier: emp.empId,
        email: emp.email,
        nationality: emp.nationality,
        hasPassport: !!emp.passportNumber,
        status: emp.status
      }))

      entities.push(...formattedEmployees)
    }

    // Fetch employers
    if (!entityType || entityType === 'ALL' || entityType === 'EMPLOYER') {
      const employers = await prisma.employer.findMany({
        select: {
          id: true,
          employerType: true,
          companyName: true,
          firstName: true,
          middleName: true,
          lastName: true,
          fullName: true,
          primaryEmail: true,
          nationality: true,
          status: true
        },
        where: {
          status: 'ACTIVE'
        },
        orderBy: [
          { employerType: 'asc' },
          { companyName: 'asc' },
          { firstName: 'asc' }
        ]
      })

      const formattedEmployers = employers.map(emp => ({
        id: emp.id,
        type: 'EMPLOYER',
        name: emp.employerType === 'COMPANY'
          ? emp.companyName
          : emp.fullName || `${emp.firstName} ${emp.middleName ? emp.middleName + ' ' : ''}${emp.lastName}`,
        identifier: emp.employerType === 'COMPANY' ? `Company: ${emp.companyName}` : `Individual: ${emp.fullName}`,
        email: emp.primaryEmail,
        nationality: emp.nationality,
        hasPassport: false, // We'll check this separately
        status: emp.status,
        subType: emp.employerType
      }))

      entities.push(...formattedEmployers)
    }

    // Fetch stakeholders
    if (!entityType || entityType === 'ALL' || entityType === 'STAKEHOLDER') {
      const stakeholders = await prisma.stakeholder.findMany({
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          preferredName: true,
          email: true,
          nationality: true,
          passportNumber: true,
          occupation: true
        },
        orderBy: { firstName: 'asc' }
      })

      const formattedStakeholders = stakeholders.map(sh => ({
        id: sh.id,
        type: 'STAKEHOLDER',
        name: sh.preferredName || `${sh.firstName} ${sh.middleName ? sh.middleName + ' ' : ''}${sh.lastName}`,
        identifier: `${sh.occupation || 'Stakeholder'}: ${sh.firstName} ${sh.lastName}`,
        email: sh.email,
        nationality: sh.nationality,
        hasPassport: !!sh.passportNumber,
        status: 'ACTIVE' // Stakeholders don't have status field
      }))

      entities.push(...formattedStakeholders)
    }

    // Check for existing passports for each entity
    const entityIds = {
      EMPLOYEE: entities.filter(e => e.type === 'EMPLOYEE').map(e => e.id),
      EMPLOYER: entities.filter(e => e.type === 'EMPLOYER').map(e => e.id),
      STAKEHOLDER: entities.filter(e => e.type === 'STAKEHOLDER').map(e => e.id)
    }

    // Get existing passport counts
    const existingPassports = await prisma.passport.groupBy({
      by: ['ownerType', 'ownerId'],
      _count: {
        id: true
      },
      where: {
        OR: [
          { ownerType: 'EMPLOYEE', ownerId: { in: entityIds.EMPLOYEE } },
          { ownerType: 'EMPLOYER', ownerId: { in: entityIds.EMPLOYER } },
          { ownerType: 'STAKEHOLDER', ownerId: { in: entityIds.STAKEHOLDER } }
        ]
      }
    })

    // Map passport counts to entities
    const passportMap = new Map()
    existingPassports.forEach(p => {
      const key = `${p.ownerType}-${p.ownerId}`
      passportMap.set(key, p._count.id)
    })

    // Add passport count to entities
    entities.forEach((entity: any) => {
      const key = `${entity.type}-${entity.id}`
      entity.passportCount = passportMap.get(key) || 0
    })

    // Sort entities by type and name
    entities.sort((a: any, b: any) => {
      if (a.type !== b.type) {
        const typeOrder: Record<string, number> = { 'EMPLOYEE': 0, 'EMPLOYER': 1, 'STAKEHOLDER': 2 }
        return typeOrder[a.type] - typeOrder[b.type]
      }
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      entities,
      summary: {
        total: entities.length,
        employees: entities.filter(e => e.type === 'EMPLOYEE').length,
        employers: entities.filter(e => e.type === 'EMPLOYER').length,
        stakeholders: entities.filter(e => e.type === 'STAKEHOLDER').length,
        withPassports: entities.filter((e: any) => e.passportCount > 0).length
      }
    })

  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entities' },
      { status: 500 }
    )
  }
}