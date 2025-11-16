import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/rental-cars-self-drive/[id]
 * Get a single rental car by ID
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
        { success: false, error: 'Invalid rental car ID' },
        { status: 400 }
      )
    }

    const rentalCar = await prisma.tripRentalCarSelfDrive.findUnique({
      where: { id },
    })

    if (!rentalCar) {
      return NextResponse.json(
        { success: false, error: 'Rental car not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: rentalCar,
    })
  } catch (error) {
    console.error('Error fetching rental car:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rental car' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/rental-cars-self-drive/[id]
 * Update a rental car booking
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
        { success: false, error: 'Invalid rental car ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const rentalCar = await prisma.tripRentalCarSelfDrive.update({
      where: { id },
      data: {
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
        insuranceType: body.insuranceType,
        bookingReference: body.bookingReference,
        status: body.status,
        notes: body.notes,
      },
    })

    return NextResponse.json({
      success: true,
      data: rentalCar,
    })
  } catch (error) {
    console.error('Error updating rental car:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update rental car' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/rental-cars-self-drive/[id]
 * Delete a rental car booking
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
        { success: false, error: 'Invalid rental car ID' },
        { status: 400 }
      )
    }

    await prisma.tripRentalCarSelfDrive.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Rental car booking deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting rental car:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete rental car' },
      { status: 500 }
    )
  }
}
