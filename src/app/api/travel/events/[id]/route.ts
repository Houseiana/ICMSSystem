import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/events/[id]
 * Get a single event by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    const event = await prisma.tripEvent.findUnique({
      where: { id },
      include: {
        participants: true,
        attachments: true,
        travelRequest: {
          select: {
            id: true,
            requestNumber: true,
            status: true,
            tripStartDate: true,
            tripEndDate: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: event
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/events/[id]
 * Update an event
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Check if event exists
    const existing = await prisma.tripEvent.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    const event = await prisma.tripEvent.update({
      where: { id },
      data: {
        eventType: body.eventType,
        eventName: body.eventName,
        description: body.description,
        location: body.location,
        address: body.address,
        city: body.city,
        country: body.country,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
        startTime: body.startTime,
        endTime: body.endTime,
        durationHours: body.durationHours,
        pricePerPerson: body.pricePerPerson,
        totalPrice: body.totalPrice,
        currency: body.currency,
        bookingReference: body.bookingReference,
        contactPerson: body.contactPerson,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        websiteUrl: body.websiteUrl,
        dressCode: body.dressCode,
        specialInstructions: body.specialInstructions,
        status: body.status,
        notes: body.notes
      },
      include: {
        participants: true,
        attachments: true
      }
    })

    return NextResponse.json({
      success: true,
      data: event
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/events/[id]
 * Delete an event
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    // Check if event exists
    const existing = await prisma.tripEvent.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Delete event (cascade will delete participants and attachments)
    await prisma.tripEvent.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
