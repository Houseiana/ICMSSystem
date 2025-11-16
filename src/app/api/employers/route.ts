import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const industry = searchParams.get('industry')
    const relationshipType = searchParams.get('relationshipType')
    const status = searchParams.get('status')
    const includeContacts = searchParams.get('includeContacts') === 'true'

    const where: any = {}

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { tradingName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { profession: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (industry) {
      where.industry = industry
    }

    if (relationshipType) {
      where.relationshipType = relationshipType
    }

    if (status) {
      where.status = status
    }

    const employers = await prisma.employer.findMany({
      where,
      include: {
        contacts: includeContacts ? {
          where: {
            status: 'ACTIVE'
          },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'desc' }
          ]
        } : false
      },
      orderBy: [
        { status: 'asc' },
        { companyName: 'asc' }
      ]
    })

    // Get summary statistics
    const stats = await prisma.employer.groupBy({
      by: ['status'],
      _count: true
    })

    const industries = await prisma.employer.findMany({
      select: { industry: true },
      distinct: ['industry'],
      where: { industry: { not: null } }
    })

    const relationshipTypes = await prisma.employer.findMany({
      select: { relationshipType: true },
      distinct: ['relationshipType'],
      where: { relationshipType: { not: null } }
    })

    return NextResponse.json({
      employers,
      stats: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count
        return acc
      }, {} as Record<string, number>),
      industries: industries.map(i => i.industry).filter(Boolean),
      relationshipTypes: relationshipTypes.map(r => r.relationshipType).filter(Boolean)
    })

  } catch (error) {
    console.error('Error fetching employers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract contacts and document URLs from body
    const {
      contacts,
      photoUrl,
      qidDocumentUrl,
      passportDocumentUrl,
      ...employerData
    } = body

    // Convert empty strings to null for all fields
    Object.keys(employerData).forEach(key => {
      if (employerData[key] === '' || employerData[key] === 'undefined' || employerData[key] === 'null') {
        employerData[key] = null
      }
    })

    // Generate full name for individual employers
    if (employerData.employerType === 'INDIVIDUAL' && employerData.firstName && employerData.lastName) {
      employerData.fullName = `${employerData.firstName}${employerData.middleName ? ' ' + employerData.middleName : ''} ${employerData.lastName}`.trim()
    }

    // Convert date strings to Date objects
    if (employerData.dateOfBirth) {
      employerData.dateOfBirth = new Date(employerData.dateOfBirth)
    }
    if (employerData.incorporationDate) {
      employerData.incorporationDate = new Date(employerData.incorporationDate)
    }
    if (employerData.relationshipStart) {
      employerData.relationshipStart = new Date(employerData.relationshipStart)
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

    // Convert numeric fields
    if (employerData.establishedYear) {
      employerData.establishedYear = parseInt(employerData.establishedYear)
    }
    if (employerData.contractValue) {
      employerData.contractValue = parseFloat(employerData.contractValue)
    }
    if (employerData.creditLimit) {
      employerData.creditLimit = parseFloat(employerData.creditLimit)
    }
    if (employerData.insuranceCoverage) {
      employerData.insuranceCoverage = parseFloat(employerData.insuranceCoverage)
    }
    if (employerData.budgetAuthority) {
      employerData.budgetAuthority = parseFloat(employerData.budgetAuthority)
    }
    if (employerData.innovationIndex) {
      employerData.innovationIndex = parseFloat(employerData.innovationIndex)
    }

    // Prepare contacts data
    const contactsData = contacts ? contacts.map((contact: any) => {
      // Convert empty strings to null for contact fields
      Object.keys(contact).forEach(key => {
        if (contact[key] === '' || contact[key] === 'undefined' || contact[key] === 'null') {
          contact[key] = null
        }
      })

      const contactData = {
        ...contact,
        fullName: contact.firstName && contact.lastName
          ? `${contact.firstName}${contact.middleName ? ' ' + contact.middleName : ''} ${contact.lastName}`.trim()
          : contact.firstName || contact.lastName || ''
      }

      // Convert contact numeric fields
      if (contactData.yearsAtCompany) {
        contactData.yearsAtCompany = parseInt(contactData.yearsAtCompany)
      }
      if (contactData.totalExperience) {
        contactData.totalExperience = parseInt(contactData.totalExperience)
      }
      if (contactData.budgetAuthority) {
        contactData.budgetAuthority = parseFloat(contactData.budgetAuthority)
      }
      if (contactData.responsivenessRating) {
        contactData.responsivenessRating = parseFloat(contactData.responsivenessRating)
      }
      if (contactData.helpfulnessRating) {
        contactData.helpfulnessRating = parseFloat(contactData.helpfulnessRating)
      }
      if (contactData.professionalismRating) {
        contactData.professionalismRating = parseFloat(contactData.professionalismRating)
      }
      if (contactData.knowledgeRating) {
        contactData.knowledgeRating = parseFloat(contactData.knowledgeRating)
      }

      // Convert contact date fields
      if (contactData.birthDate) {
        contactData.birthDate = new Date(contactData.birthDate)
      }
      if (contactData.lastContact) {
        contactData.lastContact = new Date(contactData.lastContact)
      }
      if (contactData.startDate) {
        contactData.startDate = new Date(contactData.startDate)
      }
      if (contactData.endDate) {
        contactData.endDate = new Date(contactData.endDate)
      }
      if (contactData.lastMeetingDate) {
        contactData.lastMeetingDate = new Date(contactData.lastMeetingDate)
      }

      return contactData
    }) : undefined

    const employer = await prisma.employer.create({
      data: {
        ...employerData,
        photoUrl,
        qidDocumentUrl,
        passportDocumentUrl,
        contacts: contactsData ? {
          create: contactsData
        } : undefined
      },
      include: {
        contacts: true
      }
    })

    return NextResponse.json(employer, { status: 201 })

  } catch (error) {
    console.error('Error creating employer:', error)
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'An employer with this registration number already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create employer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}