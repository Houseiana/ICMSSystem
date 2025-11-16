import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'
import { fetchPersonDetails } from '@/lib/utils/personHelper'

/**
 * GET /api/travel/passengers/[id]
 * Get a single passenger by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid passenger ID' },
        { status: 400 }
      )
    }

    const passenger = await prisma.tripPassenger.findUnique({
      where: { id },
      include: {
        travelRequest: {
          select: {
            id: true,
            requestNumber: true,
            status: true
          }
        }
      }
    })

    if (!passenger) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      )
    }

    // Fetch person details
    const personDetails = await fetchPersonDetails(passenger.personType, passenger.personId)

    return NextResponse.json({
      success: true,
      data: {
        ...passenger,
        personDetails
      }
    })
  } catch (error) {
    console.error('Error fetching passenger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch passenger' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/passengers/[id]
 * Update a passenger's preferences and visa information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid passenger ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const existing = await prisma.tripPassenger.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      )
    }

    const passenger = await prisma.tripPassenger.update({
      where: { id },
      data: {
        isMainPassenger: body.isMainPassenger,
        visaStatus: body.visaStatus,
        visaId: body.visaId,
        visaValidityStart: body.visaValidityStart ? new Date(body.visaValidityStart) : undefined,
        visaValidityEnd: body.visaValidityEnd ? new Date(body.visaValidityEnd) : undefined,
        passportId: body.passportId,
        notificationPreference: body.notificationPreference,
        receiveFlightDetails: body.receiveFlightDetails,
        receiveHotelDetails: body.receiveHotelDetails,
        receiveEventDetails: body.receiveEventDetails,
        receiveItinerary: body.receiveItinerary
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
    })
  } catch (error) {
    console.error('Error updating passenger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update passenger' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/passengers/[id]
 * Remove a passenger from a travel request
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid passenger ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.tripPassenger.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      )
    }

    await prisma.tripPassenger.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Passenger removed successfully'
    })
  } catch (error) {
    console.error('Error deleting passenger:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete passenger' },
      { status: 500 }
    )
  }
}
