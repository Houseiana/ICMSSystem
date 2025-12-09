import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single meeting by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid meeting ID' },
        { status: 400 }
      )
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id }
    })

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Error fetching meeting:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    )
  }
}

// PUT - Update meeting
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid meeting ID' },
        { status: 400 }
      )
    }

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
      outcome,
      reminderBefore
    } = body

    const meeting = await prisma.meeting.update({
      where: { id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        location,
        locationType,
        meetingLink,
        purpose,
        category,
        organizer,
        participants: participants ? JSON.stringify(participants) : undefined,
        relatedTo,
        relatedId,
        status,
        notes,
        outcome,
        reminderBefore
      }
    })

    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Error updating meeting:', error)
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    )
  }
}

// DELETE - Delete meeting
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid meeting ID' },
        { status: 400 }
      )
    }

    await prisma.meeting.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Meeting deleted successfully' })
  } catch (error) {
    console.error('Error deleting meeting:', error)
    return NextResponse.json(
      { error: 'Failed to delete meeting' },
      { status: 500 }
    )
  }
}
