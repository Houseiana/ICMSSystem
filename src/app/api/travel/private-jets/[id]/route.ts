import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/private-jets/[id]
 * Get a single private jet by ID
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
        { success: false, error: 'Invalid private jet ID' },
        { status: 400 }
      )
    }

    const privateJet = await prisma.tripPrivateJet.findUnique({
      where: { id },
      include: {
        passengers: true,
      },
    })

    if (!privateJet) {
      return NextResponse.json(
        { success: false, error: 'Private jet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: privateJet,
    })
  } catch (error) {
    console.error('Error fetching private jet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch private jet' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/private-jets/[id]
 * Update a private jet
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
        { success: false, error: 'Invalid private jet ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const privateJet = await prisma.tripPrivateJet.update({
      where: { id },
      data: {
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
        status: body.status,
        notes: body.notes,
      },
      include: {
        passengers: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: privateJet,
    })
  } catch (error) {
    console.error('Error updating private jet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update private jet' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/private-jets/[id]
 * Delete a private jet
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
        { success: false, error: 'Invalid private jet ID' },
        { status: 400 }
      )
    }

    await prisma.tripPrivateJet.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Private jet deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting private jet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete private jet' },
      { status: 500 }
    )
  }
}
