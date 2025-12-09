import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const task = await prisma.dailyTask.findUnique({
      where: { id }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

// PUT - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const {
      title,
      description,
      date,
      priority,
      category,
      status,
      completedAt,
      notes,
      actionTaken,
      nextStep,
      transferredTo,
      transferReason,
      relatedTo,
      relatedId,
      assignedTo,
      dueTime
    } = body

    // Build update data
    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (date !== undefined) updateData.date = new Date(date)
    if (priority !== undefined) updateData.priority = priority
    if (category !== undefined) updateData.category = category
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (actionTaken !== undefined) updateData.actionTaken = actionTaken
    if (nextStep !== undefined) updateData.nextStep = nextStep
    if (relatedTo !== undefined) updateData.relatedTo = relatedTo
    if (relatedId !== undefined) updateData.relatedId = relatedId
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (dueTime !== undefined) updateData.dueTime = dueTime

    // Handle completion
    if (status === 'COMPLETED' && !completedAt) {
      updateData.completedAt = new Date()
    } else if (completedAt) {
      updateData.completedAt = new Date(completedAt)
    }

    // Handle transfer
    if (transferredTo) {
      updateData.status = 'TRANSFERRED'
      updateData.transferredTo = new Date(transferredTo)
      updateData.transferReason = transferReason
      updateData.transferredFrom = id

      // Create a new task for the transferred date
      const originalTask = await prisma.dailyTask.findUnique({
        where: { id }
      })

      if (originalTask) {
        await prisma.dailyTask.create({
          data: {
            title: originalTask.title,
            description: originalTask.description,
            date: new Date(transferredTo),
            priority: originalTask.priority,
            category: originalTask.category,
            status: 'PENDING',
            notes: originalTask.notes,
            relatedTo: originalTask.relatedTo,
            relatedId: originalTask.relatedId,
            assignedTo: originalTask.assignedTo,
            createdBy: originalTask.createdBy,
            dueTime: originalTask.dueTime,
            transferredFrom: id
          }
        })
      }
    }

    const task = await prisma.dailyTask.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    await prisma.dailyTask.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
