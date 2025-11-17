import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/hotels
 * Get all hotels with optional filters
 * Query params:
 *   - travelRequestId: filter by travel request
 *   - status: filter by status
 *   - city: filter by city
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const travelRequestId = searchParams.get('travelRequestId')
    const status = searchParams.get('status')
    const city = searchParams.get('city')

    const where: any = {}

    if (travelRequestId) {
      where.travelRequestId = parseInt(travelRequestId)
    }

    if (status) {
      where.status = status
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    const hotels = await prisma.tripHotel.findMany({
      where,
      include: {
        rooms: {
          include: {
            assignments: true
          }
        },
        travelRequest: {
          select: {
            id: true,
            requestNumber: true,
            status: true
          }
        }
      },
      orderBy: {
        checkInDate: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: hotels,
      count: hotels.length
    })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/travel/hotels
 * Create a new hotel booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const hotel = await prisma.tripHotel.create({
      data: {
        travelRequestId: body.travelRequestId,
        hotelName: body.hotelName,
        address: body.address,
        city: body.city,
        country: body.country,
        phone: body.phone,
        email: body.email,
        checkInDate: body.checkInDate ? new Date(body.checkInDate) : null,
        checkOutDate: body.checkOutDate ? new Date(body.checkOutDate) : null,
        confirmationNumber: body.confirmationNumber,
        status: body.status || 'PENDING',
        notes: body.notes,
        // Add rooms if provided
        ...(body.rooms && body.rooms.length > 0 && {
          rooms: {
            create: body.rooms.map((r: any) => ({
              unitCategory: r.unitCategory,
              roomNumber: r.roomNumber,
              bathrooms: r.bathrooms,
              hasPantry: r.hasPantry || false,
              guestNumbers: r.guestNumbers,
              bedType: r.bedType,
              connectedToRoom: r.connectedToRoom,
              pricePerNight: r.pricePerNight,
              ...(r.assignments && r.assignments.length > 0 && {
                assignments: {
                  create: r.assignments.map((a: any) => ({
                    personType: a.personType,
                    personId: a.personId
                  }))
                }
              })
            }))
          }
        })
      },
      include: {
        rooms: {
          include: {
            assignments: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: hotel
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating hotel:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create hotel' },
      { status: 500 }
    )
  }
}
