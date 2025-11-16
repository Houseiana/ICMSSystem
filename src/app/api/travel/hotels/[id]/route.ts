import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/hotels/[id]
 * Get a single hotel by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hotel ID' },
        { status: 400 }
      )
    }

    const hotel = await prisma.tripHotel.findUnique({
      where: { id },
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
      }
    })

    if (!hotel) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: hotel
    })
  } catch (error) {
    console.error('Error fetching hotel:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotel' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/hotels/[id]
 * Update a hotel
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hotel ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const existing = await prisma.tripHotel.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found' },
        { status: 404 }
      )
    }

    const hotel = await prisma.tripHotel.update({
      where: { id },
      data: {
        hotelName: body.hotelName,
        address: body.address,
        city: body.city,
        country: body.country,
        phone: body.phone,
        email: body.email,
        checkInDate: body.checkInDate ? new Date(body.checkInDate) : null,
        checkOutDate: body.checkOutDate ? new Date(body.checkOutDate) : null,
        confirmationNumber: body.confirmationNumber,
        status: body.status,
        notes: body.notes
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
    })
  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update hotel' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/hotels/[id]
 * Delete a hotel
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid hotel ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.tripHotel.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found' },
        { status: 404 }
      )
    }

    await prisma.tripHotel.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Hotel deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete hotel' },
      { status: 500 }
    )
  }
}
