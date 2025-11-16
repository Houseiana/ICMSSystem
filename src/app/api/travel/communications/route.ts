import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/communications
 * Get all communications with optional filters
 * Query params:
 *   - travelRequestId: filter by travel request
 *   - communicationType: filter by type (EMAIL, WHATSAPP, BOTH)
 *   - status: filter by status (SENT, FAILED, PENDING)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const travelRequestId = searchParams.get('travelRequestId')
    const communicationType = searchParams.get('communicationType')
    const status = searchParams.get('status')

    const where: any = {}

    if (travelRequestId) {
      where.travelRequestId = parseInt(travelRequestId)
    }

    if (communicationType) {
      where.communicationType = communicationType
    }

    if (status) {
      where.status = status
    }

    const communications = await prisma.tripCommunication.findMany({
      where,
      orderBy: {
        sentAt: 'desc'
      }
    })

    // Fetch person details for each communication
    const communicationsWithDetails = await Promise.all(
      communications.map(async (comm) => {
        let recipientName = 'Unknown'
        let recipientContact = ''

        if (comm.recipientPersonType && comm.recipientPersonId) {
          const personDetails = await fetchPersonDetails(
            comm.recipientPersonType,
            comm.recipientPersonId
          )

          if (personDetails) {
            recipientName = personDetails.fullName || personDetails.name || 'Unknown'
            recipientContact = personDetails.email || personDetails.phone || ''
          }
        }

        return {
          ...comm,
          recipientName,
          recipientContact
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: communicationsWithDetails,
      count: communicationsWithDetails.length
    })
  } catch (error) {
    console.error('Error fetching communications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch communications' },
      { status: 500 }
    )
  }
}

/**
 * Fetch person details based on personType
 */
async function fetchPersonDetails(personType: string, personId: number): Promise<any | null> {
  try {
    switch (personType) {
      case 'EMPLOYEE':
        return await prisma.employee.findUnique({
          where: { id: personId },
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        })

      case 'STAKEHOLDER':
        return await prisma.stakeholder.findUnique({
          where: { id: personId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }).then(s => s ? { ...s, fullName: `${s.firstName} ${s.lastName}` } : null)

      case 'EMPLOYER':
        return await prisma.employer.findUnique({
          where: { id: personId },
          select: {
            id: true,
            companyName: true,
            primaryEmail: true,
            mainPhone: true
          }
        }).then(e => e ? { ...e, fullName: e.companyName, name: e.companyName, email: e.primaryEmail, phone: e.mainPhone } : null)

      case 'TASK_HELPER':
        return await prisma.taskHelper.findUnique({
          where: { id: personId },
          select: {
            id: true,
            fullName: true,
            primaryEmail: true,
            primaryPhone: true
          }
        }).then(t => t ? { ...t, email: t.primaryEmail, phone: t.primaryPhone } : null)

      default:
        return null
    }
  } catch (error) {
    console.error(`Error fetching ${personType} details:`, error)
    return null
  }
}
