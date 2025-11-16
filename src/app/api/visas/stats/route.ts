import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Get all active visas
    const visas = await prisma.visa.findMany({
      where: {
        isActive: true
      },
      select: {
        destinationCountry: true,
        visaStatus: true
      }
    })

    // Define the countries
    const countries = ['UK', 'SCHENGEN', 'KSA', 'USA', 'TURKEY']

    // Calculate statistics for each country
    const stats: Record<string, any> = {}

    countries.forEach(country => {
      const countryVisas = visas.filter(v => v.destinationCountry === country)

      stats[country] = {
        total: countryVisas.length,
        hasVisa: countryVisas.filter(v => v.visaStatus === 'HAS_VISA').length,
        needsVisa: countryVisas.filter(v => v.visaStatus === 'NEEDS_VISA').length,
        noVisa: countryVisas.filter(v => v.visaStatus === 'NO_VISA').length,
        underProcess: countryVisas.filter(v => v.visaStatus === 'UNDER_PROCESS').length
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching visa statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visa statistics' },
      { status: 500 }
    )
  }
}
