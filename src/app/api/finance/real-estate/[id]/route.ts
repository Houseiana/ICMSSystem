import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate/[id]
 * Get a single property with tenants
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const property = await prisma.realEstate.findUnique({
      where: { id },
      include: {
        tenants: {
          orderBy: { createdAt: 'desc' },
          include: {
            payments: {
              orderBy: { paymentDate: 'desc' },
              take: 5
            }
          }
        },
        flatTypes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Calculate summary
    const activeTenants = property.tenants.filter(t => t.status === 'ACTIVE')
    const totalRent = activeTenants.reduce((sum, t) => sum + t.rentAmount, 0)

    return NextResponse.json({
      success: true,
      data: property,
      summary: {
        totalTenants: property.tenants.length,
        activeTenants: activeTenants.length,
        totalMonthlyRent: totalRent
      }
    })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/finance/real-estate/[id]
 * Update a property
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const existing = await prisma.realEstate.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    const property = await prisma.realEstate.update({
      where: { id },
      data: {
        propertyName: body.propertyName,
        propertyType: body.propertyType,
        subType: body.subType,
        description: body.description,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
        coordinates: body.coordinates,
        ownershipType: body.ownershipType,
        ownershipPercentage: body.ownershipPercentage,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        purchasePrice: body.purchasePrice,
        currentValue: body.currentValue,
        valuationDate: body.valuationDate ? new Date(body.valuationDate) : null,
        totalArea: body.totalArea,
        builtUpArea: body.builtUpArea,
        landArea: body.landArea,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        parkingSpaces: body.parkingSpaces,
        floors: body.floors,
        yearBuilt: body.yearBuilt,
        totalFlats: body.totalFlats,
        currency: body.currency,
        monthlyRent: body.monthlyRent,
        rentalYield: body.rentalYield,
        maintenanceCost: body.maintenanceCost,
        propertyTax: body.propertyTax,
        insuranceCost: body.insuranceCost,
        hasMortgage: body.hasMortgage,
        mortgageProvider: body.mortgageProvider,
        mortgageAmount: body.mortgageAmount,
        mortgageBalance: body.mortgageBalance,
        mortgageRate: body.mortgageRate,
        mortgageStartDate: body.mortgageStartDate ? new Date(body.mortgageStartDate) : null,
        mortgageEndDate: body.mortgageEndDate ? new Date(body.mortgageEndDate) : null,
        monthlyPayment: body.monthlyPayment,
        isRented: body.isRented,
        tenantName: body.tenantName,
        tenantContact: body.tenantContact,
        leaseStartDate: body.leaseStartDate ? new Date(body.leaseStartDate) : null,
        leaseEndDate: body.leaseEndDate ? new Date(body.leaseEndDate) : null,
        securityDeposit: body.securityDeposit,
        titleDeedUrl: body.titleDeedUrl,
        purchaseContractUrl: body.purchaseContractUrl,
        valuationReportUrl: body.valuationReportUrl,
        insurancePolicyUrl: body.insurancePolicyUrl,
        status: body.status,
        notes: body.notes,
        tags: body.tags
      }
    })

    return NextResponse.json({
      success: true,
      data: property
    })
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/finance/real-estate/[id]
 * Delete a property
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const existing = await prisma.realEstate.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    await prisma.realEstate.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
