import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'
import { sendEmail } from '@/lib/services/emailService'
import { sendWhatsApp, formatPhoneNumber } from '@/lib/services/whatsappService'

/**
 * POST /api/travel/passengers/send-details
 * Send travel details to selected passengers
 * Body:
 *   - travelRequestId: number
 *   - passengerIds: number[] - IDs of TripPassenger records
 *   - contentTypes: string[] - Types of content to send (FLIGHT_DETAILS, HOTEL_DETAILS, EVENT_DETAILS, FULL_ITINERARY, etc.)
 *   - communicationType: 'EMAIL' | 'WHATSAPP' | 'BOTH'
 *   - customMessage?: string - Optional custom message to include
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { travelRequestId, passengerIds, contentTypes, communicationType, customMessage } = body

    // Validate required fields
    if (!travelRequestId || !passengerIds || !Array.isArray(passengerIds) || passengerIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Travel request ID and passenger IDs are required' },
        { status: 400 }
      )
    }

    if (!contentTypes || !Array.isArray(contentTypes) || contentTypes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one content type must be selected' },
        { status: 400 }
      )
    }

    if (!['EMAIL', 'WHATSAPP', 'BOTH'].includes(communicationType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid communication type' },
        { status: 400 }
      )
    }

    // Fetch travel request with all details
    const travelRequest = await prisma.travelRequest.findUnique({
      where: { id: travelRequestId },
      include: {
        destinations: true,
        flights: {
          include: {
            passengers: true
          }
        },
        privateJets: {
          include: {
            passengers: true
          }
        },
        hotels: {
          include: {
            rooms: {
              include: {
                assignments: true
              }
            }
          }
        },
        events: {
          include: {
            participants: true,
            attachments: true
          }
        },
        passengers: true
      }
    })

    if (!travelRequest) {
      return NextResponse.json(
        { success: false, error: 'Travel request not found' },
        { status: 404 }
      )
    }

    // Fetch selected passengers with their details
    const passengers = await prisma.tripPassenger.findMany({
      where: {
        id: { in: passengerIds },
        travelRequestId
      }
    })

    if (passengers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid passengers found' },
        { status: 404 }
      )
    }

    // Track communications sent
    const communicationsSent: any[] = []
    const errors: any[] = []

    // Process each passenger
    for (const passenger of passengers) {
      // Check passenger preferences
      const shouldSend = checkPassengerPreferences(passenger, contentTypes)

      if (!shouldSend.allowed) {
        errors.push({
          passengerId: passenger.id,
          reason: shouldSend.reason
        })
        continue
      }

      // Fetch person details based on personType
      const personDetails = await fetchPersonDetails(passenger.personType, passenger.personId)

      if (!personDetails) {
        errors.push({
          passengerId: passenger.id,
          reason: 'Person details not found'
        })
        continue
      }

      // Generate content based on contentTypes
      const content = generateTravelContent(travelRequest, passenger, contentTypes, customMessage, personDetails)

      // Send via EMAIL
      if (communicationType === 'EMAIL' || communicationType === 'BOTH') {
        if (personDetails.email) {
          try {
            // Send email via Resend
            const emailResult = await sendEmail({
              to: personDetails.email,
              subject: content.subject,
              html: content.htmlContent,
              text: content.textContent
            })

            // Create communication record
            const emailComm = await prisma.tripCommunication.create({
              data: {
                travelRequestId,
                recipientPersonType: passenger.personType,
                recipientPersonId: passenger.personId,
                communicationType: 'EMAIL',
                contentType: contentTypes.join(', '),
                subject: content.subject,
                message: content.textContent,
                htmlContent: content.htmlContent,
                status: emailResult.success ? 'SENT' : 'FAILED',
                externalMessageId: emailResult.messageId,
                errorMessage: emailResult.error
              }
            })

            if (emailResult.success) {
              communicationsSent.push(emailComm)
            } else {
              errors.push({
                passengerId: passenger.id,
                type: 'EMAIL',
                error: emailResult.error || 'Failed to send email'
              })
            }
          } catch (error) {
            errors.push({
              passengerId: passenger.id,
              type: 'EMAIL',
              error: error instanceof Error ? error.message : 'Failed to send email'
            })
          }
        } else {
          errors.push({
            passengerId: passenger.id,
            type: 'EMAIL',
            reason: 'No email address available'
          })
        }
      }

      // Send via WHATSAPP
      if (communicationType === 'WHATSAPP' || communicationType === 'BOTH') {
        if (personDetails.phone) {
          try {
            // Format phone number and send via Twilio
            const formattedPhone = formatPhoneNumber(personDetails.phone)
            const whatsappResult = await sendWhatsApp({
              to: formattedPhone,
              message: content.whatsappContent
            })

            // Create communication record
            const whatsappComm = await prisma.tripCommunication.create({
              data: {
                travelRequestId,
                recipientPersonType: passenger.personType,
                recipientPersonId: passenger.personId,
                communicationType: 'WHATSAPP',
                contentType: contentTypes.join(', '),
                subject: null,
                message: content.whatsappContent,
                htmlContent: null,
                status: whatsappResult.success ? 'SENT' : 'FAILED',
                externalMessageId: whatsappResult.messageId,
                errorMessage: whatsappResult.error
              }
            })

            if (whatsappResult.success) {
              communicationsSent.push(whatsappComm)
            } else {
              errors.push({
                passengerId: passenger.id,
                type: 'WHATSAPP',
                error: whatsappResult.error || 'Failed to send WhatsApp message'
              })
            }
          } catch (error) {
            errors.push({
              passengerId: passenger.id,
              type: 'WHATSAPP',
              error: error instanceof Error ? error.message : 'Failed to send WhatsApp message'
            })
          }
        } else {
          errors.push({
            passengerId: passenger.id,
            type: 'WHATSAPP',
            reason: 'No phone number available'
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent details to ${communicationsSent.length} recipient(s)`,
      data: {
        communicationsSent: communicationsSent.length,
        errors: errors.length,
        details: {
          communications: communicationsSent,
          errors
        }
      }
    })

  } catch (error) {
    console.error('Error sending travel details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send travel details' },
      { status: 500 }
    )
  }
}

/**
 * Check if passenger preferences allow sending specific content types
 */
