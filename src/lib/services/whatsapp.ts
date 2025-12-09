import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

export interface WhatsAppOptions {
  to: string // Phone number in format: +1234567890
  message: string
}

// Format phone number for WhatsApp
function formatWhatsAppNumber(phone: string): string {
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')

  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }

  return `whatsapp:${cleaned}`
}

export async function sendWhatsApp(options: WhatsAppOptions) {
  if (!client) {
    console.error('Twilio client not initialized - missing credentials')
    return { success: false, error: 'WhatsApp service not configured' }
  }

  try {
    const message = await client.messages.create({
      body: options.message,
      from: whatsappFrom,
      to: formatWhatsAppNumber(options.to)
    })

    return { success: true, data: { sid: message.sid, status: message.status } }
  } catch (error: any) {
    console.error('WhatsApp send error:', error)
    return { success: false, error: error.message }
  }
}

// WhatsApp Message Templates
export const whatsAppTemplates = {
  // Itinerary Confirmation
  itineraryConfirmation: (data: {
    recipientName: string
    travelRequestId: string
    travelDate: string
    destination: string
    flights?: any[]
    hotels?: any[]
  }) => {
    let message = `✈️ *Travel Itinerary Confirmed*\n\n`
    message += `Dear ${data.recipientName},\n\n`
    message += `Your travel itinerary has been confirmed.\n\n`
    message += `📍 *Destination:* ${data.destination}\n`
    message += `📅 *Date:* ${data.travelDate}\n`
    message += `🔖 *Reference:* #${data.travelRequestId}\n`

    if (data.flights && data.flights.length > 0) {
      message += `\n✈️ *Flights:*\n`
      data.flights.forEach(flight => {
        message += `• ${flight.airline} ${flight.flightNumber}\n`
        message += `  ${flight.departureCity} → ${flight.arrivalCity}\n`
        message += `  ${flight.departureDate} at ${flight.departureTime}\n`
      })
    }

    if (data.hotels && data.hotels.length > 0) {
      message += `\n🏨 *Hotels:*\n`
      data.hotels.forEach(hotel => {
        message += `• ${hotel.hotelName}\n`
        message += `  ${hotel.checkIn} - ${hotel.checkOut}\n`
      })
    }

    message += `\nHave a safe trip! 🌟`
    return message
  },

  // Meeting Reminder
  meetingReminder: (data: {
    recipientName: string
    meetingTitle: string
    meetingDate: string
    meetingTime: string
    location: string
    locationType: string
    meetingLink?: string
    purpose?: string
  }) => {
    let message = `📅 *Meeting Reminder*\n\n`
    message += `Dear ${data.recipientName},\n\n`
    message += `You have an upcoming meeting:\n\n`
    message += `📌 *${data.meetingTitle}*\n`
    message += `📆 Date: ${data.meetingDate}\n`
    message += `🕐 Time: ${data.meetingTime}\n`

    if (data.locationType === 'ONLINE') {
      message += `💻 Location: Online Meeting\n`
      if (data.meetingLink) {
        message += `🔗 Link: ${data.meetingLink}\n`
      }
    } else {
      message += `📍 Location: ${data.location || 'TBD'}\n`
    }

    if (data.purpose) {
      message += `\n📋 Agenda: ${data.purpose}\n`
    }

    message += `\nPlease be on time! ⏰`
    return message
  },

  // Daily Tasks Notification
  dailyTasksNotification: (data: {
    recipientName: string
    date: string
    tasks: Array<{
      title: string
      priority: string
      dueTime?: string
    }>
  }) => {
    let message = `📋 *Daily Tasks - ${data.date}*\n\n`
    message += `Good morning ${data.recipientName}!\n\n`
    message += `Here are your tasks for today:\n\n`

    data.tasks.forEach((task, index) => {
      const priorityEmoji = task.priority === 'URGENT' ? '🔴' :
                           task.priority === 'HIGH' ? '🟠' :
                           task.priority === 'MEDIUM' ? '🟡' : '🟢'
      message += `${index + 1}. ${priorityEmoji} ${task.title}\n`
      if (task.dueTime) {
        message += `   ⏰ Due: ${task.dueTime}\n`
      }
    })

    message += `\nHave a productive day! 💪`
    return message
  },

  // Task Assignment Notification
  taskAssignment: (data: {
    recipientName: string
    taskTitle: string
    taskDescription?: string
    priority: string
    dueDate: string
    dueTime?: string
    assignedBy?: string
  }) => {
    const priorityEmoji = data.priority === 'URGENT' ? '🔴' :
                         data.priority === 'HIGH' ? '🟠' :
                         data.priority === 'MEDIUM' ? '🟡' : '🟢'

    let message = `📝 *New Task Assigned*\n\n`
    message += `Dear ${data.recipientName},\n\n`
    message += `A new task has been assigned to you:\n\n`
    message += `${priorityEmoji} *${data.taskTitle}*\n`

    if (data.taskDescription) {
      message += `📄 ${data.taskDescription}\n`
    }

    message += `\n📅 Due: ${data.dueDate}`
    if (data.dueTime) {
      message += ` at ${data.dueTime}`
    }
    message += `\n`

    if (data.assignedBy) {
      message += `👤 Assigned by: ${data.assignedBy}\n`
    }

    message += `\nPlease complete this task on time! ✅`
    return message
  }
}
