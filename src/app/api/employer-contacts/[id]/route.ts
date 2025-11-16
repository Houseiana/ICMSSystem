import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const contact = await prisma.employerContact.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            tradingName: true
          }
        }
      }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(contact)

  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
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

    // Check if contact exists
    const existingContact = await prisma.employerContact.findUnique({
      where: { id },
      include: { employer: true }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Generate full name
    const fullName = body.firstName && body.lastName
      ? `${body.firstName}${body.middleName ? ' ' + body.middleName : ''} ${body.lastName}`.trim()
      : body.firstName || body.lastName || ''

    // If this is set as primary, remove primary from other contacts for the same employer
    if (body.isPrimary && !existingContact.isPrimary) {
      await prisma.employerContact.updateMany({
        where: {
          employerId: existingContact.employerId,
          isPrimary: true,
          id: { not: id }
        },
        data: {
          isPrimary: false
        }
      })
    }

    const contact = await prisma.employerContact.update({
      where: { id },
      data: {
        ...body,
        fullName
      },
      include: {
        employer: {
          select: {
            id: true,
            companyName: true,
            tradingName: true
          }
        }
      }
    })

    return NextResponse.json(contact)

  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
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

    // Check if contact exists
    const existingContact = await prisma.employerContact.findUnique({
      where: { id }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    // Delete contact
    await prisma.employerContact.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Contact deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}