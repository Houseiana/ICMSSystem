import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stakeholders = await prisma.stakeholder.findMany({
      include: {
        spouse: true,
        father: true,
        mother: true,
        childrenAsFather: true,
        childrenAsMother: true,
        relationships: {
          include: {
            to: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        relatedTo: {
          include: {
            from: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(stakeholders)
  } catch (error) {
    console.error('Error fetching stakeholders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stakeholders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      firstName,
      middleName,
      lastName,
      preferredName,
      email,
      phone,
      alternatePhone,
      dateOfBirth,
      placeOfBirth,
      gender,
      nationality,
      religion,
      address,
      city,
      state,
      postalCode,
      country,
      nationalId,
      passportNumber,
      occupation,
      employer,
      workAddress,
      bloodGroup,
      medicalConditions,
      allergies,
      notes,
      tags,
      // Relationships
      spouseId,
      fatherId,
      motherId,
      relationships
    } = body

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Check for existing stakeholder with same email
    if (email) {
      const existingStakeholder = await prisma.stakeholder.findFirst({
        where: { email }
      })

      if (existingStakeholder) {
        return NextResponse.json(
          { error: 'Stakeholder with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Create the stakeholder
    const stakeholder = await prisma.stakeholder.create({
      data: {
        firstName,
        middleName,
        lastName,
        preferredName,
        email,
        phone,
        alternatePhone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        placeOfBirth,
        gender,
        nationality,
        religion,
        address,
        city,
        state,
        postalCode,
        country,
        nationalId,
        passportNumber,
        occupation,
        employer,
        workAddress,
        bloodGroup,
        medicalConditions,
        allergies,
        notes,
        tags,
        spouseId,
        fatherId,
        motherId
      },
      include: {
        spouse: true,
        father: true,
        mother: true,
        childrenAsFather: true,
        childrenAsMother: true,
        relationships: {
          include: {
            to: true
          }
        }
      }
    })

    // If this stakeholder has a spouse, update the spouse to link back
    if (spouseId) {
      await prisma.stakeholder.update({
        where: { id: spouseId },
        data: { spouseId: stakeholder.id }
      })
    }

    // Create additional relationships if provided
    if (relationships && Array.isArray(relationships)) {
      for (const rel of relationships) {
        await prisma.stakeholderRelationship.create({
          data: {
            fromId: stakeholder.id,
            toId: rel.toId,
            relationshipType: rel.relationshipType,
            description: rel.description,
            strength: rel.strength,
            since: rel.since ? new Date(rel.since) : null,
            notes: rel.notes
          }
        })
      }
    }

    // Fetch the complete stakeholder with all relationships
    const completeStakeholder = await prisma.stakeholder.findUnique({
      where: { id: stakeholder.id },
      include: {
        spouse: true,
        father: true,
        mother: true,
        childrenAsFather: true,
        childrenAsMother: true,
        relationships: {
          include: {
            to: true
          }
        },
        relatedTo: {
          include: {
            from: true
          }
        }
      }
    })

    return NextResponse.json(completeStakeholder, { status: 201 })
  } catch (error) {
    console.error('Create stakeholder error:', error)
    return NextResponse.json(
      { error: 'Failed to create stakeholder' },
      { status: 500 }
    )
  }
}