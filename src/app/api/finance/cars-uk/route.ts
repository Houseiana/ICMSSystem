import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/cars-uk
 * Get all UK cars
 */
export async function GET() {
  try {
    const cars = await prisma.carUK.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        expenses: {
          orderBy: { expenseDate: 'desc' },
          take: 5
        }
      }
    })

    // Calculate total value
    const totalValue = cars.reduce((sum, car) => sum + (car.currentValue || car.purchasePrice || 0), 0)
    const activeCars = cars.filter(c => c.status === 'ACTIVE')

    return NextResponse.json({
      success: true,
      data: cars,
      count: cars.length,
      summary: {
        totalCars: cars.length,
        activeCars: activeCars.length,
        totalValue
      }
    })
  } catch (error) {
    console.error('Error fetching UK cars:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch UK cars' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/cars-uk
 * Create a new UK car
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const car = await prisma.carUK.create({
      data: {
        vehicleName: body.vehicleName,
        make: body.make,
        model: body.model,
        year: body.year,
        variant: body.variant,
        vin: body.vin,
        licensePlate: body.licensePlate,
        color: body.color,
        interiorColor: body.interiorColor,
        vehicleType: body.vehicleType || 'SEDAN',
        fuelType: body.fuelType,
        transmission: body.transmission,
        engineSize: body.engineSize,
        horsepower: body.horsepower,
        cylinders: body.cylinders,
        mileage: body.mileage,
        mileageUnit: body.mileageUnit || 'MILES',
        ownershipType: body.ownershipType || 'OWNED',
        ownershipPercentage: body.ownershipPercentage,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        purchasePrice: body.purchasePrice,
        currentValue: body.currentValue,
        valuationDate: body.valuationDate ? new Date(body.valuationDate) : null,
        currency: body.currency || 'GBP',
        registrationNumber: body.registrationNumber,
        registrationExpiry: body.registrationExpiry ? new Date(body.registrationExpiry) : null,
        motExpiry: body.motExpiry ? new Date(body.motExpiry) : null,
        taxExpiry: body.taxExpiry ? new Date(body.taxExpiry) : null,
        isInsured: body.isInsured || false,
        insuranceProvider: body.insuranceProvider,
        insurancePolicyNo: body.insurancePolicyNo,
        insuranceType: body.insuranceType,
        insuranceExpiry: body.insuranceExpiry ? new Date(body.insuranceExpiry) : null,
        insurancePremium: body.insurancePremium,
        insuranceCoverage: body.insuranceCoverage,
        isFinanced: body.isFinanced || false,
        financeProvider: body.financeProvider,
        financeAmount: body.financeAmount,
        financeBalance: body.financeBalance,
        interestRate: body.interestRate,
        monthlyPayment: body.monthlyPayment,
        financeStartDate: body.financeStartDate ? new Date(body.financeStartDate) : null,
        financeEndDate: body.financeEndDate ? new Date(body.financeEndDate) : null,
        congestionZone: body.congestionZone || false,
        ulezCompliant: body.ulezCompliant !== false,
        currentLocation: body.currentLocation,
        city: body.city || 'London',
        parkingDetails: body.parkingDetails,
        v5cDocUrl: body.v5cDocUrl,
        motCertificateUrl: body.motCertificateUrl,
        insuranceDocUrl: body.insuranceDocUrl,
        purchaseReceiptUrl: body.purchaseReceiptUrl,
        serviceHistoryUrl: body.serviceHistoryUrl,
        photosUrls: body.photosUrls,
        registeredKeeper: body.registeredKeeper,
        keeperAddress: body.keeperAddress,
        assignedDriverName: body.assignedDriverName,
        assignedDriverPhone: body.assignedDriverPhone,
        status: body.status || 'ACTIVE',
        notes: body.notes,
        tags: body.tags
      }
    })

    return NextResponse.json({
      success: true,
      data: car
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating UK car:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create UK car' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/finance/cars-uk
 * Update a UK car (requires id in body)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Car ID is required' },
        { status: 400 }
      )
    }

    const existing = await prisma.carUK.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'UK Car not found' },
        { status: 404 }
      )
    }

    const car = await prisma.carUK.update({
      where: { id },
      data: {
        vehicleName: data.vehicleName,
        make: data.make,
        model: data.model,
        year: data.year,
        variant: data.variant,
        vin: data.vin,
        licensePlate: data.licensePlate,
        color: data.color,
        interiorColor: data.interiorColor,
        vehicleType: data.vehicleType,
        fuelType: data.fuelType,
        transmission: data.transmission,
        engineSize: data.engineSize,
        horsepower: data.horsepower,
        cylinders: data.cylinders,
        mileage: data.mileage,
        mileageUnit: data.mileageUnit,
        ownershipType: data.ownershipType,
        ownershipPercentage: data.ownershipPercentage,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchasePrice: data.purchasePrice,
        currentValue: data.currentValue,
        valuationDate: data.valuationDate ? new Date(data.valuationDate) : null,
        currency: data.currency,
        registrationNumber: data.registrationNumber,
        registrationExpiry: data.registrationExpiry ? new Date(data.registrationExpiry) : null,
        motExpiry: data.motExpiry ? new Date(data.motExpiry) : null,
        taxExpiry: data.taxExpiry ? new Date(data.taxExpiry) : null,
        isInsured: data.isInsured,
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNo: data.insurancePolicyNo,
        insuranceType: data.insuranceType,
        insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : null,
        insurancePremium: data.insurancePremium,
        insuranceCoverage: data.insuranceCoverage,
        isFinanced: data.isFinanced,
        financeProvider: data.financeProvider,
        financeAmount: data.financeAmount,
        financeBalance: data.financeBalance,
        interestRate: data.interestRate,
        monthlyPayment: data.monthlyPayment,
        financeStartDate: data.financeStartDate ? new Date(data.financeStartDate) : null,
        financeEndDate: data.financeEndDate ? new Date(data.financeEndDate) : null,
        congestionZone: data.congestionZone,
        ulezCompliant: data.ulezCompliant,
        currentLocation: data.currentLocation,
        city: data.city,
        parkingDetails: data.parkingDetails,
        v5cDocUrl: data.v5cDocUrl,
        motCertificateUrl: data.motCertificateUrl,
        insuranceDocUrl: data.insuranceDocUrl,
        purchaseReceiptUrl: data.purchaseReceiptUrl,
        serviceHistoryUrl: data.serviceHistoryUrl,
        photosUrls: data.photosUrls,
        registeredKeeper: data.registeredKeeper,
        keeperAddress: data.keeperAddress,
        assignedDriverName: data.assignedDriverName,
        assignedDriverPhone: data.assignedDriverPhone,
        status: data.status,
        disposalDate: data.disposalDate ? new Date(data.disposalDate) : null,
        salePrice: data.salePrice,
        notes: data.notes,
        tags: data.tags
      }
    })

    return NextResponse.json({
      success: true,
      data: car
    })
  } catch (error) {
    console.error('Error updating UK car:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update UK car' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/finance/cars-uk
 * Delete a UK car (requires id in query params)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Car ID is required' },
        { status: 400 }
      )
    }

    const carId = parseInt(id)

    const existing = await prisma.carUK.findUnique({
      where: { id: carId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'UK Car not found' },
        { status: 404 }
      )
    }

    await prisma.carUK.delete({
      where: { id: carId }
    })

    return NextResponse.json({
      success: true,
      message: 'UK Car deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting UK car:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete UK car' },
      { status: 500 }
    )
  }
}
