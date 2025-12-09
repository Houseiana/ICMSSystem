import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units/[unitId]/monthly-records
 * Get monthly records for a flat unit (can filter by year)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; flatTypeId: string; unitId: string } }
) {
  try {
    const unitId = parseInt(params.unitId)
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
      ? parseInt(searchParams.get('year')!)
      : new Date().getFullYear()

    if (isNaN(unitId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid unit ID' },
        { status: 400 }
      )
    }

    // Get all records for the specified year
    const records = await prisma.flatMonthlyRecord.findMany({
      where: {
        flatUnitId: unitId,
        year
      },
      orderBy: { month: 'asc' }
    })

    // Create a full 12-month array with existing records or empty placeholders
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const existing = records.find(r => r.month === month)
      return existing || {
        id: null,
        flatUnitId: unitId,
        year,
        month,
        status: 'VACANT',
        rentAmount: null,
        paymentMethod: null,
        chequeNumber: null,
        bankName: null,
        paymentDate: null,
        isPaid: false,
        notes: null
      }
    })

    // Calculate yearly summary
    const paidMonths = records.filter(r => r.isPaid).length
    const totalIncome = records.reduce((sum, r) => sum + (r.rentAmount || 0), 0)
    const occupiedMonths = records.filter(r => r.status === 'OCCUPIED').length

    return NextResponse.json({
      success: true,
      data: monthlyData,
      year,
      summary: {
        paidMonths,
        totalIncome,
        occupiedMonths,
        vacantMonths: 12 - occupiedMonths
      }
    })
  } catch (error) {
    console.error('Error fetching monthly records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monthly records' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units/[unitId]/monthly-records
 * Create or update a monthly record
 */
export async function POST(
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

    // Verify unit exists
    const unit = await prisma.flatUnit.findUnique({
      where: { id: unitId }
    })

    if (!unit) {
      return NextResponse.json(
        { success: false, error: 'Flat unit not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { year, month } = body

    // Upsert the monthly record
    const record = await prisma.flatMonthlyRecord.upsert({
      where: {
        flatUnitId_year_month: {
          flatUnitId: unitId,
          year,
          month
        }
      },
      update: {
        status: body.status,
        rentAmount: body.rentAmount,
        paymentMethod: body.paymentMethod,
        chequeNumber: body.chequeNumber,
        bankName: body.bankName,
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        isPaid: body.isPaid || false,
        notes: body.notes
      },
      create: {
        flatUnitId: unitId,
        year,
        month,
        status: body.status || 'VACANT',
        rentAmount: body.rentAmount,
        paymentMethod: body.paymentMethod,
        chequeNumber: body.chequeNumber,
        bankName: body.bankName,
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        isPaid: body.isPaid || false,
        notes: body.notes
      }
    })

    return NextResponse.json({
      success: true,
      data: record
    })
  } catch (error) {
    console.error('Error saving monthly record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save monthly record' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units/[unitId]/monthly-records
 * Bulk update monthly records
 */
export async function PUT(
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

    const body = await request.json()
    const { records } = body // Array of monthly records

    if (!Array.isArray(records)) {
      return NextResponse.json(
        { success: false, error: 'Records must be an array' },
        { status: 400 }
      )
    }

    // Update each record
    const results = await Promise.all(
      records.map(async (record: any) => {
        return prisma.flatMonthlyRecord.upsert({
          where: {
            flatUnitId_year_month: {
              flatUnitId: unitId,
              year: record.year,
              month: record.month
            }
          },
          update: {
            status: record.status,
            rentAmount: record.rentAmount,
            paymentMethod: record.paymentMethod,
            chequeNumber: record.chequeNumber,
            bankName: record.bankName,
            paymentDate: record.paymentDate ? new Date(record.paymentDate) : null,
            isPaid: record.isPaid || false,
            notes: record.notes
          },
          create: {
            flatUnitId: unitId,
            year: record.year,
            month: record.month,
            status: record.status || 'VACANT',
            rentAmount: record.rentAmount,
            paymentMethod: record.paymentMethod,
            chequeNumber: record.chequeNumber,
            bankName: record.bankName,
            paymentDate: record.paymentDate ? new Date(record.paymentDate) : null,
            isPaid: record.isPaid || false,
            notes: record.notes
          }
        })
      })
    )

    return NextResponse.json({
      success: true,
      data: results,
      message: `Updated ${results.length} monthly records`
    })
  } catch (error) {
    console.error('Error bulk updating monthly records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to bulk update monthly records' },
      { status: 500 }
    )
  }
}
