import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * GET /api/travel/flights
 * Get all flights with optional filters
 * Query params:
 *   - travelRequestId: filter by travel request
 *   - status: filter by status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const travelRequestId = searchParams.get('travelRequestId')
    const status = searchParams.get('status')

    const where: any = {}

    if (travelRequestId) {
      where.travelRequestId = parseInt(travelRequestId)
    }

    if (status) {
      where.status = status
    }

    const flights = await prisma.tripFlight.findMany({
      where,
      include: {
        passengers: true,
        travelRequest: {
          select: {
            id: true,
            requestNumber: true,
            status: true
          }
        }
      },
      orderBy: {
        departureDate: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: flights,
      count: flights.length
    })
  } catch (error) {
    console.error('Error fetching flights:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flights' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/travel/flights
 * Create a new flight
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const flight = await prisma.tripFlight.create({
      data: {
        travelRequestId: body.travelRequestId,
        flightNumber: body.flightNumber,
        airline: body.airline,
        departureAirport: body.departureAirport,
        arrivalAirport: body.arrivalAirport,
        departureDate: body.departureDate ? new Date(body.departureDate) : null,
        departureTime: body.departureTime,
        arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : null,
        arrivalTime: body.arrivalTime,
        class: body.class,
        price: body.price,
        bookingReference: body.bookingReference,
        terminal: body.terminal,
        gate: body.gate,
        seatNumbers: body.seatNumbers,
        baggageAllowance: body.baggageAllowance,
        mealPreference: body.mealPreference,
        status: body.status || 'PENDING',
        notes: body.notes,
        // New flight enhancements
        aircraftModel: body.aircraftModel,
        specialRequests: body.specialRequests,
        tripType: body.tripType,
        fareTermsConditions: body.fareTermsConditions,
        changeStatus: body.changeStatus,
        changeDate: body.changeDate ? new Date(body.changeDate) : null,
        changePrice: body.changePrice,
        changedDepartureDate: body.changedDepartureDate ? new Date(body.changedDepartureDate) : null,
        changedDepartureTime: body.changedDepartureTime,
        changedArrivalDate: body.changedArrivalDate ? new Date(body.changedArrivalDate) : null,
        changedArrivalTime: body.changedArrivalTime,
        changeLeg: body.changeLeg,
        // Add passengers if provided
        ...(body.passengers && body.passengers.length > 0 && {
          passengers: {
            create: body.passengers.map((p: any) => ({
              personType: p.personType,
              personId: p.personId,
              seatNumber: p.seatNumber,
              mealPreference: p.mealPreference,
              specialAssistance: p.specialAssistance
            }))
          }
        })
      },
      include: {
        passengers: true
      }
    })

    return NextResponse.json({
      success: true,
      data: flight
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating flight:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create flight' },
      { status: 500 }
    )
  }
}
