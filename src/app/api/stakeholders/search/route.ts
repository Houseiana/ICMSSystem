import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/stakeholders/search
 * Search stakeholders for family member selection
 * Query params:
 *   - q: search term (searches in first name, last name, email, phone)
 *   - limit: number of results to return (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json(
        { error: 'Search term must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Search stakeholders by name, email, or phone
    const stakeholders = await prisma.stakeholder.findMany({
      where: {
        OR: [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { middleName: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } },
          { nationalId: { contains: searchTerm, mode: 'insensitive' } },
          { passportNumber: { contains: searchTerm, mode: 'insensitive' } },
          { qidNumber: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        placeOfBirth: true,
        gender: true,
        nationality: true,
        occupation: true,
        employer: true,
        address: true,
        nationalId: true,
        passportNumber: true,
        qidNumber: true,
        bloodGroup: true,
        medicalConditions: true,
        allergies: true
      },
      take: limit,
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    })

    // Format response with full name for easier display
    const formattedStakeholders = stakeholders.map(s => ({
      ...s,
      fullName: `${s.firstName}${s.middleName ? ' ' + s.middleName : ''} ${s.lastName}`,
      displayInfo: `${s.firstName} ${s.lastName}${s.email ? ' - ' + s.email : ''}${s.phone ? ' - ' + s.phone : ''}`
    }))

    return NextResponse.json({
      stakeholders: formattedStakeholders,
      count: formattedStakeholders.length
    })

  } catch (error) {
    console.error('Error searching stakeholders:', error)
    return NextResponse.json(
      { error: 'Failed to search stakeholders' },
      { status: 500 }
    )
  }
}
