import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stakeholder = await prisma.stakeholder.findUnique({
      where: { id: parseInt(params.id) },
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

    if (!stakeholder) {
      return NextResponse.json(
        { error: 'Stakeholder not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(stakeholder)
  } catch (error) {
    console.error('Error fetching stakeholder:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stakeholder' },
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
    const stakeholderId = parseInt(params.id)

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
      passportExpiry,
      passportIssuingCountry,
      visaStatus,
      visaType,
      visaNumber,
      visaValidFrom,
      visaValidTo,
      visaCategory,
      visaEntries,
      occupation,
      employer,
      workAddress,
      bloodGroup,
      medicalConditions,
      allergies,
      notes,
      tags,
      maritalStatus,
      languages,
      photoUrl,
      qidDocumentUrl,
      passportDocumentUrl,
      qidNumber,
      qidIssueDate,
      qidExpiryDate,
      qidLocation,
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

    // Check if stakeholder exists
    const existingStakeholder = await prisma.stakeholder.findUnique({
      where: { id: stakeholderId }
    })

    if (!existingStakeholder) {
      return NextResponse.json(
        { error: 'Stakeholder not found' },
        { status: 404 }
      )
    }

    // Check for existing stakeholder with same email (excluding current)
    if (email) {
      const emailExists = await prisma.stakeholder.findFirst({
        where: {
          email,
          id: { not: stakeholderId }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Another stakeholder with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Update the stakeholder
    const stakeholder = await prisma.stakeholder.update({
      where: { id: stakeholderId },
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
        passportExpiry: passportExpiry ? new Date(passportExpiry) : null,
        passportIssuingCountry,
        visaStatus,
        visaType,
        visaNumber,
        visaValidFrom: visaValidFrom ? new Date(visaValidFrom) : null,
        visaValidTo: visaValidTo ? new Date(visaValidTo) : null,
        visaCategory,
        visaEntries,
        occupation,
        employer,
        workAddress,
        bloodGroup,
        medicalConditions,
        allergies,
        notes,
        tags,
        maritalStatus,
        languages,
        photoUrl,
        qidDocumentUrl,
        passportDocumentUrl,
        qidNumber,
        qidIssueDate: qidIssueDate ? new Date(qidIssueDate) : null,
        qidExpiryDate: qidExpiryDate ? new Date(qidExpiryDate) : null,
        qidLocation,
        spouseId: spouseId ? parseInt(spouseId) : null,
        fatherId: fatherId ? parseInt(fatherId) : null,
        motherId: motherId ? parseInt(motherId) : null
      }
    })

    // Handle spouse relationship updates
    if (spouseId && spouseId !== existingStakeholder.spouseId?.toString()) {
      // Remove old spouse relationship if exists
      if (existingStakeholder.spouseId) {
        await prisma.stakeholder.update({
          where: { id: existingStakeholder.spouseId },
          data: { spouseId: null }
        })
      }

      // Set new spouse relationship
      await prisma.stakeholder.update({
        where: { id: parseInt(spouseId) },
        data: { spouseId: stakeholderId }
      })
    } else if (!spouseId && existingStakeholder.spouseId) {
      // Remove spouse relationship
      await prisma.stakeholder.update({
        where: { id: existingStakeholder.spouseId },
        data: { spouseId: null }
      })
    }

    // Update additional relationships if provided
    if (relationships && Array.isArray(relationships)) {
      // Delete existing additional relationships
      await prisma.stakeholderRelationship.deleteMany({
        where: { fromId: stakeholderId }
      })

      // Create new relationships
      for (const rel of relationships) {
        if (rel.toId) {
          await prisma.stakeholderRelationship.create({
            data: {
              fromId: stakeholderId,
              toId: parseInt(rel.toId),
              relationshipType: rel.relationshipType,
              description: rel.description,
              strength: rel.strength,
              since: rel.since ? new Date(rel.since) : null,
              notes: rel.notes
            }
          })
        }
      }
    }

    // Fetch the updated stakeholder with all relationships
    const updatedStakeholder = await prisma.stakeholder.findUnique({
      where: { id: stakeholderId },
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

    return NextResponse.json(updatedStakeholder)
  } catch (error) {
    console.error('Update stakeholder error:', error)
    return NextResponse.json(
      { error: 'Failed to update stakeholder' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stakeholderId = parseInt(params.id)

    // Check if stakeholder exists
    const existingStakeholder = await prisma.stakeholder.findUnique({
      where: { id: stakeholderId },
      include: {
        spouseOf: true
      }
    })

    if (!existingStakeholder) {
      return NextResponse.json(
        { error: 'Stakeholder not found' },
        { status: 404 }
      )
    }

    // Remove spouse relationship if exists
    if (existingStakeholder.spouseId) {
      await prisma.stakeholder.update({
        where: { id: existingStakeholder.spouseId },
        data: { spouseId: null }
      })
    }

    // Remove reverse spouse relationship if exists
    if (existingStakeholder.spouseOf) {
      await prisma.stakeholder.update({
        where: { id: existingStakeholder.spouseOf.id },
        data: { spouseId: null }
      })
    }

    // Update children to remove parent references
    await prisma.stakeholder.updateMany({
      where: { fatherId: stakeholderId },
      data: { fatherId: null }
    })

    await prisma.stakeholder.updateMany({
      where: { motherId: stakeholderId },
      data: { motherId: null }
    })

    // Delete the stakeholder (cascade will handle relationships)
    await prisma.stakeholder.delete({
      where: { id: stakeholderId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete stakeholder error:', error)
    return NextResponse.json(
      { error: 'Failed to delete stakeholder' },
      { status: 500 }
    )
  }
}