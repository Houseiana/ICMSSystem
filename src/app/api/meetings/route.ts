import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all meetings or filter by date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const where: any = {}

    // Filter by specific date
    if (date) {
      const targetDate = new Date(date)
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)

      where.date = {
        gte: targetDate,
        lt: nextDay
      }
    }

    // Filter by date range
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Filter by status
    if (status) {
      where.status = status
    }

    // Filter by category
    if (category) {
      where.category = category
    }

    const meetings = await prisma.meeting.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json(meetings)
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    )
  }
}

// POST - Create new meeting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      locationType,
      meetingLink,
      purpose,
      category,
      organizer,
      participants,
      relatedTo,
      relatedId,
      status,
      notes,
      reminderBefore
    } = body

    // Validation
    if (!title || !date || !startTime) {
      return NextResponse.json(
        { error: 'Title, date, and start time are required' },
        { status: 400 }
      )
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        locationType: locationType || 'IN_PERSON',
        meetingLink,
        purpose,
        category: category || 'GENERAL',
        organizer,
        participants: participants ? JSON.stringify(participants) : null,
        relatedTo,
        relatedId,
        status: status || 'SCHEDULED',
        notes,
        reminderBefore
      }
    })

    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error('Error creating meeting:', error)
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    )
  }
}
