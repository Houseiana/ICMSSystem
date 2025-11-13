import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const relationships = await prisma.stakeholderRelationship.findMany({
      include: {
        from: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true
          }
        },
        to: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            gender: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(relationships)
  } catch (error) {
    console.error('Error fetching relationships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch relationships' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      fromId,
      toId,
      relationshipType,
      description,
      strength,
      since,
      notes,
      createReverse = true
    } = body

    if (!fromId || !toId || !relationshipType) {
      return NextResponse.json(
        { error: 'fromId, toId, and relationshipType are required' },
        { status: 400 }
      )
    }

    if (fromId === toId) {
      return NextResponse.json(
        { error: 'Cannot create relationship to self' },
        { status: 400 }
      )
    }

    // Check if relationship already exists
    const existingRelationship = await prisma.stakeholderRelationship.findFirst({
      where: {
        fromId,
        toId,
        relationshipType
      }
    })

    if (existingRelationship) {
      return NextResponse.json(
        { error: 'Relationship already exists' },
        { status: 409 }
      )
    }

    // Create the relationship
    const relationship = await prisma.stakeholderRelationship.create({
      data: {
        fromId,
        toId,
        relationshipType,
        description,
        strength,
        since: since ? new Date(since) : null,
        notes
      },
      include: {
        from: true,
        to: true
      }
    })

    // Handle special family relationships that need reverse connections
    if (createReverse) {
      let reverseType: string | null = null

      switch (relationshipType.toLowerCase()) {
        case 'spouse':
        case 'husband':
        case 'wife':
          reverseType = 'spouse'
          // Update the stakeholders' spouse relationship in the main table
          await prisma.stakeholder.update({
            where: { id: fromId },
            data: { spouseId: toId }
          })
          await prisma.stakeholder.update({
            where: { id: toId },
            data: { spouseId: fromId }
          })
          break
        case 'father':
          reverseType = 'child'
          // Update the child's father reference
          await prisma.stakeholder.update({
            where: { id: toId },
            data: { fatherId: fromId }
          })
          break
        case 'mother':
          reverseType = 'child'
          // Update the child's mother reference
          await prisma.stakeholder.update({
            where: { id: toId },
            data: { motherId: fromId }
          })
          break
        case 'child':
          // Determine if the parent is father or mother based on gender
          const parent = await prisma.stakeholder.findUnique({
            where: { id: fromId },
            select: { gender: true }
          })
          reverseType = parent?.gender?.toLowerCase() === 'female' ? 'mother' : 'father'

          if (reverseType === 'father') {
            await prisma.stakeholder.update({
              where: { id: toId },
              data: { fatherId: fromId }
            })
          } else {
            await prisma.stakeholder.update({
              where: { id: toId },
              data: { motherId: fromId }
            })
          }
          break
        case 'sibling':
          reverseType = 'sibling'
          break
      }

      // Create reverse relationship if needed
      if (reverseType) {
        const reverseExists = await prisma.stakeholderRelationship.findFirst({
          where: {
            fromId: toId,
            toId: fromId,
            relationshipType: reverseType
          }
        })

        if (!reverseExists) {
          await prisma.stakeholderRelationship.create({
            data: {
              fromId: toId,
              toId: fromId,
              relationshipType: reverseType,
              description: `Reverse of ${relationshipType}`,
              strength,
              since: since ? new Date(since) : null,
              notes: `Auto-created reverse relationship`
            }
          })
        }
      }
    }

    return NextResponse.json(relationship, { status: 201 })
  } catch (error) {
    console.error('Create relationship error:', error)
    return NextResponse.json(
      { error: 'Failed to create relationship' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Relationship ID is required' },
        { status: 400 }
      )
    }

    await prisma.stakeholderRelationship.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete relationship error:', error)
    return NextResponse.json(
      { error: 'Failed to delete relationship' },
      { status: 500 }
    )
  }
}