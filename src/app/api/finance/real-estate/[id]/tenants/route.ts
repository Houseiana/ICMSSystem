import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate/[id]/tenants
 * Get all tenants for a property
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

    const tenants = await prisma.realEstateTenant.findMany({
      where: { realEstateId: propertyId },
      include: {
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate totals
    const activeTenants = tenants.filter(t => t.status === 'ACTIVE')
    const totalRent = activeTenants.reduce((sum, t) => sum + t.rentAmount, 0)

    return NextResponse.json({
      success: true,
      data: tenants,
      count: tenants.length,
      summary: {
        totalTenants: tenants.length,
        activeTenants: activeTenants.length,
        totalMonthlyRent: totalRent
      }
    })
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenants' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/real-estate/[id]/tenants
 * Create a new tenant for a property
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

    const tenant = await prisma.realEstateTenant.create({
      data: {
        realEstateId: propertyId,
        tenantName: body.tenantName,
        tenantPhone: body.tenantPhone,
        tenantEmail: body.tenantEmail,
        qidNumber: body.qidNumber,
        rentAmount: body.rentAmount,
        currency: body.currency || 'QAR',
        contractStartDate: new Date(body.contractStartDate),
        contractEndDate: new Date(body.contractEndDate),
        securityDeposit: body.securityDeposit,
        paymentStatus: body.paymentStatus || 'ACTIVE',
        lastPaymentDate: body.lastPaymentDate ? new Date(body.lastPaymentDate) : null,
        nextPaymentDate: body.nextPaymentDate ? new Date(body.nextPaymentDate) : null,
        unitNumber: body.unitNumber,
        notes: body.notes,
        contractUrl: body.contractUrl,
        qidDocumentUrl: body.qidDocumentUrl,
        status: body.status || 'ACTIVE'
      }
    })

    // Update property isRented status
    await prisma.realEstate.update({
      where: { id: propertyId },
      data: { isRented: true }
    })

    return NextResponse.json({
      success: true,
      data: tenant
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tenant' },
      { status: 500 }
    )
  }
}
