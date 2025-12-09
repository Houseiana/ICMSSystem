import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/dividends
 * Get all dividends
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sourceType = searchParams.get('sourceType')
    const year = searchParams.get('year')

    const where: any = {}
    if (sourceType) where.sourceType = sourceType
    if (year) {
      where.paymentDate = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      }
    }

    const dividends = await prisma.dividend.findMany({
      where,
      orderBy: { paymentDate: 'desc' }
    })

    // Calculate totals
    const totalGross = dividends.reduce((sum, d) => sum + d.grossAmount, 0)
    const totalNet = dividends.reduce((sum, d) => sum + d.netAmount, 0)
    const totalTax = dividends.reduce((sum, d) => sum + (d.taxWithheld || 0), 0)

    return NextResponse.json({
      success: true,
      data: dividends,
      count: dividends.length,
      summary: {
        totalGrossAmount: totalGross,
        totalNetAmount: totalNet,
        totalTaxWithheld: totalTax,
        totalDividends: dividends.length
      }
    })
  } catch (error) {
    console.error('Error fetching dividends:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dividends' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/dividends
 * Create a new dividend record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const dividend = await prisma.dividend.create({
      data: {
        sourceType: body.sourceType,
        sourceName: body.sourceName,
        ticker: body.ticker,
        assetId: body.assetId,
        sharesOwned: body.sharesOwned,
        ownershipPercentage: body.ownershipPercentage,
        dividendType: body.dividendType || 'CASH',
        dividendFrequency: body.dividendFrequency,
        grossAmount: body.grossAmount,
        taxWithheld: body.taxWithheld,
        netAmount: body.netAmount || (body.grossAmount - (body.taxWithheld || 0)),
        currency: body.currency || 'USD',
        dividendPerShare: body.dividendPerShare,
        declarationDate: body.declarationDate ? new Date(body.declarationDate) : null,
        exDividendDate: body.exDividendDate ? new Date(body.exDividendDate) : null,
        recordDate: body.recordDate ? new Date(body.recordDate) : null,
        paymentDate: new Date(body.paymentDate),
        paymentMethod: body.paymentMethod,
        transactionRef: body.transactionRef,
        taxYear: body.taxYear,
        taxReportable: body.taxReportable ?? true,
        notes: body.notes
      }
    })

    return NextResponse.json({
      success: true,
      data: dividend
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating dividend:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create dividend' },
      { status: 500 }
    )
  }
}
