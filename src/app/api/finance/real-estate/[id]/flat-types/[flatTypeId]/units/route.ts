import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units
 * Get all flat units for a flat type
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

    const flatUnits = await prisma.flatUnit.findMany({
      where: { flatTypeId },
      include: {
        monthlyRecords: {
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          take: 12
        }
      },
      orderBy: { unitNumber: 'asc' }
    })

    // Calculate summary
    const occupied = flatUnits.filter(u => u.status === 'OCCUPIED').length
    const vacant = flatUnits.filter(u => u.status === 'VACANT').length
    const underRenovation = flatUnits.filter(u => u.status === 'UNDER_RENOVATION').length

    return NextResponse.json({
      success: true,
      data: flatUnits,
      summary: {
        total: flatUnits.length,
        occupied,
        vacant,
        underRenovation
      }
    })
  } catch (error) {
    console.error('Error fetching flat units:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flat units' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units
 * Create a new flat unit
 */
export async function POST(
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

    // Verify flat type exists
    const flatType = await prisma.flatType.findUnique({
      where: { id: flatTypeId }
    })

    if (!flatType) {
      return NextResponse.json(
        { success: false, error: 'Flat type not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const flatUnit = await prisma.flatUnit.create({
      data: {
        flatTypeId,
        unitNumber: body.unitNumber,
        floor: body.floor,
        status: body.status || 'VACANT',
        tenantName: body.tenantName,
        tenantPhone: body.tenantPhone,
        tenantQID: body.tenantQID,
        waterAccountNo: body.waterAccountNo,
        electricityAccountNo: body.electricityAccountNo,
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        monthlyRent: body.monthlyRent,
        currency: body.currency || 'QAR',
        guaranteeType: body.guaranteeType,
        guaranteeAmount: body.guaranteeAmount,
        guaranteeChequeNo: body.guaranteeChequeNo,
        guaranteeBank: body.guaranteeBank,
        notes: body.notes
      }
    })

    // Update available units count in flat type
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
      data: flatUnit
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating flat unit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create flat unit' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units?action=bulk-create
 * Bulk create flat units
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; flatTypeId: string } }
) {
  try {
    const flatTypeId = parseInt(params.flatTypeId)
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (isNaN(flatTypeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid flat type ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    if (action === 'bulk-create') {
      // Create multiple units at once
      const { count, startNumber, prefix } = body
      const units = []

      for (let i = 0; i < count; i++) {
        const unitNumber = prefix ? `${prefix}${startNumber + i}` : String(startNumber + i)
        units.push({
          flatTypeId,
          unitNumber,
          status: 'VACANT',
          currency: 'QAR'
        })
      }

      await prisma.flatUnit.createMany({
        data: units
      })

      // Update available units count
      const flatType = await prisma.flatType.update({
        where: { id: flatTypeId },
        data: {
          totalUnits: { increment: count },
          availableUnits: { increment: count }
        }
      })

      return NextResponse.json({
        success: true,
        message: `Created ${count} flat units`,
        data: flatType
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error bulk creating flat units:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to bulk create flat units' },
      { status: 500 }
    )
  }
}
