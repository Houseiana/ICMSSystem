import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate/[id]/tenants/[tenantId]
 * Get a single tenant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; tenantId: string } }
) {
  try {
    const tenantId = parseInt(params.tenantId)

    if (isNaN(tenantId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tenant ID' },
        { status: 400 }
      )
    }

    const tenant = await prisma.realEstateTenant.findUnique({
      where: { id: tenantId },
      include: {
        payments: {
          orderBy: { paymentDate: 'desc' }
        },
        realEstate: {
          select: {
            id: true,
            propertyName: true
          }
        }
      }
    })

    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: tenant
    })
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenant' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/finance/real-estate/[id]/tenants/[tenantId]
 * Update a tenant
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; tenantId: string } }
) {
  try {
    const tenantId = parseInt(params.tenantId)

    if (isNaN(tenantId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tenant ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.realEstateTenant.findUnique({
      where: { id: tenantId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const tenant = await prisma.realEstateTenant.update({
      where: { id: tenantId },
      data: {
        tenantName: body.tenantName,
        tenantPhone: body.tenantPhone,
        tenantEmail: body.tenantEmail,
        qidNumber: body.qidNumber,
        rentAmount: body.rentAmount,
        currency: body.currency,
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : undefined,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : undefined,
        securityDeposit: body.securityDeposit,
        paymentStatus: body.paymentStatus,
        lastPaymentDate: body.lastPaymentDate ? new Date(body.lastPaymentDate) : null,
        nextPaymentDate: body.nextPaymentDate ? new Date(body.nextPaymentDate) : null,
        unitNumber: body.unitNumber,
        notes: body.notes,
        contractUrl: body.contractUrl,
        qidDocumentUrl: body.qidDocumentUrl,
        status: body.status
      }
    })

    return NextResponse.json({
      success: true,
      data: tenant
    })
  } catch (error) {
    console.error('Error updating tenant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tenant' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/finance/real-estate/[id]/tenants/[tenantId]
 * Delete a tenant
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; tenantId: string } }
) {
  try {
    const propertyId = parseInt(params.id)
    const tenantId = parseInt(params.tenantId)

    if (isNaN(tenantId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tenant ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.realEstateTenant.findUnique({
      where: { id: tenantId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      )
    }

    await prisma.realEstateTenant.delete({
      where: { id: tenantId }
    })

    // Check if property still has tenants
    const remainingTenants = await prisma.realEstateTenant.count({
      where: { realEstateId: propertyId, status: 'ACTIVE' }
    })

    if (remainingTenants === 0) {
      await prisma.realEstate.update({
        where: { id: propertyId },
        data: { isRented: false }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Tenant deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tenant' },
      { status: 500 }
    )
  }
}
