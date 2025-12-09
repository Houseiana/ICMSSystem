import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/meet-assist/[id]
 * Get a single meet & assist service by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid meet & assist ID' },
        { status: 400 }
      )
    }

    const meetAssist = await prisma.tripMeetAssist.findUnique({
      where: { id },
    })

    if (!meetAssist) {
      return NextResponse.json(
        { success: false, error: 'Meet & assist service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: meetAssist,
    })
  } catch (error) {
    console.error('Error fetching meet & assist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meet & assist service' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/meet-assist/[id]
 * Update a meet & assist service
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid meet & assist ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Check if exists
    const existing = await prisma.tripMeetAssist.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Meet & assist service not found' },
        { status: 404 }
      )
    }

    const meetAssist = await prisma.tripMeetAssist.update({
      where: { id },
      data: {
        serviceType: body.serviceType,
        serviceProvider: body.serviceProvider,
        airport: body.airport,
        airportName: body.airportName,
        terminal: body.terminal,
        flightNumber: body.flightNumber,
        serviceDate: body.serviceDate ? new Date(body.serviceDate) : null,
        serviceTime: body.serviceTime,
        meetingPoint: body.meetingPoint,
        greeterName: body.greeterName,
        greeterPhone: body.greeterPhone,
        greeterEmail: body.greeterEmail,
        numberOfPassengers: body.numberOfPassengers,
        vipLevel: body.vipLevel,
        includesFastTrack: body.includesFastTrack,
        includesLounge: body.includesLounge,
        includesPorterage: body.includesPorterage,
        includesBuggy: body.includesBuggy,
        loungeAccess: body.loungeAccess,
        specialRequests: body.specialRequests,
        pricePerPerson: body.pricePerPerson,
        totalPrice: body.totalPrice,
        currency: body.currency,
        bookingReference: body.bookingReference,
        confirmationNumber: body.confirmationNumber,
        contactPerson: body.contactPerson,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        websiteUrl: body.websiteUrl,
        status: body.status,
        notes: body.notes,
      },
    })

    return NextResponse.json({
      success: true,
      data: meetAssist,
    })
  } catch (error) {
    console.error('Error updating meet & assist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update meet & assist service' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/meet-assist/[id]
 * Delete a meet & assist service
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid meet & assist ID' },
        { status: 400 }
      )
    }

    // Check if exists
    const existing = await prisma.tripMeetAssist.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Meet & assist service not found' },
        { status: 404 }
      )
    }

    await prisma.tripMeetAssist.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Meet & assist service deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting meet & assist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete meet & assist service' },
      { status: 500 }
    )
  }
}
