import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/services/email'
import { sendWhatsApp, whatsAppTemplates } from '@/lib/services/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { travelRequestId, sendEmail: shouldSendEmail, sendWhatsApp: shouldSendWhatsApp, recipientEmail, recipientPhone } = body

    if (!travelRequestId) {
      return NextResponse.json(
        { error: 'Travel request ID is required' },
        { status: 400 }
      )
    }

    // Fetch travel request with all related data
    const travelRequest = await prisma.travelRequest.findUnique({
      where: { id: parseInt(travelRequestId) },
      include: {
        passengers: true,
        flights: true,
        hotels: {
          include: {
            rooms: true
          }
        },
        rentalCarsSelfDrive: true,
        destinations: true
      }
    })

    if (!travelRequest) {
      return NextResponse.json(
        { error: 'Travel request not found' },
        { status: 404 }
      )
    }

    const results: { email?: any; whatsapp?: any } = {}

    // Prepare common data
    const mainPassenger = travelRequest.passengers[0]
    const recipientName = mainPassenger?.fullName || 'Traveler'
    const destination = travelRequest.destinations[0]?.city || travelRequest.destinations[0]?.country || 'Destination'
    const travelDate = travelRequest.tripStartDate
      ? new Date(travelRequest.tripStartDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'TBD'

    // Format flights data
    const flights = travelRequest.flights.map(flight => ({
      airline: flight.airline || 'Unknown',
      flightNumber: flight.flightNumber || '',
      departureCity: flight.departureAirport || '',
      arrivalCity: flight.arrivalAirport || '',
      departureDate: flight.departureDate
        ? new Date(flight.departureDate).toLocaleDateString()
        : '',
      departureTime: flight.departureTime || ''
    }))

    // Format hotels data
    const hotels = travelRequest.hotels.map(hotel => ({
      hotelName: hotel.hotelName,
      city: hotel.city || '',
      checkIn: hotel.checkInDate
        ? new Date(hotel.checkInDate).toLocaleDateString()
        : '',
      checkOut: hotel.checkOutDate
        ? new Date(hotel.checkOutDate).toLocaleDateString()
        : ''
    }))

    // Format cars data
    const cars = travelRequest.rentalCarsSelfDrive.map(car => ({
      carType: car.carType || 'Rental Car',
      pickupLocation: car.pickupLocation || '',
      pickupDate: car.pickupDate
        ? new Date(car.pickupDate).toLocaleDateString()
        : '',
      dropoffDate: car.returnDate
        ? new Date(car.returnDate).toLocaleDateString()
        : ''
    }))

    // Send Email
    if (shouldSendEmail && recipientEmail) {
      const emailTemplate = emailTemplates.itineraryConfirmation({
        recipientName,
        travelRequestId: travelRequestId.toString(),
        travelDate,
        destination,
        flights,
        hotels,
        cars
      })

      results.email = await sendEmail({
        to: recipientEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      })
    }

    // Send WhatsApp
    if (shouldSendWhatsApp && recipientPhone) {
      const whatsappMessage = whatsAppTemplates.itineraryConfirmation({
        recipientName,
        travelRequestId: travelRequestId.toString(),
        travelDate,
        destination,
        flights,
        hotels
      })

      results.whatsapp = await sendWhatsApp({
        to: recipientPhone,
        message: whatsappMessage
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Itinerary sent successfully',
      results
    })
  } catch (error: any) {
    console.error('Error sending itinerary:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send itinerary' },
      { status: 500 }
    )
  }
}
