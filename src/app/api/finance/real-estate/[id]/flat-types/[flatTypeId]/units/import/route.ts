import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * POST /api/finance/real-estate/[id]/flat-types/[flatTypeId]/units/import
 * Import flat units from JSON data (parsed from Excel/PDF on client side)
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
    const { units, monthlyRecords } = body

    // Validate units array
    if (!Array.isArray(units)) {
      return NextResponse.json(
        { success: false, error: 'Units must be an array' },
        { status: 400 }
      )
    }

    const createdUnits = []
    const errors = []

    for (const unit of units) {
      try {
        // Check if unit with same number already exists
        const existing = await prisma.flatUnit.findFirst({
          where: {
            flatTypeId,
            unitNumber: unit.unitNumber
          }
        })

        if (existing) {
          // Update existing unit
          const updated = await prisma.flatUnit.update({
            where: { id: existing.id },
            data: {
              floor: unit.floor,
              status: unit.status || existing.status,
              tenantName: unit.tenantName,
              tenantPhone: unit.tenantPhone,
              tenantQID: unit.tenantQID,
              waterAccountNo: unit.waterAccountNo,
              electricityAccountNo: unit.electricityAccountNo,
              contractStartDate: unit.contractStartDate ? new Date(unit.contractStartDate) : null,
              contractEndDate: unit.contractEndDate ? new Date(unit.contractEndDate) : null,
              monthlyRent: unit.monthlyRent,
              currency: unit.currency || 'QAR',
              guaranteeType: unit.guaranteeType,
              guaranteeAmount: unit.guaranteeAmount,
              guaranteeChequeNo: unit.guaranteeChequeNo,
              guaranteeBank: unit.guaranteeBank,
              notes: unit.notes
            }
          })
          createdUnits.push({ ...updated, action: 'updated' })
        } else {
          // Create new unit
          const created = await prisma.flatUnit.create({
            data: {
              flatTypeId,
              unitNumber: unit.unitNumber,
              floor: unit.floor,
              status: unit.status || 'VACANT',
              tenantName: unit.tenantName,
              tenantPhone: unit.tenantPhone,
              tenantQID: unit.tenantQID,
              waterAccountNo: unit.waterAccountNo,
              electricityAccountNo: unit.electricityAccountNo,
              contractStartDate: unit.contractStartDate ? new Date(unit.contractStartDate) : null,
              contractEndDate: unit.contractEndDate ? new Date(unit.contractEndDate) : null,
              monthlyRent: unit.monthlyRent,
              currency: unit.currency || 'QAR',
              guaranteeType: unit.guaranteeType,
              guaranteeAmount: unit.guaranteeAmount,
              guaranteeChequeNo: unit.guaranteeChequeNo,
              guaranteeBank: unit.guaranteeBank,
              notes: unit.notes
            }
          })
          createdUnits.push({ ...created, action: 'created' })
        }
      } catch (err: any) {
        errors.push({
          unitNumber: unit.unitNumber,
          error: err.message
        })
      }
    }

    // Import monthly records if provided
    if (Array.isArray(monthlyRecords) && monthlyRecords.length > 0) {
      for (const record of monthlyRecords) {
        try {
          // Find the unit by number
          const unit = await prisma.flatUnit.findFirst({
            where: {
              flatTypeId,
              unitNumber: record.unitNumber
            }
          })

          if (unit) {
            await prisma.flatMonthlyRecord.upsert({
              where: {
                flatUnitId_year_month: {
                  flatUnitId: unit.id,
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
                flatUnitId: unit.id,
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
          }
        } catch (err: any) {
          errors.push({
            unitNumber: record.unitNumber,
            month: record.month,
            year: record.year,
            error: err.message
          })
        }
      }
    }

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
      data: {
        imported: createdUnits.length,
        created: createdUnits.filter(u => u.action === 'created').length,
        updated: createdUnits.filter(u => u.action === 'updated').length,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Error importing flat units:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import flat units' },
      { status: 500 }
    )
  }
}
