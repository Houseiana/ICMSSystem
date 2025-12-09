import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * POST /api/travel/meet-assist
 * Create a new meet & assist service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const meetAssist = await prisma.tripMeetAssist.create({
      data: {
        travelRequestId: body.travelRequestId,
        serviceType: body.serviceType,
        serviceProvider: body.serviceProvider,
        airport: body.airport,
        airportName: body.airportName,
        terminal: body.terminal,
        flightNumber: body.flightNumber,
        serviceDate: body.serviceDate ? new Date(body.serviceDate) : undefined,
        serviceTime: body.serviceTime,
        meetingPoint: body.meetingPoint,
        greeterName: body.greeterName,
        greeterPhone: body.greeterPhone,
        greeterEmail: body.greeterEmail,
        numberOfPassengers: body.numberOfPassengers,
        vipLevel: body.vipLevel,
        includesFastTrack: body.includesFastTrack || false,
        includesLounge: body.includesLounge || false,
        includesPorterage: body.includesPorterage || false,
        includesBuggy: body.includesBuggy || false,
        loungeAccess: body.loungeAccess,
        specialRequests: body.specialRequests,
        pricePerPerson: body.pricePerPerson,
        totalPrice: body.totalPrice,
        currency: body.currency || 'USD',
        bookingReference: body.bookingReference,
        confirmationNumber: body.confirmationNumber,
        contactPerson: body.contactPerson,
        contactPhone: body.contactPhone,
        contactEmail: body.contactEmail,
        websiteUrl: body.websiteUrl,
        status: body.status || 'PENDING',
        notes: body.notes,
      },
    })

    return NextResponse.json(
      { success: true, data: meetAssist },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating meet & assist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create meet & assist service' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/travel/meet-assist
 * Get all meet & assist services (optionally filtered by travelRequestId)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const travelRequestId = searchParams.get('travelRequestId')

    const meetAssist = await prisma.tripMeetAssist.findMany({
      where: travelRequestId
        ? { travelRequestId: parseInt(travelRequestId) }
        : undefined,
      orderBy: { serviceDate: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: meetAssist,
    })
  } catch (error) {
    console.error('Error fetching meet & assist services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meet & assist services' },
      { status: 500 }
    )
  }
}
