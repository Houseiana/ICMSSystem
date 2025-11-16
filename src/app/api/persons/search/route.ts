import { NextRequest, NextResponse } from 'next/server'
import { searchPersons } from '@/lib/utils/personHelper'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/persons/search
 * Search for persons across all entity types (Employee, Stakeholder, Employer, TaskHelper)
 * Query params:
 *   - q: search term (minimum 2 characters)
 *   - type: filter by person type (EMPLOYEE, EMPLOYER, STAKEHOLDER, TASK_HELPER)
 *   - limit: number of results per entity type (default: 10)
 *
 * Example: /api/persons/search?q=john&type=EMPLOYEE&limit=5
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('q') || ''
    const personType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search term must be at least 2 characters'
        },
        { status: 400 }
      )
    }

    // If personType is specified, search only that type
    if (personType) {
      let results: any[] = []

      switch (personType) {
        case 'EMPLOYEE': {
          const employees = await prisma.employee.findMany({
            where: {
              OR: [
                { fullName: { contains: searchTerm, mode: 'insensitive' } },
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { phone: { contains: searchTerm, mode: 'insensitive' } }
              ]
            },
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              nationality: true
            },
            take: limit
          })

          results = employees.map(emp => ({
            id: emp.id,
            fullName: emp.fullName,
            email: emp.email,
            phone: emp.phone,
            nationality: emp.nationality,
            type: 'EMPLOYEE'
          }))
          break
        }

        case 'EMPLOYER': {
          const employers = await prisma.employer.findMany({
            where: {
              OR: [
                { companyName: { contains: searchTerm, mode: 'insensitive' } },
                { fullName: { contains: searchTerm, mode: 'insensitive' } },
                { primaryEmail: { contains: searchTerm, mode: 'insensitive' } },
                { secondaryEmail: { contains: searchTerm, mode: 'insensitive' } },
                { mainPhone: { contains: searchTerm, mode: 'insensitive' } },
                { alternatePhone: { contains: searchTerm, mode: 'insensitive' } }
              ]
            },
            select: {
              id: true,
              companyName: true,
              fullName: true,
              primaryEmail: true,
              secondaryEmail: true,
              mainPhone: true,
              alternatePhone: true,
              nationality: true
            },
            take: limit
          })

          results = employers.map(emp => ({
            id: emp.id,
            fullName: emp.companyName || emp.fullName || 'Unknown',
            email: emp.primaryEmail || emp.secondaryEmail,
            phone: emp.mainPhone || emp.alternatePhone,
            nationality: emp.nationality,
            type: 'EMPLOYER'
          }))
          break
        }

        case 'STAKEHOLDER': {
          const stakeholders = await prisma.stakeholder.findMany({
            where: {
              OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { middleName: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { phone: { contains: searchTerm, mode: 'insensitive' } }
              ]
            },
            select: {
              id: true,
              firstName: true,
              middleName: true,
              lastName: true,
              email: true,
              phone: true,
              nationality: true
            },
            take: limit
          })

          results = stakeholders.map(sh => ({
            id: sh.id,
            fullName: `${sh.firstName}${sh.middleName ? ' ' + sh.middleName : ''} ${sh.lastName}`,
            email: sh.email,
            phone: sh.phone,
            nationality: sh.nationality,
            type: 'STAKEHOLDER'
          }))
          break
        }

        case 'TASK_HELPER': {
          const taskHelpers = await prisma.taskHelper.findMany({
            where: {
              OR: [
                { fullName: { contains: searchTerm, mode: 'insensitive' } },
                { primaryEmail: { contains: searchTerm, mode: 'insensitive' } },
                { primaryPhone: { contains: searchTerm, mode: 'insensitive' } }
              ]
            },
            select: {
              id: true,
              fullName: true,
              primaryEmail: true,
              primaryPhone: true,
              nationality: true
            },
            take: limit
          })

          results = taskHelpers.map(th => ({
            id: th.id,
            fullName: th.fullName,
            email: th.primaryEmail,
            phone: th.primaryPhone,
            nationality: th.nationality,
            type: 'TASK_HELPER'
          }))
          break
        }

        default:
          return NextResponse.json(
            {
              success: false,
              error: 'Invalid person type. Must be EMPLOYEE, EMPLOYER, STAKEHOLDER, or TASK_HELPER'
            },
            { status: 400 }
          )
      }

      return NextResponse.json({
        success: true,
        data: results,
        count: results.length
      })
    }

    // Search all person types
    const results = await searchPersons(searchTerm, limit)

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length
    })

  } catch (error) {
    console.error('Error searching persons:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search persons'
      },
      { status: 500 }
    )
  }
}
