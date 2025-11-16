import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/requests
 * Get all travel requests with optional filters
 * Query params:
 *   - status: filter by status (REQUEST, PLANNING, CONFIRMING, EXECUTING, COMPLETED, CANCELLED)
 *   - startDate: filter by trip start date (ISO string)
 *   - endDate: filter by trip end date (ISO string)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (startDate) {
      where.tripStartDate = {
        gte: new Date(startDate)
      }
    }

    if (endDate) {
      where.tripEndDate = {
        lte: new Date(endDate)
      }
    }

    const requests = await prisma.travelRequest.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length
    })
  } catch (error) {
    console.error('Error fetching travel requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch travel requests' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/travel/requests
 * Create a new travel request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate request number
    const requestNumber = `TR-${Date.now()}`

    const travelRequest = await prisma.travelRequest.create({
      data: {
        requestNumber,
        createdById: body.createdById,
        tripStartDate: body.tripStartDate ? new Date(body.tripStartDate) : null,
        tripEndDate: body.tripEndDate ? new Date(body.tripEndDate) : null,
        notes: body.notes,
        status: 'REQUEST'
      }
    })

    return NextResponse.json({
      success: true,
      data: travelRequest
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating travel request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create travel request' },
      { status: 500 }
    )
  }
}
