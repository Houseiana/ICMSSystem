import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate/[id]/flat-types
 * Get all flat types for a property
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = parseInt(params.id)

    if (isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const flatTypes = await prisma.flatType.findMany({
      where: { realEstateId: propertyId },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate totals
    const totalUnits = flatTypes.reduce((sum, ft) => sum + (ft.totalUnits || 0), 0)
    const availableUnits = flatTypes.reduce((sum, ft) => sum + (ft.availableUnits || 0), 0)

    return NextResponse.json({
      success: true,
      data: flatTypes,
      count: flatTypes.length,
      summary: {
        totalFlatTypes: flatTypes.length,
        totalUnits,
        availableUnits,
        occupiedUnits: totalUnits - availableUnits
      }
    })
  } catch (error) {
    console.error('Error fetching flat types:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flat types' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/real-estate/[id]/flat-types
 * Create a new flat type for a property
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = parseInt(params.id)

    if (isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    // Verify property exists
    const property = await prisma.realEstate.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const flatType = await prisma.flatType.create({
      data: {
        realEstateId: propertyId,
        typeName: body.typeName,
        description: body.description,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        totalArea: body.totalArea,
        isFurnished: body.isFurnished || false,
        includesUtilities: body.includesUtilities || false,
        facilityAccess: body.facilityAccess ? JSON.stringify(body.facilityAccess) : null,
        monthlyRate: body.monthlyRate,
        currency: body.currency || 'QAR',
        totalUnits: body.totalUnits,
        availableUnits: body.availableUnits,
        notes: body.notes
      }
    })

    return NextResponse.json({
      success: true,
      data: flatType
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating flat type:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create flat type' },
      { status: 500 }
    )
  }
}
