import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const employers = await prisma.employer.findMany()

    // Format the employers for easy display
    const formattedEmployers = employers.map(employer => ({
      ...employer,
      displayName: employer.employerType === 'COMPANY'
        ? employer.companyName
        : employer.fullName || `${employer.firstName} ${employer.lastName}`,
      description: employer.employerType === 'COMPANY'
        ? `${employer.industry || 'Company'}${employer.city && employer.country ? ` • ${employer.city}, ${employer.country}` : ''}`
        : `${employer.profession || 'Individual'}${employer.city && employer.country ? ` • ${employer.city}, ${employer.country}` : ''}`
    }))

    return NextResponse.json({
      employers: formattedEmployers
    })

  } catch (error) {
    console.error('Error fetching employers list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employers' },
      { status: 500 }
    )
  }
}