import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'
import { fetchPersonDetails } from '@/lib/utils/personHelper'

/**
 * GET /api/travel/passengers
 * Get all passengers with optional filters
 * Query params:
 *   - travelRequestId: filter by travel request (required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const travelRequestId = searchParams.get('travelRequestId')

    if (!travelRequestId) {
      return NextResponse.json(
        { success: false, error: 'travelRequestId is required' },
        { status: 400 }
      )
    }

    const passengers = await prisma.tripPassenger.findMany({
      where: {
        travelRequestId: parseInt(travelRequestId)
      },
      orderBy: [
        { isMainPassenger: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    // Fetch person details for each passenger
    const passengersWithDetails = await Promise.all(
      passengers.map(async (passenger) => {
        const personDetails = await fetchPersonDetails(passenger.personType, passenger.personId)
        return {
          ...passenger,
          personDetails
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: passengersWithDetails,
      count: passengersWithDetails.length
    })
  } catch (error) {
    console.error('Error fetching passengers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch passengers' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/travel/passengers
 * Add a passenger to a travel request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.travelRequestId || !body.personType || !body.personId) {
      return NextResponse.json(
        { success: false, error: 'travelRequestId, personType, and personId are required' },
        { status: 400 }
      )
    }

    // Check if passenger already exists
    const existing = await prisma.tripPassenger.findFirst({
      where: {
        travelRequestId: body.travelRequestId,
        personType: body.personType,
        personId: body.personId
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Passenger already added to this travel request' },
        { status: 409 }
      )
    }

    // Automatically find and link passport and visa for EMPLOYEE or STAKEHOLDER
    let visaInfo: any = {}
    let passport: any = null
    let visa: any = null

    if (body.personType === 'EMPLOYEE' || body.personType === 'STAKEHOLDER' || body.personType === 'EMPLOYER') {
      // Find passport for person (using polymorphic ownerType/ownerId pattern)
      passport = await prisma.passport.findFirst({
        where: {
          ownerType: body.personType,
          ownerId: body.personId,
          status: 'ACTIVE'
        },
        orderBy: { expiryDate: 'desc' }
      })

      // Find valid visa for person (using polymorphic personType/personId pattern)
      visa = await prisma.visa.findFirst({
        where: {
          personType: body.personType,
          personId: body.personId,
          OR: [
            { visaStatus: 'HAS_VISA' },
            { visaStatus: 'UNDER_PROCESS' }
          ]
        },
        orderBy: { expiryDate: 'desc' }
      })

      // Set visa information
      if (visa) {
        visaInfo = {
          visaStatus: visa.visaStatus || 'NEEDS_VISA',
          visaId: visa.id,
          visaValidityStart: visa.issuanceDate,
          visaValidityEnd: visa.expiryDate,
          passportId: passport?.id || null
        }
      } else if (passport) {
        visaInfo = {
          visaStatus: 'NEEDS_VISA',
          visaId: null,
          visaValidityStart: null,
          visaValidityEnd: null,
          passportId: passport.id
        }
      } else {
        visaInfo = {
          visaStatus: 'NEEDS_VISA',
          visaId: null,
          visaValidityStart: null,
          visaValidityEnd: null,
          passportId: null
        }
      }
    } else {
      // For EMPLOYER and TASK_HELPER, set defaults
      visaInfo = {
        visaStatus: 'NOT_REQUIRED',
        visaId: null,
        visaValidityStart: null,
        visaValidityEnd: null,
        passportId: null
      }
    }

    const passenger = await prisma.tripPassenger.create({
      data: {
        travelRequestId: body.travelRequestId,
        personType: body.personType,
        personId: body.personId,
        isMainPassenger: body.isMainPassenger || false,
        notificationPreference: body.notificationPreference || 'ALL',
        receiveFlightDetails: body.receiveFlightDetails !== false,
        receiveHotelDetails: body.receiveHotelDetails !== false,
        receiveEventDetails: body.receiveEventDetails !== false,
        receiveItinerary: body.receiveItinerary !== false,
        ...visaInfo
      }
    })

    // Fetch person details
    const personDetails = await fetchPersonDetails(passenger.personType, passenger.personId)

    return NextResponse.json({
      success: true,
      data: {
        ...passenger,
        personDetails
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating passenger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create passenger' },
      { status: 500 }
    )
  }
}
