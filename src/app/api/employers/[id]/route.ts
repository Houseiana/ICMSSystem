import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const employer = await prisma.employer.findUnique({
      where: { id },
      include: {
        contacts: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'desc' }
          ]
        }
      }
    })

    if (!employer) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employer)

  } catch (error) {
    console.error('Error fetching employer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employer' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    // Check if employer exists
    const existingEmployer = await prisma.employer.findUnique({
      where: { id }
    })

    if (!existingEmployer) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    // Separate contacts from employer data
    const { contacts, ...employerData } = body

    // Generate full name for individual employers
    if (employerData.employerType === 'INDIVIDUAL' && employerData.firstName && employerData.lastName) {
      employerData.fullName = `${employerData.firstName}${employerData.middleName ? ' ' + employerData.middleName : ''} ${employerData.lastName}`.trim()
    }

    // Convert date strings to Date objects
    if (employerData.dateOfBirth) {
      employerData.dateOfBirth = new Date(employerData.dateOfBirth)
    }
    if (employerData.passportExpiry) {
      employerData.passportExpiry = new Date(employerData.passportExpiry)
    }
    if (employerData.visaValidFrom) {
      employerData.visaValidFrom = new Date(employerData.visaValidFrom)
    }
    if (employerData.visaValidTo) {
      employerData.visaValidTo = new Date(employerData.visaValidTo)
    }

    // Update employer
    const employer = await prisma.employer.update({
      where: { id },
      data: employerData,
      include: {
        contacts: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'desc' }
          ]
        }
      }
    })

    return NextResponse.json(employer)

  } catch (error) {
    console.error('Error updating employer:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'An employer with this registration number already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update employer' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Check if employer exists
    const existingEmployer = await prisma.employer.findUnique({
      where: { id },
      include: {
        contacts: true
      }
    })

    if (!existingEmployer) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    // Delete employer (this will cascade delete contacts due to onDelete: Cascade)
    await prisma.employer.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Employer deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting employer:', error)
    return NextResponse.json(
      { error: 'Failed to delete employer' },
      { status: 500 }
    )
  }
}