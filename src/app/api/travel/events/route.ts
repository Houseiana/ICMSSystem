import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/events
 * Get all events with optional filters
 * Query params:
 *   - travelRequestId: filter by travel request
 *   - eventType: filter by event type (TICKET, PARK, TOUR, RESTAURANT, etc.)
 *   - status: filter by status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const travelRequestId = searchParams.get('travelRequestId')
    const eventType = searchParams.get('eventType')
    const status = searchParams.get('status')

    const where: any = {}

    if (travelRequestId) {
      where.travelRequestId = parseInt(travelRequestId)
    }

    if (eventType) {
      where.eventType = eventType
    }

    if (status) {
      where.status = status
    }

    const events = await prisma.tripEvent.findMany({
      where,
      include: {
        participants: true,
        attachments: true,
        travelRequest: {
          select: {
            id: true,
            requestNumber: true,
            status: true
          }
        }
      },
      orderBy: {
        eventDate: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/travel/events
 * Create a new event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const event = await prisma.tripEvent.create({
      data: {
        travelRequestId: body.travelRequestId,
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
        currency: body.currency || 'USD',
        bookingReference: body.bookingReference,
        contactPerson: body.contactPerson,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        websiteUrl: body.websiteUrl,
        dressCode: body.dressCode,
        specialInstructions: body.specialInstructions,
        status: body.status || 'PENDING',
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
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
