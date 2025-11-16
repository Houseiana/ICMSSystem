import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        contacts: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    })

    if (!contractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(contractor)
  } catch (error) {
    console.error('Error fetching contractor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contractor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const contractorId = parseInt(params.id)

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
      status,
      notes,
      tags,
      emergency24h,
      supportEmail,
      supportPhone
    } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    // Check if contractor exists
    const existingContractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    })

    if (!existingContractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }

    // Check for duplicate name/type (excluding current contractor)
    if (name !== existingContractor.name || type !== existingContractor.type) {
      const duplicateContractor = await prisma.contractor.findFirst({
        where: {
          name,
          type,
          country: country || undefined,
          id: { not: contractorId }
        }
      })

      if (duplicateContractor) {
        return NextResponse.json(
          { error: 'Another contractor with this name and type already exists in this location' },
          { status: 409 }
        )
      }
    }

    const contractor = await prisma.contractor.update({
      where: { id: contractorId },
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
        status: status || 'ACTIVE',
        notes,
        tags: tags ? JSON.stringify(tags) : null,
        emergency24h: emergency24h || false,
        supportEmail,
        supportPhone
      },
      include: {
        contacts: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    })

    return NextResponse.json(contractor)
  } catch (error) {
    console.error('Update contractor error:', error)
    return NextResponse.json(
      { error: 'Failed to update contractor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contractorId = parseInt(params.id)

    // Check if contractor exists
    const existingContractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    })

    if (!existingContractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }

    // Delete the contractor (cascade will handle contacts)
    await prisma.contractor.delete({
      where: { id: contractorId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete contractor error:', error)
    return NextResponse.json(
      { error: 'Failed to delete contractor' },
      { status: 500 }
    )
  }
}