import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/real-estate
 * Get all real estate properties
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const propertyType = searchParams.get('propertyType')

    const where: any = {}
    if (status) where.status = status
    if (propertyType) where.propertyType = propertyType

    const properties = await prisma.realEstate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        flatTypes: true
      }
    })

    // Calculate totals
    const totalValue = properties.reduce((sum, p) => sum + (p.currentValue || 0), 0)
    const totalRent = properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0)

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length,
      summary: {
        totalValue,
        totalMonthlyRent: totalRent,
        totalProperties: properties.length
      }
    })
  } catch (error) {
    console.error('Error fetching real estate:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch real estate' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/real-estate
 * Create a new real estate property
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const property = await prisma.realEstate.create({
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
        ownershipType: body.ownershipType || 'OWNED',
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
        currency: body.currency || 'USD',
        monthlyRent: body.monthlyRent,
        rentalYield: body.rentalYield,
        maintenanceCost: body.maintenanceCost,
        propertyTax: body.propertyTax,
        insuranceCost: body.insuranceCost,
        hasMortgage: body.hasMortgage || false,
        mortgageProvider: body.mortgageProvider,
        mortgageAmount: body.mortgageAmount,
        mortgageBalance: body.mortgageBalance,
        mortgageRate: body.mortgageRate,
        mortgageStartDate: body.mortgageStartDate ? new Date(body.mortgageStartDate) : null,
        mortgageEndDate: body.mortgageEndDate ? new Date(body.mortgageEndDate) : null,
        monthlyPayment: body.monthlyPayment,
        isRented: body.isRented || false,
        tenantName: body.tenantName,
        tenantContact: body.tenantContact,
        leaseStartDate: body.leaseStartDate ? new Date(body.leaseStartDate) : null,
        leaseEndDate: body.leaseEndDate ? new Date(body.leaseEndDate) : null,
        securityDeposit: body.securityDeposit,
        titleDeedUrl: body.titleDeedUrl,
        purchaseContractUrl: body.purchaseContractUrl,
        valuationReportUrl: body.valuationReportUrl,
        insurancePolicyUrl: body.insurancePolicyUrl,
        status: body.status || 'ACTIVE',
        notes: body.notes,
        tags: body.tags
      }
    })

    return NextResponse.json({
      success: true,
      data: property
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating real estate:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create real estate' },
      { status: 500 }
    )
  }
}
