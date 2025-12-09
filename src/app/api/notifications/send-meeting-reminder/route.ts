import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/services/email'
import { sendWhatsApp, whatsAppTemplates } from '@/lib/services/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      meetingId,
      sendEmail: shouldSendEmail,
      sendWhatsApp: shouldSendWhatsApp,
      recipientEmail,
      recipientPhone,
      recipientName
    } = body

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      )
    }

    // Fetch meeting data
    const meeting = await prisma.meeting.findUnique({
      where: { id: parseInt(meetingId) }
    })

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    const results: { email?: any; whatsapp?: any } = {}

    // Format meeting date
    const meetingDate = meeting.date
      ? new Date(meeting.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'TBD'

    const commonData = {
      recipientName: recipientName || 'Participant',
      meetingTitle: meeting.title,
      meetingDate,
      meetingTime: meeting.startTime + (meeting.endTime ? ` - ${meeting.endTime}` : ''),
      location: meeting.location || '',
      locationType: meeting.locationType,
      meetingLink: meeting.meetingLink || undefined,
      purpose: meeting.purpose || undefined,
      organizer: meeting.organizer || undefined
    }

    // Send Email
    if (shouldSendEmail && recipientEmail) {
      const emailTemplate = emailTemplates.meetingReminder(commonData)

      results.email = await sendEmail({
        to: recipientEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      })
    }

    // Send WhatsApp
    if (shouldSendWhatsApp && recipientPhone) {
      const whatsappMessage = whatsAppTemplates.meetingReminder(commonData)

      results.whatsapp = await sendWhatsApp({
        to: recipientPhone,
        message: whatsappMessage
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Meeting reminder sent successfully',
      results
    })
  } catch (error: any) {
    console.error('Error sending meeting reminder:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send meeting reminder' },
      { status: 500 }
    )
  }
}

// GET - Send reminders for all meetings happening today or in the next hour
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reminderType = searchParams.get('type') || 'today' // 'today' or 'upcoming'

    const now = new Date()
    let whereClause: any = {
      status: 'SCHEDULED'
    }

    if (reminderType === 'today') {
      // Meetings today that haven't started
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

      whereClause.date = {
        gte: todayStart,
        lt: todayEnd
      }
    } else if (reminderType === 'upcoming') {
      // Meetings in the next hour
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

      whereClause.date = {
        gte: now,
        lte: oneHourFromNow
      }
    }

    const meetings = await prisma.meeting.findMany({
      where: whereClause
    })

    // Return list of meetings that need reminders
    return NextResponse.json({
      success: true,
      meetingsCount: meetings.length,
      meetings: meetings.map(m => ({
        id: m.id,
        title: m.title,
        date: m.date,
        startTime: m.startTime,
        organizer: m.organizer,
        participants: m.participants
      }))
    })
  } catch (error: any) {
    console.error('Error fetching meetings for reminders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch meetings' },
      { status: 500 }
    )
  }
}
