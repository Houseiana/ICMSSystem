import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/embassy-services/[id]
 * Get a single embassy service by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid embassy service ID' },
        { status: 400 }
      )
    }

    const embassyService = await prisma.tripEmbassyService.findUnique({
      where: { id },
      include: {
        passengers: true,
        arrivalFlight: true,
        departureFlight: true,
      },
    })

    if (!embassyService) {
      return NextResponse.json(
        { success: false, error: 'Embassy service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: embassyService,
    })
  } catch (error) {
    console.error('Error fetching embassy service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch embassy service' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/embassy-services/[id]
 * Update an embassy service
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid embassy service ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const embassyService = await prisma.tripEmbassyService.update({
      where: { id },
      data: {
        submissionDate: body.submissionDate ? new Date(body.submissionDate) : undefined,
        arrivalContactPerson: body.arrivalContactPerson,
        arrivalContactPhone: body.arrivalContactPhone,
        arrivalContactEmail: body.arrivalContactEmail,
        sameDepartureContact: body.sameDepartureContact,
        departureContactPerson: body.departureContactPerson,
        departureContactPhone: body.departureContactPhone,
        departureContactEmail: body.departureContactEmail,
        passengersArrivalCount: body.passengersArrivalCount,
        passengersDepartureCount: body.passengersDepartureCount,
        arrivalFlightId: body.arrivalFlightId,
        departureFlightId: body.departureFlightId,
        arrivalTime: body.arrivalTime,
        departureTime: body.departureTime,
        status: body.status,
        notes: body.notes,
      },
      include: {
        passengers: true,
        arrivalFlight: true,
        departureFlight: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: embassyService,
    })
  } catch (error) {
    console.error('Error updating embassy service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update embassy service' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/embassy-services/[id]
 * Delete an embassy service
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid embassy service ID' },
        { status: 400 }
      )
    }

    await prisma.tripEmbassyService.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Embassy service deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting embassy service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete embassy service' },
      { status: 500 }
    )
  }
}
