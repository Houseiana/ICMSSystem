import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/services/email'
import { sendWhatsApp, whatsAppTemplates } from '@/lib/services/whatsapp'

// POST - Send daily tasks to a specific person
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      date, // Optional - defaults to today
      assignedTo, // Name of the person
      sendEmail: shouldSendEmail,
      sendWhatsApp: shouldSendWhatsApp,
      recipientEmail,
      recipientPhone,
      recipientName
    } = body

    // Parse date or use today
    const targetDate = date ? new Date(date) : new Date()
    const dateStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    const dateEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)

    // Build where clause
    const whereClause: any = {
      date: {
        gte: dateStart,
        lt: dateEnd
      },
      status: {
        in: ['PENDING', 'IN_PROGRESS']
      }
    }

    if (assignedTo) {
      whereClause.assignedTo = assignedTo
    }

    // Fetch tasks for the date
    const tasks = await prisma.dailyTask.findMany({
      where: whereClause,
      orderBy: [
        { priority: 'desc' },
        { dueTime: 'asc' }
      ]
    })

    if (tasks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No tasks found for the specified criteria',
        tasksCount: 0
      })
    }

    const results: { email?: any; whatsapp?: any } = {}

    // Format date for display
    const formattedDate = targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Format tasks data
    const taskData = tasks.map(task => ({
      title: task.title,
      description: task.description || undefined,
      priority: task.priority,
      dueTime: task.dueTime || undefined,
      category: task.category
    }))

    const commonData = {
      recipientName: recipientName || assignedTo || 'Team Member',
      recipientEmail: recipientEmail || '',
      date: formattedDate,
      tasks: taskData
    }

    // Send Email
    if (shouldSendEmail && recipientEmail) {
      const emailTemplate = emailTemplates.dailyTasksNotification(commonData)

      results.email = await sendEmail({
        to: recipientEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      })
    }

    // Send WhatsApp
    if (shouldSendWhatsApp && recipientPhone) {
      const whatsappMessage = whatsAppTemplates.dailyTasksNotification(commonData)

      results.whatsapp = await sendWhatsApp({
        to: recipientPhone,
        message: whatsappMessage
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Daily tasks notification sent successfully',
      tasksCount: tasks.length,
      results
    })
  } catch (error: any) {
    console.error('Error sending daily tasks notification:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send daily tasks notification' },
      { status: 500 }
    )
  }
}

// GET - Get summary of tasks by assignee for today (for batch sending)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    // Parse date or use today
    const targetDate = dateParam ? new Date(dateParam) : new Date()
    const dateStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    const dateEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)

    // Fetch all tasks for the date
    const tasks = await prisma.dailyTask.findMany({
      where: {
        date: {
          gte: dateStart,
          lt: dateEnd
        },
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        }
      },
      orderBy: [
        { assignedTo: 'asc' },
        { priority: 'desc' }
      ]
    })

    // Group tasks by assignee
    const tasksByAssignee: Record<string, any[]> = {}

    tasks.forEach(task => {
      const assignee = task.assignedTo || 'Unassigned'
      if (!tasksByAssignee[assignee]) {
        tasksByAssignee[assignee] = []
      }
      tasksByAssignee[assignee].push({
        id: task.id,
        title: task.title,
        priority: task.priority,
        dueTime: task.dueTime,
        category: task.category
      })
    })

    // Format date for display
    const formattedDate = targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return NextResponse.json({
      success: true,
      date: formattedDate,
      totalTasks: tasks.length,
      assignees: Object.keys(tasksByAssignee).length,
      tasksByAssignee
    })
  } catch (error: any) {
    console.error('Error fetching daily tasks summary:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tasks summary' },
      { status: 500 }
    )
  }
}
