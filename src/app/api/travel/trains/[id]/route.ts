import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/trains/[id]
 * Get a single train by ID
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
        { success: false, error: 'Invalid train ID' },
        { status: 400 }
      )
    }

    const train = await prisma.tripTrain.findUnique({
      where: { id },
      include: {
        passengers: true,
      },
    })

    if (!train) {
      return NextResponse.json(
        { success: false, error: 'Train not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: train,
    })
  } catch (error) {
    console.error('Error fetching train:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch train' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/trains/[id]
 * Update a train booking
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
        { success: false, error: 'Invalid train ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const train = await prisma.tripTrain.update({
      where: { id },
      data: {
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
        status: body.status,
        notes: body.notes,
      },
      include: {
        passengers: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: train,
    })
  } catch (error) {
    console.error('Error updating train:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update train' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/trains/[id]
 * Delete a train booking
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
        { success: false, error: 'Invalid train ID' },
        { status: 400 }
      )
    }

    await prisma.tripTrain.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Train booking deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting train:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete train' },
      { status: 500 }
    )
  }
}
