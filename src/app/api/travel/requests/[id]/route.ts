import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'
import { fetchPersonDetails } from '@/lib/utils/personHelper'

/**
 * GET /api/travel/requests/[id]
 * Get a single travel request by ID with all details
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params for Next.js 14/15 compatibility
    const params = 'then' in context.params ? await context.params : context.params
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid travel request ID' },
        { status: 400 }
      )
    }

    const travelRequest = await prisma.travelRequest.findUnique({
      where: { id },
      include: {
        destinations: true,
        flights: true,
        privateJets: true,
        hotels: {
          include: {
            rooms: {
              include: {
                assignments: true
              }
            }
          }
        },
        embassyServices: true,
        meetAssist: true,
        trains: true,
        rentalCarsSelfDrive: true,
        carsWithDriver: true,
        events: true,
        passengers: true,
        communications: true,
        statusHistory: {
          orderBy: {
            changedAt: 'desc'
          }
        }
      }
    })

    if (!travelRequest) {
      return NextResponse.json(
        { success: false, error: 'Travel request not found' },
        { status: 404 }
      )
    }

    // Fetch person details for each passenger
    const passengersWithDetails = await Promise.all(
      (travelRequest.passengers || []).map(async (passenger) => {
        const personDetails = await fetchPersonDetails(passenger.personType, passenger.personId)
        return {
          ...passenger,
          personDetails
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        ...travelRequest,
        passengers: passengersWithDetails
      }
    })
  } catch (error) {
    console.error('Error fetching travel request:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { success: false, error: 'Failed to fetch travel request' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/travel/requests/[id]
 * Update a travel request
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params for Next.js 14/15 compatibility
    const params = 'then' in context.params ? await context.params : context.params
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid travel request ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Check if travel request exists
    const existing = await prisma.travelRequest.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Travel request not found' },
        { status: 404 }
      )
    }

    // Track status changes
    const statusChanged = body.status && body.status !== existing.status

    const travelRequest = await prisma.travelRequest.update({
      where: { id },
      data: {
        createdById: body.createdById,
        tripStartDate: body.tripStartDate ? new Date(body.tripStartDate) : null,
        tripEndDate: body.tripEndDate ? new Date(body.tripEndDate) : null,
        notes: body.notes,
        status: body.status,
        // Create status history if status changed
        ...(statusChanged && {
          statusHistory: {
            create: {
              fromStatus: existing.status,
              toStatus: body.status,
              changedById: body.changedById || body.createdById,
              notes: body.statusChangeNotes
            }
          }
        })
      },
      include: {
        destinations: true,
        flights: {
          include: {
            passengers: true
          }
        },
        privateJets: {
          include: {
            passengers: true
          }
        },
        hotels: {
          include: {
            rooms: {
              include: {
                assignments: true
              }
            }
          }
        },
        events: {
          include: {
            participants: true,
            attachments: true
          }
        },
        passengers: true
      }
    })

    return NextResponse.json({
      success: true,
      data: travelRequest
    })
  } catch (error) {
    console.error('Error updating travel request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update travel request' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/travel/requests/[id]
 * Delete a travel request and all related data (cascade)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params for Next.js 14/15 compatibility
    const params = 'then' in context.params ? await context.params : context.params
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid travel request ID' },
        { status: 400 }
      )
    }

    // Check if travel request exists
    const existing = await prisma.travelRequest.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Travel request not found' },
        { status: 404 }
      )
    }

    // Delete travel request (cascade will delete all related data)
    await prisma.travelRequest.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Travel request deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting travel request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete travel request' },
      { status: 500 }
    )
  }
}
