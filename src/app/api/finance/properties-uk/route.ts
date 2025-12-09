import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/properties-uk
 * Get all UK properties
 */
export async function GET() {
  try {
    const properties = await prisma.propertyUK.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tenants: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // Calculate totals
    const totalValue = properties.reduce((sum, p) => sum + (p.currentValue || p.purchasePrice || 0), 0)
    const activeProperties = properties.filter(p => p.status === 'ACTIVE')
    const rentedProperties = properties.filter(p => p.isRented)
    const totalMonthlyRent = properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0)

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length,
      summary: {
        totalProperties: properties.length,
        activeProperties: activeProperties.length,
        rentedProperties: rentedProperties.length,
        totalValue,
        totalMonthlyRent
      }
    })
  } catch (error) {
    console.error('Error fetching UK properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch UK properties' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/properties-uk
 * Create a new UK property
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const property = await prisma.propertyUK.create({
      data: {
        propertyName: body.propertyName,
        propertyType: body.propertyType,
        subType: body.subType,
        description: body.description,
        address: body.address,
        addressLine2: body.addressLine2,
        city: body.city || 'London',
        county: body.county,
        postcode: body.postcode,
        coordinates: body.coordinates,
        ownershipType: body.ownershipType || 'FREEHOLD',
        ownershipPercentage: body.ownershipPercentage,
        leaseLength: body.leaseLength,
        leaseExpiry: body.leaseExpiry ? new Date(body.leaseExpiry) : null,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        purchasePrice: body.purchasePrice,
        currentValue: body.currentValue,
        valuationDate: body.valuationDate ? new Date(body.valuationDate) : null,
        currency: body.currency || 'GBP',
        totalArea: body.totalArea,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        receptionRooms: body.receptionRooms,
        parkingSpaces: body.parkingSpaces,
        floors: body.floors,
        yearBuilt: body.yearBuilt,
        epcRating: body.epcRating,
        councilTaxBand: body.councilTaxBand,
        monthlyRent: body.monthlyRent,
        rentalYield: body.rentalYield,
        groundRent: body.groundRent,
        serviceCharge: body.serviceCharge,
        managementFee: body.managementFee,
        councilTax: body.councilTax,
        insuranceCost: body.insuranceCost,
        hasMortgage: body.hasMortgage || false,
        mortgageProvider: body.mortgageProvider,
        mortgageType: body.mortgageType,
        mortgageAmount: body.mortgageAmount,
        mortgageBalance: body.mortgageBalance,
        mortgageRate: body.mortgageRate,
        mortgageStartDate: body.mortgageStartDate ? new Date(body.mortgageStartDate) : null,
        mortgageEndDate: body.mortgageEndDate ? new Date(body.mortgageEndDate) : null,
        monthlyPayment: body.monthlyPayment,
        ltv: body.ltv,
        isRented: body.isRented || false,
        tenantName: body.tenantName,
        tenantContact: body.tenantContact,
        tenantEmail: body.tenantEmail,
        leaseStartDate: body.leaseStartDate ? new Date(body.leaseStartDate) : null,
        leaseEndDate: body.leaseEndDate ? new Date(body.leaseEndDate) : null,
        securityDeposit: body.securityDeposit,
        depositScheme: body.depositScheme,
        rentPaymentDay: body.rentPaymentDay,
        managedBy: body.managedBy,
        managingAgentName: body.managingAgentName,
        managingAgentPhone: body.managingAgentPhone,
        managingAgentEmail: body.managingAgentEmail,
        managementFeePercent: body.managementFeePercent,
        gassSafetyCertExpiry: body.gassSafetyCertExpiry ? new Date(body.gassSafetyCertExpiry) : null,
        eicirExpiry: body.eicirExpiry ? new Date(body.eicirExpiry) : null,
        legionellaAssessment: body.legionellaAssessment ? new Date(body.legionellaAssessment) : null,
        smokeAlarms: body.smokeAlarms !== false,
        coAlarms: body.coAlarms !== false,
        rightToRentCheck: body.rightToRentCheck || false,
        titleDeedUrl: body.titleDeedUrl,
        purchaseContractUrl: body.purchaseContractUrl,
        epcCertificateUrl: body.epcCertificateUrl,
        mortgageOfferUrl: body.mortgageOfferUrl,
        insurancePolicyUrl: body.insurancePolicyUrl,
        gasCertificateUrl: body.gasCertificateUrl,
        eicirUrl: body.eicirUrl,
        tenancyAgreementUrl: body.tenancyAgreementUrl,
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
    console.error('Error creating UK property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create UK property' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/finance/properties-uk
 * Update a UK property (requires id in body)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      )
    }

    const existing = await prisma.propertyUK.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'UK Property not found' },
        { status: 404 }
      )
    }

    const property = await prisma.propertyUK.update({
      where: { id },
      data: {
        propertyName: data.propertyName,
        propertyType: data.propertyType,
        subType: data.subType,
        description: data.description,
        address: data.address,
        addressLine2: data.addressLine2,
        city: data.city,
        county: data.county,
        postcode: data.postcode,
        coordinates: data.coordinates,
        ownershipType: data.ownershipType,
        ownershipPercentage: data.ownershipPercentage,
        leaseLength: data.leaseLength,
        leaseExpiry: data.leaseExpiry ? new Date(data.leaseExpiry) : null,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchasePrice: data.purchasePrice,
        currentValue: data.currentValue,
        valuationDate: data.valuationDate ? new Date(data.valuationDate) : null,
        currency: data.currency,
        totalArea: data.totalArea,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        receptionRooms: data.receptionRooms,
        parkingSpaces: data.parkingSpaces,
        floors: data.floors,
        yearBuilt: data.yearBuilt,
        epcRating: data.epcRating,
        councilTaxBand: data.councilTaxBand,
        monthlyRent: data.monthlyRent,
        rentalYield: data.rentalYield,
        groundRent: data.groundRent,
        serviceCharge: data.serviceCharge,
        managementFee: data.managementFee,
        councilTax: data.councilTax,
        insuranceCost: data.insuranceCost,
        hasMortgage: data.hasMortgage,
        mortgageProvider: data.mortgageProvider,
        mortgageType: data.mortgageType,
        mortgageAmount: data.mortgageAmount,
        mortgageBalance: data.mortgageBalance,
        mortgageRate: data.mortgageRate,
        mortgageStartDate: data.mortgageStartDate ? new Date(data.mortgageStartDate) : null,
        mortgageEndDate: data.mortgageEndDate ? new Date(data.mortgageEndDate) : null,
        monthlyPayment: data.monthlyPayment,
        ltv: data.ltv,
        isRented: data.isRented,
        tenantName: data.tenantName,
        tenantContact: data.tenantContact,
        tenantEmail: data.tenantEmail,
        leaseStartDate: data.leaseStartDate ? new Date(data.leaseStartDate) : null,
        leaseEndDate: data.leaseEndDate ? new Date(data.leaseEndDate) : null,
        securityDeposit: data.securityDeposit,
        depositScheme: data.depositScheme,
        rentPaymentDay: data.rentPaymentDay,
        managedBy: data.managedBy,
        managingAgentName: data.managingAgentName,
        managingAgentPhone: data.managingAgentPhone,
        managingAgentEmail: data.managingAgentEmail,
        managementFeePercent: data.managementFeePercent,
        gassSafetyCertExpiry: data.gassSafetyCertExpiry ? new Date(data.gassSafetyCertExpiry) : null,
        eicirExpiry: data.eicirExpiry ? new Date(data.eicirExpiry) : null,
        legionellaAssessment: data.legionellaAssessment ? new Date(data.legionellaAssessment) : null,
        smokeAlarms: data.smokeAlarms,
        coAlarms: data.coAlarms,
        rightToRentCheck: data.rightToRentCheck,
        titleDeedUrl: data.titleDeedUrl,
        purchaseContractUrl: data.purchaseContractUrl,
        epcCertificateUrl: data.epcCertificateUrl,
        mortgageOfferUrl: data.mortgageOfferUrl,
        insurancePolicyUrl: data.insurancePolicyUrl,
        gasCertificateUrl: data.gasCertificateUrl,
        eicirUrl: data.eicirUrl,
        tenancyAgreementUrl: data.tenancyAgreementUrl,
        status: data.status,
        notes: data.notes,
        tags: data.tags
      }
    })

    return NextResponse.json({
      success: true,
      data: property
    })
  } catch (error) {
    console.error('Error updating UK property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update UK property' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/finance/properties-uk
 * Delete a UK property (requires id in query params)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      )
    }

    const propertyId = parseInt(id)

    const existing = await prisma.propertyUK.findUnique({
      where: { id: propertyId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'UK Property not found' },
        { status: 404 }
      )
    }

    await prisma.propertyUK.delete({
      where: { id: propertyId }
    })

    return NextResponse.json({
      success: true,
      message: 'UK Property deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting UK property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete UK property' },
      { status: 500 }
    )
  }
}
