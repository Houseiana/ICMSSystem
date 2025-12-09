'use client'

import { forwardRef } from 'react'
import { Plane, Hotel, Calendar, MapPin, Clock, Users, Train, Car, Building2, Coffee, UserCheck } from 'lucide-react'

interface ItineraryTemplateProps {
  travelRequest: any
}

export const ItineraryTemplate = forwardRef<HTMLDivElement, ItineraryTemplateProps>(
  ({ travelRequest }, ref) => {
    // Group all items by date, including free days
    const allDays = generateAllTripDays(travelRequest)

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto print-container">
        {/* Print Styles - Using table display for reliable page break prevention */}
        <style>{`
          @media print {
            /* Page setup */
            @page {
              margin: 12mm 10mm;
              size: A4;
            }

            /* Reset all margins and padding for print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* Container setup */
            .print-container {
              padding: 0 !important;
              max-width: 100% !important;
              font-size: 11pt !important;
            }

            /* Use table display - most reliable for preventing breaks */
            .print-block {
              display: table !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Header block */
            .print-header {
              display: table !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 15px !important;
            }

            /* Travelers section */
            .print-travelers {
              display: table !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 15px !important;
            }

            /* Each day section - can break between days but not within items */
            .print-day {
              display: table !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 15px !important;
            }

            /* Day header */
            .print-day-header {
              display: table-caption !important;
              caption-side: top !important;
              page-break-after: avoid !important;
              break-after: avoid !important;
            }

            /* Individual items - CRITICAL: must stay together */
            .print-item {
              display: table !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 8px !important;
            }

            /* Free day block */
            .print-free-day {
              display: table !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Footer */
            .print-footer {
              display: table !important;
              width: 100% !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-top: 20px !important;
            }

            /* Force all content blocks to stay together */
            .print-item > *,
            .print-header > *,
            .print-travelers > *,
            .print-day > *,
            .print-free-day > *,
            .print-footer > * {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Ensure flex containers work in print */
            .flex {
              display: flex !important;
            }

            /* Hide screen-only elements */
            .no-print {
              display: none !important;
            }
          }

          /* Additional screen styles for print preview */
          @media screen {
            .print-block,
            .print-header,
            .print-travelers,
            .print-day,
            .print-item,
            .print-free-day,
            .print-footer {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}</style>

        {/* Header */}
        <div
          className="border-b-4 border-blue-600 pb-6 mb-8 print-header"
          style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Travel Itinerary
          </h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-600">
                Request #{travelRequest.requestNumber}
              </p>
              {travelRequest.tripStartDate && travelRequest.tripEndDate && (
                <p className="text-gray-500 mt-1">
                  {new Date(travelRequest.tripStartDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })} - {new Date(travelRequest.tripEndDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Generated on</p>
              <p className="text-gray-700 font-medium">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Passengers */}
        {travelRequest.passengers && travelRequest.passengers.length > 0 && (
          <div
            className="mb-8 print-travelers"
            style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Travelers</h2>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                {travelRequest.passengers.map((passenger: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      {passenger.personDetails?.fullName || 'Unknown'}
                      {passenger.isMainPassenger && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Day-by-Day Breakdown */}
        {allDays.length > 0 ? (
          <div className="space-y-8">
            {allDays.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`border-l-4 pl-6 print-day ${day.isFreeDay ? 'border-gray-300' : 'border-blue-600'}`}
                style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
              >
                <div className="mb-4 print-day-header">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Day {dayIndex + 1}
                  </h2>
                  <p className="text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {day.isFreeDay ? (
                  <div
                    className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200 print-free-day"
                    style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700 text-lg">Free Day</h3>
                        <p className="text-gray-500 text-sm">No scheduled activities - enjoy your leisure time!</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {day.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="bg-gray-50 p-4 rounded-lg print-item"
                        style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
                      >
                        {renderItem(item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No trip dates set. Please set the trip start and end dates.</p>
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-12 pt-6 border-t text-center text-sm text-gray-500 print-footer"
          style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
        >
          <p>This itinerary is subject to change. Please confirm all details before traveling.</p>
          <p className="mt-2">For questions or changes, please contact your travel coordinator.</p>
        </div>
      </div>
    )
  }
)

ItineraryTemplate.displayName = 'ItineraryTemplate'

// Helper function to generate all trip days from start to end, including free days
function generateAllTripDays(travelRequest: any) {
  // Build a map of items by date first, then determine actual date range
  const dateMap = new Map<string, any[]>()
  const allDates: Date[] = []

  // Helper to track dates
  const trackDate = (dateStr: string | Date | null | undefined) => {
    if (dateStr) {
      const d = new Date(dateStr)
      d.setHours(0, 0, 0, 0)
      allDates.push(d)
    }
  }

  // Add trip dates as boundaries
  if (travelRequest.tripStartDate) {
    trackDate(travelRequest.tripStartDate)
  }
  if (travelRequest.tripEndDate) {
    trackDate(travelRequest.tripEndDate)
  }

  // Add flights
  travelRequest.flights?.forEach((flight: any) => {
    if (flight.departureDate) {
      trackDate(flight.departureDate)
      const dateKey = new Date(flight.departureDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'flight', data: flight, date: flight.departureDate })
    }
    // Also track arrival date if different from departure
    if (flight.arrivalDate) {
      trackDate(flight.arrivalDate)
    }
  })

  // Add private jets
  travelRequest.privateJets?.forEach((jet: any) => {
    if (jet.departureDate) {
      trackDate(jet.departureDate)
      const dateKey = new Date(jet.departureDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'privateJet', data: jet, date: jet.departureDate })
    }
    if (jet.arrivalDate) {
      trackDate(jet.arrivalDate)
    }
  })

  // Add trains
  travelRequest.trains?.forEach((train: any) => {
    if (train.departureDate) {
      trackDate(train.departureDate)
      const dateKey = new Date(train.departureDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'train', data: train, date: train.departureDate })
    }
    if (train.arrivalDate) {
      trackDate(train.arrivalDate)
    }
  })

  // Add rental cars (pickup date)
  travelRequest.rentalCarsSelfDrive?.forEach((car: any) => {
    if (car.pickupDate) {
      trackDate(car.pickupDate)
      const dateKey = new Date(car.pickupDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'rentalCar', data: car, date: car.pickupDate, isPickup: true })
    }
    if (car.returnDate) {
      trackDate(car.returnDate)
      const dateKey = new Date(car.returnDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'rentalCar', data: car, date: car.returnDate, isPickup: false })
    }
  })

  // Add cars with driver
  travelRequest.carsWithDriver?.forEach((car: any) => {
    if (car.pickupDate) {
      trackDate(car.pickupDate)
      const dateKey = new Date(car.pickupDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'carWithDriver', data: car, date: car.pickupDate })
    }
    if (car.dropoffDate) {
      trackDate(car.dropoffDate)
    }
  })

  // Add hotels (check-in date)
  travelRequest.hotels?.forEach((hotel: any) => {
    if (hotel.checkInDate) {
      trackDate(hotel.checkInDate)
      const dateKey = new Date(hotel.checkInDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'hotel', data: hotel, date: hotel.checkInDate, isCheckIn: true })
    }
    if (hotel.checkOutDate) {
      trackDate(hotel.checkOutDate)
      const dateKey = new Date(hotel.checkOutDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'hotel', data: hotel, date: hotel.checkOutDate, isCheckIn: false })
    }
  })

  // Add events
  travelRequest.events?.forEach((event: any) => {
    if (event.eventDate) {
      trackDate(event.eventDate)
      const dateKey = new Date(event.eventDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'event', data: event, date: event.eventDate })
    }
  })

  // Add embassy services
  travelRequest.embassyServices?.forEach((service: any) => {
    if (service.appointmentDate) {
      trackDate(service.appointmentDate)
      const dateKey = new Date(service.appointmentDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'embassy', data: service, date: service.appointmentDate })
    }
  })

  // Add meet & assist services
  travelRequest.meetAssist?.forEach((service: any) => {
    if (service.serviceDate) {
      trackDate(service.serviceDate)
      const dateKey = new Date(service.serviceDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'meetAssist', data: service, date: service.serviceDate })
    }
  })

  // If no dates found, return empty array
  if (allDates.length === 0) {
    return []
  }

  // Find the actual start and end dates from all collected dates
  const startDate = new Date(Math.min(...allDates.map(d => d.getTime())))
  const endDate = new Date(Math.max(...allDates.map(d => d.getTime())))

  // Reset time to midnight for consistent comparison
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  // Generate all days from start to end
  const allDays: Array<{ date: string; items: any[]; isFreeDay: boolean }> = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateKey = currentDate.toDateString()
    const items = dateMap.get(dateKey) || []

    // Sort items by logical travel sequence and time
    const sortedItems = items.sort((a, b) => {
      const timeA = extractTime(a)
      const timeB = extractTime(b)
      const priorityA = getItemPriority(a)
      const priorityB = getItemPriority(b)

      // First, compare by time if both have times
      if (timeA && timeB) {
        const timeCompare = timeA.localeCompare(timeB)
        if (timeCompare !== 0) {
          return timeCompare
        }
      }

      // If times are equal or missing, sort by logical priority
      return priorityA - priorityB
    })

    allDays.push({
      date: dateKey,
      items: sortedItems,
      isFreeDay: sortedItems.length === 0
    })

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return allDays
}

// Extract time from item for sorting
function extractTime(item: any): string | null {
  const data = item.data
  if (item.type === 'flight' || item.type === 'privateJet') {
    return data.departureTime
  }
  if (item.type === 'train') {
    return data.departureTime
  }
  if (item.type === 'event') {
    return data.startTime
  }
  if (item.type === 'hotel') {
    return item.isCheckIn ? (data.checkInTime || '15:00') : (data.checkOutTime || '11:00')
  }
  if (item.type === 'embassy') {
    return data.appointmentTime
  }
  if (item.type === 'meetAssist') {
    return data.serviceTime
  }
  if (item.type === 'rentalCar') {
    return item.isPickup ? data.pickupTime : data.returnTime
  }
  if (item.type === 'carWithDriver') {
    return data.pickupTime
  }
  return null
}

// Get priority for logical travel sequence sorting
// Lower number = earlier in the day's sequence
function getItemPriority(item: any): number {
  const data = item.data

  // Hotel check-out happens first (leaving the hotel)
  if (item.type === 'hotel' && !item.isCheckIn) {
    return 1
  }

  // Meet & Assist DEPARTURE service (before leaving at airport)
  if (item.type === 'meetAssist' && (data.serviceType === 'DEPARTURE' || data.serviceType === 'BOTH')) {
    return 2
  }

  // Transport (flight, train, private jet) - these come next
  if (item.type === 'flight' || item.type === 'privateJet' || item.type === 'train') {
    return 3
  }

  // Meet & Assist ARRIVAL service (after arriving at airport)
  if (item.type === 'meetAssist' && data.serviceType === 'ARRIVAL') {
    return 4
  }

  // Meet & Assist TRANSIT service
  if (item.type === 'meetAssist' && data.serviceType === 'TRANSIT') {
    return 5
  }

  // Car pickup (rental or with driver) - after arriving
  if (item.type === 'rentalCar' && item.isPickup) {
    return 6
  }
  if (item.type === 'carWithDriver') {
    return 6
  }

  // Hotel check-in (after transport and car)
  if (item.type === 'hotel' && item.isCheckIn) {
    return 7
  }

  // Events and activities during the day
  if (item.type === 'event') {
    return 8
  }

  // Embassy services
  if (item.type === 'embassy') {
    return 9
  }

  // Car return (usually at end)
  if (item.type === 'rentalCar' && !item.isPickup) {
    return 10
  }

  // Default priority for anything else
  return 50
}

// Render individual item
function renderItem(item: any) {
  const data = item.data

  switch (item.type) {
    case 'flight':
      return (
        <div className="flex items-start gap-3">
          <Plane className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Flight: {data.airline} {data.flightNumber}
            </h3>
            <p className="text-gray-700 mt-1">
              {data.departureAirport} → {data.arrivalAirport}
            </p>
            <div className="flex items-center flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {data.departureTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Departs {data.departureTime}
                </span>
              )}
              {data.arrivalTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Arrives {data.arrivalTime}
                </span>
              )}
              {data.bookingReference && (
                <span>Ref: {data.bookingReference}</span>
              )}
            </div>
          </div>
        </div>
      )

    case 'privateJet':
      return (
        <div className="flex items-start gap-3">
          <Plane className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Private Jet: {data.aircraftType || 'Charter Flight'}
            </h3>
            <p className="text-gray-700 mt-1">
              {data.departureAirport} → {data.arrivalAirport}
            </p>
            <div className="flex items-center flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {data.departureTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Departs {data.departureTime}
                </span>
              )}
              {data.arrivalTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Arrives {data.arrivalTime}
                </span>
              )}
            </div>
          </div>
        </div>
      )

    case 'train':
      return (
        <div className="flex items-start gap-3">
          <Train className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Train: {data.trainNumber || data.operator}
            </h3>
            <p className="text-gray-700 mt-1">
              {data.departureStation} → {data.arrivalStation}
            </p>
            <div className="flex items-center flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {data.departureTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Departs {data.departureTime}
                </span>
              )}
              {data.arrivalTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Arrives {data.arrivalTime}
                </span>
              )}
              {data.class && <span>Class: {data.class}</span>}
            </div>
          </div>
        </div>
      )

    case 'hotel':
      return (
        <div className="flex items-start gap-3">
          <Hotel className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {item.isCheckIn ? 'Check-in' : 'Check-out'}: {data.hotelName}
            </h3>
            <p className="text-gray-700 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {data.city}, {data.country}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {item.isCheckIn
                  ? (data.checkInTime || '15:00')
                  : (data.checkOutTime || '11:00')}
              </span>
              {data.confirmationNumber && (
                <span>Conf: {data.confirmationNumber}</span>
              )}
            </div>
            {item.isCheckIn && data.rooms && data.rooms.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Rooms ({data.rooms.length}):
                </p>
                <div className="space-y-2">
                  {data.rooms.map((room: any, idx: number) => (
                    <div key={idx} className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {room.unitCategory} {room.roomNumber ? `#${room.roomNumber}` : `${idx + 1}`}
                        </span>
                        {room.pricePerNight && (
                          <span className="text-xs font-semibold text-blue-600">${room.pricePerNight}/night</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        {room.bedType && <span>• {room.bedType}</span>}
                        {room.guestNumbers && <span>• {room.guestNumbers} {room.guestNumbers === 1 ? 'guest' : 'guests'}</span>}
                        {room.bathrooms && <span>• {room.bathrooms} {room.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )

    case 'event':
      return (
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {data.eventName}
            </h3>
            {data.location && (
              <p className="text-gray-700 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {data.location}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {data.startTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {data.startTime}
                  {data.endTime && ` - ${data.endTime}`}
                </span>
              )}
              {data.eventType && (
                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                  {data.eventType}
                </span>
              )}
            </div>
          </div>
        </div>
      )

    case 'rentalCar':
      return (
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Rental Car {item.isPickup ? 'Pickup' : 'Return'}: {data.vehicleType || 'Vehicle'}
            </h3>
            <p className="text-gray-700 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {item.isPickup ? data.pickupLocation : data.returnLocation}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {(item.isPickup ? data.pickupTime : data.returnTime) && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {item.isPickup ? data.pickupTime : data.returnTime}
                </span>
              )}
              {data.rentalCompany && <span>{data.rentalCompany}</span>}
              {data.bookingReference && <span>Ref: {data.bookingReference}</span>}
            </div>
          </div>
        </div>
      )

    case 'carWithDriver':
      return (
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Car with Driver: {data.vehicleType || 'Vehicle'}
            </h3>
            <p className="text-gray-700 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {data.pickupLocation}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {data.pickupTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {data.pickupTime}
                </span>
              )}
              {data.driverName && <span>Driver: {data.driverName}</span>}
              {data.companyName && <span>{data.companyName}</span>}
            </div>
          </div>
        </div>
      )

    case 'embassy':
      return (
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Embassy Appointment: {data.embassyName || data.serviceType}
            </h3>
            {data.embassyAddress && (
              <p className="text-gray-700 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {data.embassyAddress}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {data.appointmentTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {data.appointmentTime}
                </span>
              )}
              {data.serviceType && (
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                  {data.serviceType}
                </span>
              )}
              {data.applicationNumber && <span>App#: {data.applicationNumber}</span>}
            </div>
          </div>
        </div>
      )

    case 'meetAssist':
      return (
        <div className="flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-violet-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Meet & Assist: {data.airport} {data.airportName ? `- ${data.airportName}` : ''}
            </h3>
            <p className="text-gray-700 mt-1">
              {data.serviceType === 'ARRIVAL' ? 'Arrival Service' :
               data.serviceType === 'DEPARTURE' ? 'Departure Service' :
               data.serviceType === 'BOTH' ? 'Arrival & Departure Service' :
               data.serviceType === 'TRANSIT' ? 'Transit Service' : data.serviceType}
              {data.vipLevel && data.vipLevel !== 'STANDARD' && ` (${data.vipLevel})`}
            </p>
            {data.meetingPoint && (
              <p className="text-gray-700 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {data.meetingPoint}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {data.serviceTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {data.serviceTime}
                </span>
              )}
              {data.flightNumber && <span>Flight: {data.flightNumber}</span>}
              {data.serviceProvider && <span>{data.serviceProvider}</span>}
            </div>
            {(data.includesFastTrack || data.includesLounge || data.includesPorterage || data.includesBuggy) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.includesFastTrack && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Fast Track</span>
                )}
                {data.includesLounge && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Lounge Access</span>
                )}
                {data.includesPorterage && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Porterage</span>
                )}
                {data.includesBuggy && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Buggy</span>
                )}
              </div>
            )}
            {data.greeterName && (
              <p className="text-xs text-gray-500 mt-2">
                Greeter: {data.greeterName} {data.greeterPhone && `(${data.greeterPhone})`}
              </p>
            )}
          </div>
        </div>
      )

    default:
      return <div>Unknown item type</div>
  }
}
