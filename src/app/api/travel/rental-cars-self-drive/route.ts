import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * POST /api/travel/rental-cars-self-drive
 * Create a new self-drive rental car booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const rentalCar = await prisma.tripRentalCarSelfDrive.create({
      data: {
        travelRequestId: body.travelRequestId,
        rentalCompany: body.rentalCompany,
        carType: body.carType,
        carModel: body.carModel,
        pickupLocation: body.pickupLocation,
        returnLocation: body.returnLocation,
        pickupDate: body.pickupDate ? new Date(body.pickupDate) : undefined,
        pickupTime: body.pickupTime,
        returnDate: body.returnDate ? new Date(body.returnDate) : undefined,
        returnTime: body.returnTime,
        driverPersonType: body.driverPersonType,
        driverPersonId: body.driverPersonId,
        additionalDrivers: body.additionalDrivers || null,
        insuranceType: body.insuranceType,
        bookingReference: body.bookingReference,
        status: body.status || 'PENDING',
        notes: body.notes,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: rentalCar,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating rental car:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create rental car booking' },
      { status: 500 }
    )
  }
}
