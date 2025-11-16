import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contractorId = parseInt(params.id)

    const contacts = await prisma.contractorContact.findMany({
      where: { contractorId },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contractor contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contractor contacts' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const contractorId = parseInt(params.id)

    const {
      firstName,
      lastName,
      jobTitle,
      department,
      email,
      phone,
      mobile,
      whatsapp,
      skype,
      preferredContact,
      bestTimeToCall,
      languages,
      isPrimary,
      responsibilities,
      authority,
      workingHours,
      emergencyContact,
      notes
    } = body

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Check if contractor exists
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    })

    if (!contractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }

    // If setting as primary, unset other primary contacts
    if (isPrimary) {
      await prisma.contractorContact.updateMany({
        where: { contractorId, isPrimary: true },
        data: { isPrimary: false }
      })
    }

    const contact = await prisma.contractorContact.create({
      data: {
        contractorId,
        firstName,
        lastName,
        jobTitle,
        department,
        email,
        phone,
        mobile,
        whatsapp,
        skype,
        preferredContact: preferredContact || 'EMAIL',
        bestTimeToCall,
        languages: languages ? JSON.stringify(languages) : null,
        isPrimary: isPrimary || false,
        responsibilities: responsibilities ? JSON.stringify(responsibilities) : null,
        authority,
        workingHours: workingHours ? JSON.stringify(workingHours) : null,
        emergencyContact: emergencyContact || false,
        notes
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Create contractor contact error:', error)
    return NextResponse.json(
      { error: 'Failed to create contractor contact' },
      { status: 500 }
    )
  }
}