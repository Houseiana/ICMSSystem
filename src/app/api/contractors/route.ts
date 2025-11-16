import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const country = searchParams.get('country')
    const status = searchParams.get('status') || 'ACTIVE'

    const where: any = {
      status
    }

    if (type) {
      where.type = type
    }

    if (country) {
      where.country = country
    }

    const contractors = await prisma.contractor.findMany({
      where,
      include: {
        contacts: {
          where: { status: 'ACTIVE' },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      },
      orderBy: [
        { contractType: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(contractors)
  } catch (error) {
    console.error('Error fetching contractors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contractors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      type,
      category,
      description,
      address,
      city,
      state,
      country,
      postalCode,
      timeZone,
      website,
      mainEmail,
      mainPhone,
      faxNumber,
      services,
      businessHours,
      languages,
      paymentMethods,
      starRating,
      certifications,
      specialFeatures,
      establishedYear,
      employeeCount,
      annualRevenue,
      contractType,
      contractStart,
      contractEnd,
      commissionRate,
      creditTerms,
      notes,
      tags,
      emergency24h,
      supportEmail,
      supportPhone,
      contacts
    } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Check for existing contractor with same name and type
    const existingContractor = await prisma.contractor.findFirst({
      where: {
        name,
        type,
        country: country || undefined
      }
    })

    if (existingContractor) {
      return NextResponse.json(
        { error: 'Contractor with this name and type already exists in this location' },
        { status: 409 }
      )
    }

    const contractor = await prisma.contractor.create({
      data: {
        name,
        type,
        category,
        description,
        address,
        city,
        state,
        country,
        postalCode,
        timeZone,
        website,
        mainEmail,
        mainPhone,
        faxNumber,
        services: services ? JSON.stringify(services) : null,
        businessHours: businessHours ? JSON.stringify(businessHours) : null,
        languages: languages ? JSON.stringify(languages) : null,
        paymentMethods: paymentMethods ? JSON.stringify(paymentMethods) : null,
        starRating: starRating ? parseInt(starRating) : null,
        certifications: certifications ? JSON.stringify(certifications) : null,
        specialFeatures: specialFeatures ? JSON.stringify(specialFeatures) : null,
        establishedYear: establishedYear ? parseInt(establishedYear) : null,
        employeeCount,
        annualRevenue,
        contractType,
        contractStart: contractStart ? new Date(contractStart) : null,
        contractEnd: contractEnd ? new Date(contractEnd) : null,
        commissionRate: commissionRate ? parseFloat(commissionRate) : null,
        creditTerms,
        notes,
        tags: tags ? JSON.stringify(tags) : null,
        emergency24h: emergency24h || false,
        supportEmail,
        supportPhone,
        contacts: contacts && contacts.length > 0 ? {
          create: contacts.map((contact: any) => ({
            firstName: contact.firstName,
            lastName: contact.lastName,
            jobTitle: contact.jobTitle,
            department: contact.department,
            email: contact.email,
            phone: contact.phone,
            mobile: contact.mobile,
            whatsapp: contact.whatsapp,
            skype: contact.skype,
            preferredContact: contact.preferredContact || 'EMAIL',
            bestTimeToCall: contact.bestTimeToCall,
            languages: contact.languages ? JSON.stringify(contact.languages) : null,
            isPrimary: contact.isPrimary || false,
            responsibilities: contact.responsibilities ? JSON.stringify(contact.responsibilities) : null,
            authority: contact.authority,
            workingHours: contact.workingHours ? JSON.stringify(contact.workingHours) : null,
            emergencyContact: contact.emergencyContact || false,
            notes: contact.notes
          }))
        } : undefined
      },
      include: {
        contacts: true
      }
    })

    return NextResponse.json(contractor)
  } catch (error) {
    console.error('Create contractor error:', error)
    return NextResponse.json(
      { error: 'Failed to create contractor' },
      { status: 500 }
    )
  }
}