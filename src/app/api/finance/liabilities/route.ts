import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/liabilities
 * Get all liabilities
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const liabilityType = searchParams.get('liabilityType')

    const where: any = {}
    if (status) where.status = status
    if (liabilityType) where.liabilityType = liabilityType

    const liabilities = await prisma.liability.findMany({
      where,
      include: {
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate totals
    const totalOriginal = liabilities.reduce((sum, l) => sum + l.originalAmount, 0)
    const totalBalance = liabilities.reduce((sum, l) => sum + l.currentBalance, 0)
    const totalPaid = totalOriginal - totalBalance

    return NextResponse.json({
      success: true,
      data: liabilities,
      count: liabilities.length,
      summary: {
        totalOriginalAmount: totalOriginal,
        totalCurrentBalance: totalBalance,
        totalPaid,
        totalLiabilities: liabilities.length
      }
    })
  } catch (error) {
    console.error('Error fetching liabilities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch liabilities' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/liabilities
 * Create a new liability
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const liability = await prisma.liability.create({
      data: {
        liabilityName: body.liabilityName,
        liabilityType: body.liabilityType,
        description: body.description,
        creditorName: body.creditorName,
        creditorContact: body.creditorContact,
        creditorAddress: body.creditorAddress,
        accountNumber: body.accountNumber,
        originalAmount: body.originalAmount,
        currentBalance: body.currentBalance || body.originalAmount,
        currency: body.currency || 'USD',
        interestRate: body.interestRate,
        interestType: body.interestType || 'FIXED',
        apr: body.apr,
        paymentFrequency: body.paymentFrequency || 'MONTHLY',
        minimumPayment: body.minimumPayment,
        regularPayment: body.regularPayment,
        startDate: new Date(body.startDate),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        nextPaymentDate: body.nextPaymentDate ? new Date(body.nextPaymentDate) : null,
        lastPaymentDate: body.lastPaymentDate ? new Date(body.lastPaymentDate) : null,
        lastPaymentAmount: body.lastPaymentAmount,
        isSecured: body.isSecured || false,
        collateralType: body.collateralType,
        collateralValue: body.collateralValue,
        collateralDetails: body.collateralDetails,
        contractUrl: body.contractUrl,
        statementUrl: body.statementUrl,
        status: body.status || 'ACTIVE',
        notes: body.notes,
        tags: body.tags
      }
    })

    return NextResponse.json({
      success: true,
      data: liability
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating liability:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create liability' },
      { status: 500 }
    )
  }
}