function checkPassengerPreferences(passenger: any, contentTypes: string[]): { allowed: boolean; reason?: string } {
  if (passenger.notificationPreference === 'NONE') {
    return { allowed: false, reason: 'Passenger has disabled all notifications' }
  }

  if (passenger.notificationPreference === 'MINIMAL') {
    // Only allow essential communications for MINIMAL preference
    const hasEssential = contentTypes.some(ct => ['FULL_ITINERARY', 'TRIP_BRIEF'].includes(ct))
    if (!hasEssential) {
      return { allowed: false, reason: 'Passenger prefers minimal notifications' }
    }
  }

  // Check specific preferences
  for (const contentType of contentTypes) {
    if (contentType.includes('FLIGHT') && !passenger.receiveFlightDetails) {
      return { allowed: false, reason: 'Passenger has disabled flight details' }
    }
    if (contentType.includes('HOTEL') && !passenger.receiveHotelDetails) {
      return { allowed: false, reason: 'Passenger has disabled hotel details' }
    }
    if (contentType.includes('EVENT') && !passenger.receiveEventDetails) {
      return { allowed: false, reason: 'Passenger has disabled event details' }
    }
    if (contentType.includes('ITINERARY') && !passenger.receiveItinerary) {
      return { allowed: false, reason: 'Passenger has disabled itinerary' }
    }
  }

  return { allowed: true }
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
            firstName: true,
            lastName: true,
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

/**
 * Generate travel content based on content types
 */
function generateTravelContent(
  travelRequest: any,
  passenger: any,
  contentTypes: string[],
  customMessage: string | undefined,
  personDetails: any
): { subject: string; textContent: string; htmlContent: string; whatsappContent: string } {
  const subject = `Travel Details - ${travelRequest.requestNumber}`

  let textContent = `Dear ${personDetails.fullName},\n\n`
  if (customMessage) {
    textContent += `${customMessage}\n\n`
  }
  textContent += `Here are your travel details for request ${travelRequest.requestNumber}:\n\n`

  let htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Travel Details</h2>
        <p>Dear ${personDetails.fullName},</p>
        ${customMessage ? `<p>${customMessage}</p>` : ''}
        <p>Here are your travel details for request <strong>${travelRequest.requestNumber}</strong>:</p>
  `

  let whatsappContent = `*Travel Details - ${travelRequest.requestNumber}*\n\nDear ${personDetails.fullName},\n\n`
  if (customMessage) {
    whatsappContent += `${customMessage}\n\n`
  }

  // Add content based on types
  for (const contentType of contentTypes) {
    if (contentType === 'FLIGHT_DETAILS' && travelRequest.flights.length > 0) {
      const flightSection = generateFlightSection(travelRequest.flights, passenger)
      textContent += flightSection.text
      htmlContent += flightSection.html
      whatsappContent += flightSection.whatsapp
    }

    if (contentType === 'PRIVATE_JET_DETAILS' && travelRequest.privateJets.length > 0) {
      const jetSection = generatePrivateJetSection(travelRequest.privateJets, passenger)
      textContent += jetSection.text
      htmlContent += jetSection.html
      whatsappContent += jetSection.whatsapp
    }

    if (contentType === 'HOTEL_DETAILS' && travelRequest.hotels.length > 0) {
      const hotelSection = generateHotelSection(travelRequest.hotels, passenger)
      textContent += hotelSection.text
      htmlContent += hotelSection.html
      whatsappContent += hotelSection.whatsapp
    }

    if (contentType === 'EVENT_DETAILS' && travelRequest.events.length > 0) {
      const eventSection = generateEventSection(travelRequest.events, passenger)
      textContent += eventSection.text
      htmlContent += eventSection.html
      whatsappContent += eventSection.whatsapp
    }

    if (contentType === 'FULL_ITINERARY') {
      const itinerarySection = generateFullItinerary(travelRequest, passenger)
      textContent += itinerarySection.text
      htmlContent += itinerarySection.html
      whatsappContent += itinerarySection.whatsapp
    }
  }

  textContent += '\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards,\nTravel Management Team'
  htmlContent += `
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p><strong>Best regards,</strong><br>Travel Management Team</p>
      </body>
    </html>
  `
  whatsappContent += '\n\nIf you have any questions, please contact us.\n\nBest regards,\nTravel Management Team'

  return { subject, textContent, htmlContent, whatsappContent }
}

// Helper functions for generating sections
function generateFlightSection(flights: any[], passenger: any) {
  const passengerFlights = flights.filter(f =>
    f.passengers.some((p: any) => p.personType === passenger.personType && p.personId === passenger.personId)
  )

  let text = '--- FLIGHT DETAILS ---\n'
  let html = '<h3>Flight Details</h3><ul>'
  let whatsapp = '*FLIGHT DETAILS*\n'

  passengerFlights.forEach(flight => {
    text += `${flight.airline} ${flight.flightNumber} - ${flight.departureAirport} to ${flight.arrivalAirport}\n`
    text += `Departure: ${flight.departureDate ? new Date(flight.departureDate).toLocaleString() : 'TBD'}\n`
    text += `Booking Ref: ${flight.bookingReference || 'N/A'}\n\n`

    html += `<li><strong>${flight.airline} ${flight.flightNumber}</strong> - ${flight.departureAirport} to ${flight.arrivalAirport}<br>`
    html += `Departure: ${flight.departureDate ? new Date(flight.departureDate).toLocaleString() : 'TBD'}<br>`
    html += `Booking Ref: ${flight.bookingReference || 'N/A'}</li>`

    whatsapp += `${flight.airline} ${flight.flightNumber} - ${flight.departureAirport} to ${flight.arrivalAirport}\n`
    whatsapp += `Departure: ${flight.departureDate ? new Date(flight.departureDate).toLocaleString() : 'TBD'}\n`
    whatsapp += `Booking Ref: ${flight.bookingReference || 'N/A'}\n\n`
  })

  html += '</ul>'
  return { text, html, whatsapp }
}

function generatePrivateJetSection(jets: any[], passenger: any) {
  const passengerJets = jets.filter(j =>
    j.passengers.some((p: any) => p.personType === passenger.personType && p.personId === passenger.personId)
  )

  let text = '--- PRIVATE JET DETAILS ---\n'
  let html = '<h3>Private Jet Details</h3><ul>'
  let whatsapp = '*PRIVATE JET DETAILS*\n'

  passengerJets.forEach(jet => {
    text += `${jet.aircraftType || 'Private Jet'} - ${jet.departureAirport} to ${jet.arrivalAirport}\n`
    text += `Departure: ${jet.departureDate ? new Date(jet.departureDate).toLocaleString() : 'TBD'}\n\n`

    html += `<li><strong>${jet.aircraftType || 'Private Jet'}</strong> - ${jet.departureAirport} to ${jet.arrivalAirport}<br>`
    html += `Departure: ${jet.departureDate ? new Date(jet.departureDate).toLocaleString() : 'TBD'}</li>`

    whatsapp += `${jet.aircraftType || 'Private Jet'} - ${jet.departureAirport} to ${jet.arrivalAirport}\n`
    whatsapp += `Departure: ${jet.departureDate ? new Date(jet.departureDate).toLocaleString() : 'TBD'}\n\n`
  })

  html += '</ul>'
  return { text, html, whatsapp }
}

function generateHotelSection(hotels: any[], passenger: any) {
  const passengerHotels = hotels.filter(h =>
    h.rooms.some((r: any) => r.assignments.some((a: any) =>
      a.personType === passenger.personType && a.personId === passenger.personId
    ))
  )

  let text = '--- HOTEL DETAILS ---\n'
  let html = '<h3>Hotel Details</h3><ul>'
  let whatsapp = '*HOTEL DETAILS*\n'

  passengerHotels.forEach(hotel => {
    text += `${hotel.hotelName} - ${hotel.city}, ${hotel.country}\n`
    text += `Check-in: ${hotel.checkInDate ? new Date(hotel.checkInDate).toLocaleDateString() : 'TBD'}\n`
    text += `Check-out: ${hotel.checkOutDate ? new Date(hotel.checkOutDate).toLocaleDateString() : 'TBD'}\n\n`

    html += `<li><strong>${hotel.hotelName}</strong> - ${hotel.city}, ${hotel.country}<br>`
    html += `Check-in: ${hotel.checkInDate ? new Date(hotel.checkInDate).toLocaleDateString() : 'TBD'}<br>`
    html += `Check-out: ${hotel.checkOutDate ? new Date(hotel.checkOutDate).toLocaleDateString() : 'TBD'}</li>`

    whatsapp += `${hotel.hotelName} - ${hotel.city}, ${hotel.country}\n`
    whatsapp += `Check-in: ${hotel.checkInDate ? new Date(hotel.checkInDate).toLocaleDateString() : 'TBD'}\n`
    whatsapp += `Check-out: ${hotel.checkOutDate ? new Date(hotel.checkOutDate).toLocaleDateString() : 'TBD'}\n\n`
  })

  html += '</ul>'
  return { text, html, whatsapp }
}

function generateEventSection(events: any[], passenger: any) {
  const passengerEvents = events.filter(e =>
    e.participants.some((p: any) => p.personType === passenger.personType && p.personId === passenger.personId)
  )

  let text = '--- EVENTS & ACTIVITIES ---\n'
  let html = '<h3>Events & Activities</h3><ul>'
  let whatsapp = '*EVENTS & ACTIVITIES*\n'

  passengerEvents.forEach(event => {
    text += `${event.eventName} (${event.eventType})\n`
    text += `Date: ${event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'}\n`
    if (event.location) text += `Location: ${event.location}\n`
    if (event.startTime) text += `Time: ${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}\n`
    text += '\n'

    html += `<li><strong>${event.eventName}</strong> (${event.eventType})<br>`
    html += `Date: ${event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'}<br>`
    if (event.location) html += `Location: ${event.location}<br>`
    if (event.startTime) html += `Time: ${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}<br>`
    html += '</li>'

    whatsapp += `${event.eventName} (${event.eventType})\n`
    whatsapp += `Date: ${event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'}\n`
    if (event.location) whatsapp += `Location: ${event.location}\n`
    if (event.startTime) whatsapp += `Time: ${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}\n`
    whatsapp += '\n'
  })

  html += '</ul>'
  return { text, html, whatsapp }
}

