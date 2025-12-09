import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all tasks or filter by date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
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

    // Filter by priority
    if (priority) {
      where.priority = priority
    }

    // Filter by category
    if (category) {
      where.category = category
    }

    const tasks = await prisma.dailyTask.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { dueTime: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      description,
      date,
      priority,
      category,
      status,
      notes,
      actionTaken,
      nextStep,
      relatedTo,
      relatedId,
      assignedTo,
      createdBy,
      dueTime
    } = body

    // Validation
    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      )
    }

    const task = await prisma.dailyTask.create({
      data: {
        title,
        description,
        date: new Date(date),
        priority: priority || 'MEDIUM',
        category: category || 'GENERAL',
        status: status || 'PENDING',
        notes,
        actionTaken,
        nextStep,
        relatedTo,
        relatedId,
        assignedTo,
        createdBy,
        dueTime
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
