import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/hotels/[id]/rooms
 * Get all rooms for a hotel
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotelId = parseInt(params.id)

    if (isNaN(hotelId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hotel ID' },
        { status: 400 }
      )
    }

    const rooms = await prisma.tripHotelRoom.findMany({
      where: { tripHotelId: hotelId },
      include: {
        assignments: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: rooms,
      count: rooms.length
    })
  } catch (error) {
    console.error('Error fetching hotel rooms:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotel rooms' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/travel/hotels/[id]/rooms
 * Create a new room for a hotel
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotelId = parseInt(params.id)

    if (isNaN(hotelId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hotel ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Verify hotel exists
    const hotel = await prisma.tripHotel.findUnique({
      where: { id: hotelId }
    })

    if (!hotel) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found' },
        { status: 404 }
      )
    }

    const room = await prisma.tripHotelRoom.create({
      data: {
        tripHotelId: hotelId,
        unitCategory: body.unitCategory,
        roomNumber: body.roomNumber,
        bathrooms: body.bathrooms,
        hasPantry: body.hasPantry || false,
        guestNumbers: body.guestNumbers,
        bedType: body.bedType,
        connectedToRoom: body.connectedToRoom,
        pricePerNight: body.pricePerNight,
        ...(body.assignments && body.assignments.length > 0 && {
          assignments: {
            create: body.assignments.map((a: any) => ({
              personType: a.personType,
              personId: a.personId
            }))
          }
        })
      },
      include: {
        assignments: true
      }
    })

    return NextResponse.json({
      success: true,
      data: room
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating hotel room:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create hotel room' },
      { status: 500 }
    )
  }
}
