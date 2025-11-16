import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employerId = parseInt(params.id)

    const contacts = await prisma.employerContact.findMany({
      where: { employerId },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(contacts)

  } catch (error) {
    console.error('Error fetching employer contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employerId = parseInt(params.id)
    const body = await request.json()

    // Check if employer exists
    const employer = await prisma.employer.findUnique({
      where: { id: employerId }
    })

    if (!employer) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    // Generate full name
    const fullName = body.firstName && body.lastName
      ? `${body.firstName}${body.middleName ? ' ' + body.middleName : ''} ${body.lastName}`.trim()
      : body.firstName || body.lastName || ''

    // If this is set as primary, remove primary from other contacts
    if (body.isPrimary) {
      await prisma.employerContact.updateMany({
        where: {
          employerId,
          isPrimary: true
        },
        data: {
          isPrimary: false
        }
      })
    }

    const contact = await prisma.employerContact.create({
      data: {
        ...body,
        employerId,
        fullName
      }
    })

    return NextResponse.json(contact, { status: 201 })

  } catch (error) {
    console.error('Error creating employer contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}