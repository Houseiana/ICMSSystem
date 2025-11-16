import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * POST /api/travel/trains
 * Create a new train booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const train = await prisma.tripTrain.create({
      data: {
        travelRequestId: body.travelRequestId,
        trainNumber: body.trainNumber,
        route: body.route,
        departureStation: body.departureStation,
        arrivalStation: body.arrivalStation,
        departureDate: body.departureDate ? new Date(body.departureDate) : undefined,
        departureTime: body.departureTime,
        arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : undefined,
        arrivalTime: body.arrivalTime,
        class: body.class,
        bookingReference: body.bookingReference,
        status: body.status || 'PENDING',
        notes: body.notes,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: train,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating train:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create train booking' },
      { status: 500 }
    )
  }
}
