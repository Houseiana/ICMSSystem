import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * POST /api/travel/cars-with-driver
 * Create a new car with driver booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const carWithDriver = await prisma.tripCarWithDriver.create({
      data: {
        travelRequestId: body.travelRequestId,
        carType: body.vehicleType || body.carType,
        rentalCompany: body.company || body.rentalCompany,
        driverName: body.driverName,
        driverPhone: body.driverPhone,
        numberOfPassengers: body.numberOfPassengers,
        pickupLocation: body.pickupLocation,
        pickupDate: body.pickupDate ? new Date(body.pickupDate) : null,
        pickupTime: body.pickupTime,
        returnLocation: body.dropoffLocation || body.returnLocation,
        returnDate: body.dropoffDate ? new Date(body.dropoffDate) : (body.returnDate ? new Date(body.returnDate) : null),
        returnTime: body.dropoffTime || body.returnTime,
        bookingReference: body.bookingReference,
        status: body.status || 'PENDING',
        notes: body.notes,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: carWithDriver,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating car with driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create car with driver booking' },
      { status: 500 }
    )
  }
}
