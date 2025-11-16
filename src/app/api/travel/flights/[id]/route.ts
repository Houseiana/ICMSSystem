import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/flights/[id]
 * Get a single flight by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid flight ID' },
        { status: 400 }
      )
    }

    const flight = await prisma.tripFlight.findUnique({
      where: { id },
      include: {
        passengers: true,
        travelRequest: {
          select: {
            id: true,
            requestNumber: true,
            status: true
          }
        }
      }
    })

    if (!flight) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: flight
    })
  } catch (error) {
    console.error('Error fetching flight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flight' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/flights/[id]
 * Update a flight
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid flight ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const existing = await prisma.tripFlight.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      )
    }

    // Update flight and handle passengers
    const flight = await prisma.tripFlight.update({
      where: { id },
      data: {
        flightNumber: body.flightNumber,
        airline: body.airline,
        departureAirport: body.departureAirport,
        arrivalAirport: body.arrivalAirport,
        departureDate: body.departureDate ? new Date(body.departureDate) : null,
        departureTime: body.departureTime,
        arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : null,
        arrivalTime: body.arrivalTime,
        class: body.class,
        bookingReference: body.bookingReference,
        terminal: body.terminal,
        gate: body.gate,
        seatNumbers: body.seatNumbers,
        baggageAllowance: body.baggageAllowance,
        mealPreference: body.mealPreference,
        status: body.status,
        notes: body.notes
      },
      include: {
        passengers: true
      }
    })

    return NextResponse.json({
      success: true,
      data: flight
    })
  } catch (error) {
    console.error('Error updating flight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update flight' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/flights/[id]
 * Delete a flight
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid flight ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.tripFlight.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      )
    }

    await prisma.tripFlight.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Flight deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting flight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete flight' },
      { status: 500 }
    )
  }
}
