import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * POST /api/travel/private-jets
 * Create a new private jet booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const privateJet = await prisma.tripPrivateJet.create({
      data: {
        travelRequestId: body.travelRequestId,
        aircraftType: body.aircraftType,
        operator: body.operator,
        tailNumber: body.tailNumber,
        departureAirport: body.departureAirport,
        arrivalAirport: body.arrivalAirport,
        departureDate: body.departureDate ? new Date(body.departureDate) : null,
        departureTime: body.departureTime,
        arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : null,
        arrivalTime: body.arrivalTime,
        passengerCapacity: body.passengerCapacity,
        amenities: body.amenities,
        cateringDetails: body.cateringDetails,
        bookingReference: body.bookingReference,
        status: body.status || 'PENDING',
        notes: body.notes,
      },
    })

    return NextResponse.json({
      success: true,
      data: privateJet,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating private jet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create private jet' },
      { status: 500 }
    )
  }
}
