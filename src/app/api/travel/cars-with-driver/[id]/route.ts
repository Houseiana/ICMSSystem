import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/cars-with-driver/[id]
 * Get a single car with driver by ID
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
        { success: false, error: 'Invalid car with driver ID' },
        { status: 400 }
      )
    }

    const carWithDriver = await prisma.tripCarWithDriver.findUnique({
      where: { id },
      include: {
        passengers: true,
      },
    })

    if (!carWithDriver) {
      return NextResponse.json(
        { success: false, error: 'Car with driver not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: carWithDriver,
    })
  } catch (error) {
    console.error('Error fetching car with driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch car with driver' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/cars-with-driver/[id]
 * Update a car with driver booking
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
        { success: false, error: 'Invalid car with driver ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const carWithDriver = await prisma.tripCarWithDriver.update({
      where: { id },
      data: {
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
        status: body.status,
        notes: body.notes,
      },
      include: {
        passengers: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: carWithDriver,
    })
  } catch (error) {
    console.error('Error updating car with driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update car with driver' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/cars-with-driver/[id]
 * Delete a car with driver booking
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
        { success: false, error: 'Invalid car with driver ID' },
        { status: 400 }
      )
    }

    await prisma.tripCarWithDriver.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Car with driver booking deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting car with driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete car with driver' },
      { status: 500 }
    )
  }
}
