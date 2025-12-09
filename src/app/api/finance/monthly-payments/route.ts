import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/monthly-payments
 * Get all monthly payments
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const paymentType = searchParams.get('paymentType')

    const where: any = {}
    if (status) where.status = status
    if (paymentType) where.paymentType = paymentType

    const payments = await prisma.monthlyPayment.findMany({
      where,
      include: {
        payments: {
          orderBy: { dueDate: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate totals
    const totalMonthly = payments.reduce((sum, p) => sum + p.amount, 0)
    const activePayments = payments.filter(p => p.status === 'ACTIVE')
    const totalActiveMonthly = activePayments.reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      success: true,
      data: payments,
      count: payments.length,
      summary: {
        totalMonthlyAmount: totalMonthly,
        totalActiveMonthly: totalActiveMonthly,
        totalPayments: payments.length,
        activePayments: activePayments.length
      }
    })
  } catch (error) {
    console.error('Error fetching monthly payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monthly payments' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/monthly-payments
 * Create a new monthly payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const payment = await prisma.monthlyPayment.create({
      data: {
        paymentName: body.paymentName,
        paymentType: body.paymentType,
        category: body.category,
        description: body.description,
        vendorName: body.vendorName,
        vendorContact: body.vendorContact,
        accountNumber: body.accountNumber,
        amount: body.amount,
        currency: body.currency || 'USD',
        isFixed: body.isFixed ?? true,
        averageAmount: body.averageAmount,
        frequency: body.frequency || 'MONTHLY',
        dueDay: body.dueDay,
        billingCycleStart: body.billingCycleStart,
        billingCycleEnd: body.billingCycleEnd,
        isAutoPay: body.isAutoPay || false,
        autoPayMethod: body.autoPayMethod,
        autoPayAccountLast4: body.autoPayAccountLast4,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : null,
        lastPaymentDate: body.lastPaymentDate ? new Date(body.lastPaymentDate) : null,
        lastPaymentAmount: body.lastPaymentAmount,
        reminderEnabled: body.reminderEnabled ?? true,
        reminderDaysBefore: body.reminderDaysBefore || 3,
        contractUrl: body.contractUrl,
        lastBillUrl: body.lastBillUrl,
        status: body.status || 'ACTIVE',
        notes: body.notes,
        tags: body.tags
      }
    })

    return NextResponse.json({
      success: true,
      data: payment
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating monthly payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create monthly payment' },
      { status: 500 }
    )
  }
}
