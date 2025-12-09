import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/properties-uk/[id]/tenants
 * Get all tenants for a UK property
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

    const tenants = await prisma.propertyUKTenant.findMany({
      where: { propertyUKId: propertyId },
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
    console.error('Error fetching UK tenants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenants' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/properties-uk/[id]/tenants
 * Create a new tenant for a UK property
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
    const property = await prisma.propertyUK.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const tenant = await prisma.propertyUKTenant.create({
      data: {
        propertyUKId: propertyId,
        tenantName: body.tenantName,
        tenantPhone: body.tenantPhone,
        tenantEmail: body.tenantEmail,
        nationalInsuranceNo: body.nationalInsuranceNo,
        rentAmount: body.rentAmount,
        currency: body.currency || 'GBP',
        contractStartDate: new Date(body.contractStartDate),
        contractEndDate: new Date(body.contractEndDate),
        securityDeposit: body.securityDeposit,
        depositScheme: body.depositScheme,
        depositReference: body.depositReference,
        paymentStatus: body.paymentStatus || 'ACTIVE',
        lastPaymentDate: body.lastPaymentDate ? new Date(body.lastPaymentDate) : null,
        nextPaymentDate: body.nextPaymentDate ? new Date(body.nextPaymentDate) : null,
        paymentDay: body.paymentDay,
        rightToRentChecked: body.rightToRentChecked || false,
        rightToRentDate: body.rightToRentDate ? new Date(body.rightToRentDate) : null,
        rightToRentExpiry: body.rightToRentExpiry ? new Date(body.rightToRentExpiry) : null,
        referencingCompleted: body.referencingCompleted || false,
        referencingProvider: body.referencingProvider,
        creditCheckPassed: body.creditCheckPassed || false,
        guarantorRequired: body.guarantorRequired || false,
        guarantorName: body.guarantorName,
        guarantorContact: body.guarantorContact,
        unitNumber: body.unitNumber,
        notes: body.notes,
        contractUrl: body.contractUrl,
        idDocumentUrl: body.idDocumentUrl,
        status: body.status || 'ACTIVE'
      }
    })

    // Update property isRented status
    await prisma.propertyUK.update({
      where: { id: propertyId },
      data: { isRented: true }
    })

    return NextResponse.json({
      success: true,
      data: tenant
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating UK tenant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tenant' },
      { status: 500 }
    )
  }
}