function generateFullItinerary(travelRequest: any, passenger: any) {
  let text = '--- COMPLETE ITINERARY ---\n'
  text += `Trip: ${travelRequest.requestNumber}\n`
  text += `Dates: ${travelRequest.tripStartDate ? new Date(travelRequest.tripStartDate).toLocaleDateString() : 'TBD'} - ${travelRequest.tripEndDate ? new Date(travelRequest.tripEndDate).toLocaleDateString() : 'TBD'}\n\n`

  let html = '<h3>Complete Itinerary</h3>'
  html += `<p><strong>Trip:</strong> ${travelRequest.requestNumber}<br>`
  html += `<strong>Dates:</strong> ${travelRequest.tripStartDate ? new Date(travelRequest.tripStartDate).toLocaleDateString() : 'TBD'} - ${travelRequest.tripEndDate ? new Date(travelRequest.tripEndDate).toLocaleDateString() : 'TBD'}</p>`

  let whatsapp = '*COMPLETE ITINERARY*\n'
  whatsapp += `Trip: ${travelRequest.requestNumber}\n`
  whatsapp += `Dates: ${travelRequest.tripStartDate ? new Date(travelRequest.tripStartDate).toLocaleDateString() : 'TBD'} - ${travelRequest.tripEndDate ? new Date(travelRequest.tripEndDate).toLocaleDateString() : 'TBD'}\n\n`

  // Include all sections for full itinerary
  if (travelRequest.flights.length > 0) {
    const flightSection = generateFlightSection(travelRequest.flights, passenger)
    text += flightSection.text
    html += flightSection.html
    whatsapp += flightSection.whatsapp
  }

  if (travelRequest.hotels.length > 0) {
    const hotelSection = generateHotelSection(travelRequest.hotels, passenger)
    text += hotelSection.text
    html += hotelSection.html
    whatsapp += hotelSection.whatsapp
  }

  if (travelRequest.events.length > 0) {
    const eventSection = generateEventSection(travelRequest.events, passenger)
    text += eventSection.text
    html += eventSection.html
    whatsapp += eventSection.whatsapp
  }

  return { text, html, whatsapp }
}
