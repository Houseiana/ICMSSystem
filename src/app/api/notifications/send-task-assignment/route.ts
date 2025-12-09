import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/services/email'
import { sendWhatsApp, whatsAppTemplates } from '@/lib/services/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      taskId,
      sendEmail: shouldSendEmail,
      sendWhatsApp: shouldSendWhatsApp,
      recipientEmail,
      recipientPhone,
      recipientName,
      assignedBy
    } = body

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // Fetch task data
    const task = await prisma.dailyTask.findUnique({
      where: { id: parseInt(taskId) }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const results: { email?: any; whatsapp?: any } = {}

    // Format task date
    const dueDate = task.date
      ? new Date(task.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'TBD'

    const taskData = {
      recipientName: recipientName || task.assignedTo || 'Team Member',
      taskTitle: task.title,
      taskDescription: task.description || undefined,
      priority: task.priority,
      dueDate,
      dueTime: task.dueTime || undefined,
      assignedBy: assignedBy || task.createdBy || undefined
    }

    // Send Email
    if (shouldSendEmail && recipientEmail) {
      const priorityEmoji = task.priority === 'URGENT' ? '🔴' :
                           task.priority === 'HIGH' ? '🟠' :
                           task.priority === 'MEDIUM' ? '🟡' : '🟢'

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .task-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${
              task.priority === 'URGENT' ? '#dc2626' :
              task.priority === 'HIGH' ? '#ea580c' :
              task.priority === 'MEDIUM' ? '#eab308' : '#22c55e'
            }; }
            .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; background: ${
              task.priority === 'URGENT' ? '#fef2f2' :
              task.priority === 'HIGH' ? '#fff7ed' :
              task.priority === 'MEDIUM' ? '#fefce8' : '#f0fdf4'
            }; color: ${
              task.priority === 'URGENT' ? '#dc2626' :
              task.priority === 'HIGH' ? '#ea580c' :
              task.priority === 'MEDIUM' ? '#ca8a04' : '#16a34a'
            }; }
            .detail-row { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .label { font-weight: 600; color: #6b7280; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">📝 New Task Assigned</h1>
            </div>
            <div class="content">
              <p>Dear ${taskData.recipientName},</p>
              <p>A new task has been assigned to you:</p>

              <div class="task-box">
                <div style="margin-bottom: 15px;">
                  <span class="priority-badge">${task.priority}</span>
                </div>
                <h2 style="margin: 0 0 10px; color: #1f2937;">${task.title}</h2>
                ${task.description ? `<p style="color: #4b5563; margin: 0 0 15px;">${task.description}</p>` : ''}

                <div class="detail-row">
                  <span class="label">📅 Due Date:</span> ${dueDate}
                </div>
                ${task.dueTime ? `
                <div class="detail-row">
                  <span class="label">🕐 Due Time:</span> ${task.dueTime}
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="label">📁 Category:</span> ${task.category}
                </div>
                ${assignedBy ? `
                <div class="detail-row">
                  <span class="label">👤 Assigned By:</span> ${assignedBy}
                </div>
                ` : ''}
              </div>

              <p style="margin-top: 20px;">Please complete this task on time.</p>
            </div>
            <div class="footer">
              <p>This is an automated notification from ICMS - HR Management System</p>
            </div>
          </div>
        </body>
        </html>
      `

      results.email = await sendEmail({
        to: recipientEmail,
        subject: `${priorityEmoji} New Task: ${task.title}`,
        html: emailHtml
      })
    }

    // Send WhatsApp
    if (shouldSendWhatsApp && recipientPhone) {
      const whatsappMessage = whatsAppTemplates.taskAssignment(taskData)

      results.whatsapp = await sendWhatsApp({
        to: recipientPhone,
        message: whatsappMessage
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Task assignment notification sent successfully',
      results
    })
  } catch (error: any) {
    console.error('Error sending task assignment notification:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send task assignment notification' },
      { status: 500 }
    )
  }
}
