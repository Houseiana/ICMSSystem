import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * POST /api/travel/embassy-services
 * Create a new embassy service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const embassyService = await prisma.tripEmbassyService.create({
      data: {
        travelRequestId: body.travelRequestId,
        submissionDate: body.submissionDate ? new Date(body.submissionDate) : undefined,
        arrivalContactPerson: body.arrivalContactPerson,
        arrivalContactPhone: body.arrivalContactPhone,
        arrivalContactEmail: body.arrivalContactEmail,
        sameDepartureContact: body.sameDepartureContact ?? true,
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
    })

    return NextResponse.json(
      {
        success: true,
        data: embassyService,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating embassy service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create embassy service' },
      { status: 500 }
    )
  }
}
