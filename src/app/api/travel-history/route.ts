import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visaId = searchParams.get('visaId')
    const tripStatus = searchParams.get('tripStatus')

    const where: any = {}

    if (visaId) {
      where.visaId = parseInt(visaId)
    }

    if (tripStatus) {
      where.tripStatus = tripStatus
    }

    const travelHistory = await prisma.travelHistory.findMany({
      where,
      orderBy: [
        { departureDate: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        visa: {
          select: {
            id: true,
            destinationCountry: true,
            countryIcon: true,
            personName: true,
            visaNumber: true
          }
        }
      }
    })

    return NextResponse.json(travelHistory)
  } catch (error) {
    console.error('Error fetching travel history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch travel history' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      visaId,
      tripPurpose,
      tripType,
      departureDate,
      arrivalDate,
      returnDate,
      departureCity,
      arrivalCity,
      transportMode,
      flightNumber,
      accommodationType,
      accommodationName,
      accommodationAddress,
      tripStatus,
      entryPoint,
      exitPoint,
      entryStamp,
      exitStamp,
      plannedDuration,
      actualDuration,
      stayWithinLimits,
      reportedToAuthorities,
      travelingAlone,
      companions,
      estimatedCost,
      actualCost,
      currency,
      fundingSource,
      documents,
      insuranceDetails,
      emergencyContactLocal,
      emergencyContactHome,
      vaccinationsRequired,
      healthDeclaration,
      quarantineRequired,
      quarantineDuration,
      immigrationIssues,
      immigrationNotes,
      customsIssues,
      customsNotes,
      returnReason,
      extendedStay,
      extensionDetails,
      tripNotes,
      lessonsLearned,
      wouldRecommend,
      overallRating,
      createdBy
    } = body

    if (!visaId) {
      return NextResponse.json(
        { error: 'Visa ID is required' },
        { status: 400 }
      )
    }

    // Check if visa exists
    const visa = await prisma.visa.findUnique({
      where: { id: parseInt(visaId) }
    })

    if (!visa) {
      return NextResponse.json(
        { error: 'Visa not found' },
        { status: 404 }
      )
    }

    const travelHistory = await prisma.travelHistory.create({
      data: {
        visaId: parseInt(visaId),
        tripPurpose,
        tripType,
        departureDate: departureDate ? new Date(departureDate) : null,
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        returnDate: returnDate ? new Date(returnDate) : null,
        departureCity,
        arrivalCity,
        transportMode,
        flightNumber,
        accommodationType,
        accommodationName,
        accommodationAddress,
        tripStatus: tripStatus || 'PLANNED',
        entryPoint,
        exitPoint,
        entryStamp: entryStamp ?? false,
        exitStamp: exitStamp ?? false,
        plannedDuration: plannedDuration ? parseInt(plannedDuration) : null,
        actualDuration: actualDuration ? parseInt(actualDuration) : null,
        stayWithinLimits: stayWithinLimits ?? true,
        reportedToAuthorities: reportedToAuthorities ?? false,
        travelingAlone: travelingAlone ?? true,
        companions: companions ? JSON.stringify(companions) : null,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        actualCost: actualCost ? parseFloat(actualCost) : null,
        currency: currency || 'USD',
        fundingSource,
        documents: documents ? JSON.stringify(documents) : null,
        insuranceDetails,
        emergencyContactLocal,
        emergencyContactHome,
        vaccinationsRequired,
        healthDeclaration: healthDeclaration ?? false,
        quarantineRequired: quarantineRequired ?? false,
        quarantineDuration: quarantineDuration ? parseInt(quarantineDuration) : null,
        immigrationIssues: immigrationIssues ?? false,
        immigrationNotes,
        customsIssues: customsIssues ?? false,
        customsNotes,
        returnReason,
        extendedStay: extendedStay ?? false,
        extensionDetails,
        tripNotes,
        lessonsLearned,
        wouldRecommend,
        overallRating: overallRating ? parseFloat(overallRating) : null,
        createdBy
      }
    })

    return NextResponse.json(travelHistory)
  } catch (error) {
    console.error('Create travel history error:', error)
    return NextResponse.json(
      { error: 'Failed to create travel history' },
      { status: 500 }
    )
  }
}