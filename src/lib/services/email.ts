import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || process.env.EMAIL_FROM || 'ICMS <notifications@adminofficeqa.com>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Email service error:', error)
    return { success: false, error: error.message }
  }
}

// Email Templates
export const emailTemplates = {
  // Itinerary Confirmation
  itineraryConfirmation: (data: {
    recipientName: string
    travelRequestId: string
    travelDate: string
    destination: string
    flights?: any[]
    hotels?: any[]
    cars?: any[]
  }) => ({
    subject: `Travel Itinerary Confirmation - ${data.destination}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .section { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
          .section-title { font-weight: bold; color: #1f2937; margin-bottom: 10px; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
          .detail-row { display: flex; padding: 5px 0; }
          .label { font-weight: 600; width: 120px; color: #6b7280; }
          .value { color: #1f2937; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">Travel Itinerary Confirmed</h1>
            <p style="margin:5px 0 0;">Reference: #${data.travelRequestId}</p>
          </div>
          <div class="content">
            <p>Dear ${data.recipientName},</p>
            <p>Your travel itinerary has been confirmed. Please find the details below:</p>

            <div class="section">
              <div class="section-title">Trip Overview</div>
              <div class="detail-row"><span class="label">Destination:</span><span class="value">${data.destination}</span></div>
              <div class="detail-row"><span class="label">Travel Date:</span><span class="value">${data.travelDate}</span></div>
            </div>

            ${data.flights && data.flights.length > 0 ? `
            <div class="section">
              <div class="section-title">✈️ Flights</div>
              ${data.flights.map(flight => `
                <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong>${flight.airline} ${flight.flightNumber}</strong><br/>
                  ${flight.departureCity} → ${flight.arrivalCity}<br/>
                  <span style="color: #6b7280;">${flight.departureDate} at ${flight.departureTime}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${data.hotels && data.hotels.length > 0 ? `
            <div class="section">
              <div class="section-title">🏨 Hotels</div>
              ${data.hotels.map(hotel => `
                <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong>${hotel.hotelName}</strong><br/>
                  ${hotel.city}<br/>
                  <span style="color: #6b7280;">Check-in: ${hotel.checkIn} | Check-out: ${hotel.checkOut}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${data.cars && data.cars.length > 0 ? `
            <div class="section">
              <div class="section-title">🚗 Car Rentals</div>
              ${data.cars.map(car => `
                <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong>${car.carType}</strong><br/>
                  Pick-up: ${car.pickupLocation}<br/>
                  <span style="color: #6b7280;">${car.pickupDate} - ${car.dropoffDate}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <p style="margin-top: 20px;">If you have any questions, please contact us.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from ICMS - HR Management System</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

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
    organizer?: string
  }) => ({
    subject: `Meeting Reminder: ${data.meetingTitle} - ${data.meetingDate}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .meeting-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; }
          .detail-row { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .label { font-weight: 600; color: #6b7280; display: inline-block; width: 100px; }
          .value { color: #1f2937; }
          .btn { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">📅 Meeting Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${data.recipientName},</p>
            <p>This is a reminder for your upcoming meeting:</p>

            <div class="meeting-box">
              <h2 style="margin: 0 0 15px; color: #1f2937;">${data.meetingTitle}</h2>

              <div class="detail-row">
                <span class="label">📆 Date:</span>
                <span class="value">${data.meetingDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">🕐 Time:</span>
                <span class="value">${data.meetingTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">📍 Location:</span>
                <span class="value">${data.locationType === 'ONLINE' ? 'Online Meeting' : data.location || 'TBD'}</span>
              </div>
              ${data.organizer ? `
              <div class="detail-row">
                <span class="label">👤 Organizer:</span>
                <span class="value">${data.organizer}</span>
              </div>
              ` : ''}
              ${data.purpose ? `
              <div class="detail-row">
                <span class="label">📋 Agenda:</span>
                <span class="value">${data.purpose}</span>
              </div>
              ` : ''}

              ${data.meetingLink ? `
              <a href="${data.meetingLink}" class="btn">Join Meeting</a>
              ` : ''}
            </div>

            <p style="margin-top: 20px; color: #6b7280;">Please be prepared and on time.</p>
          </div>
          <div class="footer">
            <p>This is an automated reminder from ICMS - HR Management System</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Daily Tasks Email
  dailyTasksNotification: (data: {
    recipientName: string
    recipientEmail: string
    date: string
    tasks: Array<{
      title: string
      description?: string
      priority: string
      dueTime?: string
      category: string
    }>
  }) => ({
    subject: `Your Daily Tasks for ${data.date}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ea580c; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .task-card { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
          .priority-urgent { border-left: 4px solid #dc2626; }
          .priority-high { border-left: 4px solid #ea580c; }
          .priority-medium { border-left: 4px solid #eab308; }
          .priority-low { border-left: 4px solid #22c55e; }
          .priority-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
          .badge-urgent { background: #fef2f2; color: #dc2626; }
          .badge-high { background: #fff7ed; color: #ea580c; }
          .badge-medium { background: #fefce8; color: #ca8a04; }
          .badge-low { background: #f0fdf4; color: #16a34a; }
          .task-title { font-weight: bold; color: #1f2937; margin-bottom: 5px; }
          .task-meta { color: #6b7280; font-size: 13px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          .summary { background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">📋 Daily Tasks</h1>
            <p style="margin:5px 0 0;">${data.date}</p>
          </div>
          <div class="content">
            <p>Good morning ${data.recipientName},</p>
            <p>Here are your tasks for today:</p>

            <div class="summary">
              <strong>Summary:</strong> ${data.tasks.length} task${data.tasks.length !== 1 ? 's' : ''} assigned
              ${data.tasks.filter(t => t.priority === 'URGENT').length > 0 ? ` | <span style="color:#dc2626;">${data.tasks.filter(t => t.priority === 'URGENT').length} urgent</span>` : ''}
            </div>

            ${data.tasks.map(task => `
              <div class="task-card priority-${task.priority.toLowerCase()}">
                <div class="task-title">${task.title}</div>
                ${task.description ? `<p style="margin: 5px 0; color: #4b5563;">${task.description}</p>` : ''}
                <div class="task-meta">
                  <span class="priority-badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
                  ${task.dueTime ? ` | Due: ${task.dueTime}` : ''}
                  ${task.category ? ` | ${task.category}` : ''}
                </div>
              </div>
            `).join('')}

            <p style="margin-top: 20px;">Have a productive day!</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from ICMS - HR Management System</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}
