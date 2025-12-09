import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate/[id]/flat-types/[flatTypeId]
 * Get a single flat type
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; flatTypeId: string } }
) {
  try {
    const flatTypeId = parseInt(params.flatTypeId)

    if (isNaN(flatTypeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid flat type ID' },
        { status: 400 }
      )
    }

    const flatType = await prisma.flatType.findUnique({
      where: { id: flatTypeId }
    })

    if (!flatType) {
      return NextResponse.json(
        { success: false, error: 'Flat type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: flatType
    })
  } catch (error) {
    console.error('Error fetching flat type:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flat type' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/finance/real-estate/[id]/flat-types/[flatTypeId]
 * Update a flat type
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; flatTypeId: string } }
) {
  try {
    const flatTypeId = parseInt(params.flatTypeId)

    if (isNaN(flatTypeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid flat type ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.flatType.findUnique({
      where: { id: flatTypeId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Flat type not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const flatType = await prisma.flatType.update({
      where: { id: flatTypeId },
      data: {
        typeName: body.typeName,
        description: body.description,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        totalArea: body.totalArea,
        isFurnished: body.isFurnished,
        includesUtilities: body.includesUtilities,
        facilityAccess: body.facilityAccess ? JSON.stringify(body.facilityAccess) : null,
        monthlyRate: body.monthlyRate,
        currency: body.currency,
        totalUnits: body.totalUnits,
        availableUnits: body.availableUnits,
        notes: body.notes
      }
    })

    return NextResponse.json({
      success: true,
      data: flatType
    })
  } catch (error) {
    console.error('Error updating flat type:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update flat type' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/finance/real-estate/[id]/flat-types/[flatTypeId]
 * Delete a flat type
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; flatTypeId: string } }
) {
  try {
    const flatTypeId = parseInt(params.flatTypeId)

    if (isNaN(flatTypeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid flat type ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.flatType.findUnique({
      where: { id: flatTypeId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Flat type not found' },
        { status: 404 }
      )
    }

    await prisma.flatType.delete({
      where: { id: flatTypeId }
    })

    return NextResponse.json({
      success: true,
      message: 'Flat type deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting flat type:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete flat type' },
      { status: 500 }
    )
  }
}
