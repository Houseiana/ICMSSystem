import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/finance/salaries
 * Get all salary records
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const personType = searchParams.get('personType')

    const where: any = {}
    if (status) where.status = status
    if (personType) where.personType = personType

    const salaries = await prisma.salary.findMany({
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
    const totalGross = salaries.reduce((sum, s) => sum + (s.grossSalary || s.baseSalary || 0), 0)
    const totalNet = salaries.reduce((sum, s) => sum + (s.netSalary || 0), 0)

    return NextResponse.json({
      success: true,
      data: salaries,
      count: salaries.length,
      summary: {
        totalGrossSalary: totalGross,
        totalNetSalary: totalNet,
        totalRecords: salaries.length
      }
    })
  } catch (error) {
    console.error('Error fetching salaries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/finance/salaries
 * Create a new salary record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Calculate gross and net salary
    const allowances = (body.housingAllowance || 0) + (body.transportAllowance || 0) +
                       (body.mealAllowance || 0) + (body.phoneAllowance || 0) + (body.otherAllowances || 0)
    const deductions = (body.taxDeduction || 0) + (body.socialSecurity || 0) +
                       (body.pensionContribution || 0) + (body.healthInsurance || 0) + (body.otherDeductions || 0)
    const grossSalary = body.baseSalary + allowances
    const netSalary = grossSalary - deductions

    const salary = await prisma.salary.create({
      data: {
        personType: body.personType,
        personId: body.personId,
        personName: body.personName,
        position: body.position,
        department: body.department,
        employerId: body.employerId,
        employerName: body.employerName,
        salaryType: body.salaryType || 'MONTHLY',
        baseSalary: body.baseSalary,
        currency: body.currency || 'USD',
        housingAllowance: body.housingAllowance,
        transportAllowance: body.transportAllowance,
        mealAllowance: body.mealAllowance,
        phoneAllowance: body.phoneAllowance,
        otherAllowances: body.otherAllowances,
        allowanceDetails: body.allowanceDetails,
        taxDeduction: body.taxDeduction,
        socialSecurity: body.socialSecurity,
        pensionContribution: body.pensionContribution,
        healthInsurance: body.healthInsurance,
        otherDeductions: body.otherDeductions,
        deductionDetails: body.deductionDetails,
        grossSalary,
        netSalary,
        paymentFrequency: body.paymentFrequency || 'MONTHLY',
        paymentMethod: body.paymentMethod,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        effectiveDate: new Date(body.effectiveDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status || 'ACTIVE',
        notes: body.notes
      }
    })

    return NextResponse.json({
      success: true,
      data: salary
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating salary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create salary record' },
      { status: 500 }
    )
  }
}
