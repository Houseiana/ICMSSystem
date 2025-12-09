import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/assets
 * Get all assets
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const assetType = searchParams.get('assetType')

    const where: any = {}
    if (status) where.status = status
    if (assetType) where.assetType = assetType

    const assets = await prisma.asset.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Calculate totals
    const totalValue = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0)
    const totalPurchasePrice = assets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0)

    return NextResponse.json({
      success: true,
      data: assets,
      count: assets.length,
      summary: {
        totalCurrentValue: totalValue,
        totalPurchasePrice,
        totalAssets: assets.length,
        appreciation: totalValue - totalPurchasePrice
      }
    })
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/assets
 * Create a new asset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const asset = await prisma.asset.create({
      data: {
        assetName: body.assetName,
        assetType: body.assetType,
        category: body.category,
        description: body.description,
        serialNumber: body.serialNumber,
        model: body.model,
        manufacturer: body.manufacturer,
        ownerType: body.ownerType,
        ownerId: body.ownerId,
        ownerName: body.ownerName,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        purchasePrice: body.purchasePrice,
        currentValue: body.currentValue,
        valuationDate: body.valuationDate ? new Date(body.valuationDate) : null,
        currency: body.currency || 'USD',
        depreciationRate: body.depreciationRate,
        depreciatedValue: body.depreciatedValue,
        investmentType: body.investmentType,
        ticker: body.ticker,
        quantity: body.quantity,
        pricePerUnit: body.pricePerUnit,
        location: body.location,
        storageDetails: body.storageDetails,
        isInsured: body.isInsured || false,
        insuranceProvider: body.insuranceProvider,
        insurancePolicyNo: body.insurancePolicyNo,
        insuranceValue: body.insuranceValue,
        insuranceExpiry: body.insuranceExpiry ? new Date(body.insuranceExpiry) : null,
        hasWarranty: body.hasWarranty || false,
        warrantyProvider: body.warrantyProvider,
        warrantyExpiry: body.warrantyExpiry ? new Date(body.warrantyExpiry) : null,
        purchaseReceiptUrl: body.purchaseReceiptUrl,
        warrantyDocUrl: body.warrantyDocUrl,
        insuranceDocUrl: body.insuranceDocUrl,
        photosUrls: body.photosUrls,
        status: body.status || 'ACTIVE',
        disposalDate: body.disposalDate ? new Date(body.disposalDate) : null,
        disposalAmount: body.disposalAmount,
        disposalMethod: body.disposalMethod,
        notes: body.notes,
        tags: body.tags
      }
    })

    return NextResponse.json({
      success: true,
      data: asset
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create asset' },
      { status: 500 }
    )
  }
}
