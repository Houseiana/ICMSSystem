import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'
import { sendEmail } from '@/lib/services/emailService'
import { sendWhatsApp, formatPhoneNumber } from '@/lib/services/whatsappService'

/**
 * POST /api/travel/communications/[id]/resend
 * Resend a previously sent communication
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = 'then' in context.params ? await context.params : context.params
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid communication ID' },
        { status: 400 }
      )
    }

    // Fetch the original communication
    const originalComm = await prisma.tripCommunication.findUnique({
      where: { id }
    })

    if (!originalComm) {
      return NextResponse.json(
        { success: false, error: 'Communication not found' },
        { status: 404 }
      )
    }

    // Fetch person details
    if (!originalComm.recipientPersonType || !originalComm.recipientPersonId) {
      return NextResponse.json(
        { success: false, error: 'Recipient information missing' },
        { status: 400 }
      )
    }

    const personDetails = await fetchPersonDetails(
      originalComm.recipientPersonType,
      originalComm.recipientPersonId
    )

    if (!personDetails) {
      return NextResponse.json(
        { success: false, error: 'Recipient not found' },
        { status: 404 }
      )
    }

    let result: { success: boolean; messageId?: string; error?: string }

    // Resend based on communication type
    if (originalComm.communicationType === 'EMAIL') {
      if (!personDetails.email) {
        return NextResponse.json(
          { success: false, error: 'Recipient has no email address' },
          { status: 400 }
        )
      }

      result = await sendEmail({
        to: personDetails.email,
        subject: originalComm.subject || 'Travel Details',
        html: originalComm.htmlContent || originalComm.message || '',
        text: originalComm.message || undefined
      })
    } else if (originalComm.communicationType === 'WHATSAPP') {
      if (!personDetails.phone) {
        return NextResponse.json(
          { success: false, error: 'Recipient has no phone number' },
          { status: 400 }
        )
      }

      const formattedPhone = formatPhoneNumber(personDetails.phone)
      result = await sendWhatsApp({
        to: formattedPhone,
        message: originalComm.message || ''
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported communication type' },
        { status: 400 }
      )
    }

    // Create new communication record for the resend
    const newComm = await prisma.tripCommunication.create({
      data: {
        travelRequestId: originalComm.travelRequestId,
        recipientPersonType: originalComm.recipientPersonType,
        recipientPersonId: originalComm.recipientPersonId,
        communicationType: originalComm.communicationType,
        contentType: originalComm.contentType,
        subject: originalComm.subject,
        message: originalComm.message,
        htmlContent: originalComm.htmlContent,
        status: result.success ? 'SENT' : 'FAILED',
        externalMessageId: result.messageId,
        errorMessage: result.error
      }
    })

    return NextResponse.json({
      success: result.success,
      data: newComm,
      message: result.success
        ? 'Communication resent successfully'
        : `Failed to resend: ${result.error}`
    })

  } catch (error) {
    console.error('Error resending communication:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to resend communication' },
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
        }).then(e => e ? { ...e, fullName: e.companyName, email: e.primaryEmail, phone: e.mainPhone } : null)

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
