import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/hotels/[id]/rooms/[roomId]
 * Get a single room by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const roomId = parseInt(params.roomId)

    if (isNaN(roomId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid room ID' },
        { status: 400 }
      )
    }

    const room = await prisma.tripHotelRoom.findUnique({
      where: { id: roomId },
      include: {
        assignments: true,
        hotel: {
          select: {
            id: true,
            hotelName: true
          }
        }
      }
    })

    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: room
    })
  } catch (error) {
    console.error('Error fetching room:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch room' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/hotels/[id]/rooms/[roomId]
 * Update a room
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const roomId = parseInt(params.roomId)

    if (isNaN(roomId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid room ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const existing = await prisma.tripHotelRoom.findUnique({
      where: { id: roomId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      )
    }

    const room = await prisma.tripHotelRoom.update({
      where: { id: roomId },
      data: {
        unitCategory: body.unitCategory,
        roomNumber: body.roomNumber,
        bathrooms: body.bathrooms,
        hasPantry: body.hasPantry,
        guestNumbers: body.guestNumbers,
        bedType: body.bedType,
        connectedToRoom: body.connectedToRoom,
        pricePerNight: body.pricePerNight,
        includesBreakfast: body.includesBreakfast,
        websiteUrl: body.websiteUrl
      },
      include: {
        assignments: true
      }
    })

    // Handle guest assignments update if provided
    if (body.assignments && Array.isArray(body.assignments)) {
      // Delete existing assignments
      await prisma.tripRoomAssignment.deleteMany({
        where: { tripHotelRoomId: roomId }
      })

      // Create new assignments
      if (body.assignments.length > 0) {
        await prisma.tripRoomAssignment.createMany({
          data: body.assignments.map((a: any) => ({
            tripHotelRoomId: roomId,
            personType: a.personType,
            personId: a.personId
          }))
        })
      }
    }

    // Fetch updated room with assignments
    const updatedRoom = await prisma.tripHotelRoom.findUnique({
      where: { id: roomId },
      include: {
        assignments: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedRoom
    })
  } catch (error) {
    console.error('Error updating room:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update room' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/hotels/[id]/rooms/[roomId]
 * Delete a room
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const roomId = parseInt(params.roomId)

    if (isNaN(roomId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid room ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.tripHotelRoom.findUnique({
      where: { id: roomId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      )
    }

    await prisma.tripHotelRoom.delete({
      where: { id: roomId }
    })

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting room:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete room' },
      { status: 500 }
    )
  }
}
