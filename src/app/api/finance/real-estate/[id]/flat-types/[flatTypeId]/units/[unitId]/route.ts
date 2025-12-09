import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units/[unitId]
 * Get a single flat unit with all details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; flatTypeId: string; unitId: string } }
) {
  try {
    const unitId = parseInt(params.unitId)

    if (isNaN(unitId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid unit ID' },
        { status: 400 }
      )
    }

    const flatUnit = await prisma.flatUnit.findUnique({
      where: { id: unitId },
      include: {
        flatType: {
          include: {
            realEstate: true
          }
        },
        monthlyRecords: {
          orderBy: [{ year: 'desc' }, { month: 'desc' }]
        }
      }
    })

    if (!flatUnit) {
      return NextResponse.json(
        { success: false, error: 'Flat unit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: flatUnit
    })
  } catch (error) {
    console.error('Error fetching flat unit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flat unit' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units/[unitId]
 * Update a flat unit
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; flatTypeId: string; unitId: string } }
) {
  try {
    const unitId = parseInt(params.unitId)
    const flatTypeId = parseInt(params.flatTypeId)

    if (isNaN(unitId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid unit ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.flatUnit.findUnique({
      where: { id: unitId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Flat unit not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const flatUnit = await prisma.flatUnit.update({
      where: { id: unitId },
      data: {
        unitNumber: body.unitNumber,
        floor: body.floor,
        status: body.status,
        tenantName: body.tenantName,
        tenantPhone: body.tenantPhone,
        tenantQID: body.tenantQID,
        waterAccountNo: body.waterAccountNo,
        electricityAccountNo: body.electricityAccountNo,
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        monthlyRent: body.monthlyRent,
        currency: body.currency,
        guaranteeType: body.guaranteeType,
        guaranteeAmount: body.guaranteeAmount,
        guaranteeChequeNo: body.guaranteeChequeNo,
        guaranteeBank: body.guaranteeBank,
        notes: body.notes
      }
    })

    // Update available units count if status changed
    if (existing.status !== body.status) {
      const unitCounts = await prisma.flatUnit.groupBy({
        by: ['status'],
        where: { flatTypeId },
        _count: true
      })

      const vacantUnits = unitCounts.find(c => c.status === 'VACANT')?._count || 0

      await prisma.flatType.update({
        where: { id: flatTypeId },
        data: { availableUnits: vacantUnits }
      })
    }

    return NextResponse.json({
      success: true,
      data: flatUnit
    })
  } catch (error) {
    console.error('Error updating flat unit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update flat unit' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units/[unitId]
 * Delete a flat unit
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; flatTypeId: string; unitId: string } }
) {
  try {
    const unitId = parseInt(params.unitId)
    const flatTypeId = parseInt(params.flatTypeId)

    if (isNaN(unitId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid unit ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.flatUnit.findUnique({
      where: { id: unitId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Flat unit not found' },
        { status: 404 }
      )
    }

    await prisma.flatUnit.delete({
      where: { id: unitId }
    })

    // Update flat type counts
    const unitCounts = await prisma.flatUnit.groupBy({
      by: ['status'],
      where: { flatTypeId },
      _count: true
    })

    const totalUnits = unitCounts.reduce((sum, c) => sum + c._count, 0)
    const vacantUnits = unitCounts.find(c => c.status === 'VACANT')?._count || 0

    await prisma.flatType.update({
      where: { id: flatTypeId },
      data: {
        totalUnits,
        availableUnits: vacantUnits
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Flat unit deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting flat unit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete flat unit' },
      { status: 500 }
    )
  }
}
