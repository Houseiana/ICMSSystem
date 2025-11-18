'use client'

import { forwardRef } from 'react'
import { Plane, Hotel, Calendar, MapPin, Clock, Users, Train, Car, Building2 } from 'lucide-react'

interface ItineraryTemplateProps {
  travelRequest: any
}

export const ItineraryTemplate = forwardRef<HTMLDivElement, ItineraryTemplateProps>(
  ({ travelRequest }, ref) => {
    // Group all items by date
    const groupedByDate = groupItemsByDate(travelRequest)

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-4 border-blue-600 pb-6 mb-8">
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
          <div className="mb-8">
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
        {groupedByDate.length > 0 ? (
          <div className="space-y-8">
            {groupedByDate.map((day, dayIndex) => (
              <div key={dayIndex} className="border-l-4 border-blue-600 pl-6">
                <div className="mb-4">
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

                <div className="space-y-4">
                  {day.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-gray-50 p-4 rounded-lg">
                      {renderItem(item)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No scheduled activities yet</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
          <p>This itinerary is subject to change. Please confirm all details before traveling.</p>
          <p className="mt-2">For questions or changes, please contact your travel coordinator.</p>
        </div>
      </div>
    )
  }
)

ItineraryTemplate.displayName = 'ItineraryTemplate'

// Helper function to group items by date
function groupItemsByDate(travelRequest: any) {
  const dateMap = new Map<string, any[]>()

  // Add flights
  travelRequest.flights?.forEach((flight: any) => {
    if (flight.departureDate) {
      const dateKey = new Date(flight.departureDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'flight', data: flight, date: flight.departureDate })
    }
  })

  // Add private jets
  travelRequest.privateJets?.forEach((jet: any) => {
    if (jet.departureDate) {
      const dateKey = new Date(jet.departureDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'privateJet', data: jet, date: jet.departureDate })
    }
  })

  // Add trains
  travelRequest.trains?.forEach((train: any) => {
    if (train.departureDate) {
      const dateKey = new Date(train.departureDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'train', data: train, date: train.departureDate })
    }
  })

  // Add hotels (check-in date)
  travelRequest.hotels?.forEach((hotel: any) => {
    if (hotel.checkInDate) {
      const dateKey = new Date(hotel.checkInDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'hotel', data: hotel, date: hotel.checkInDate, isCheckIn: true })
    }
    if (hotel.checkOutDate) {
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
      const dateKey = new Date(event.eventDate).toDateString()
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, [])
      }
      dateMap.get(dateKey)!.push({ type: 'event', data: event, date: event.eventDate })
    }
  })

  // Convert map to sorted array
  const sortedDays = Array.from(dateMap.entries())
    .map(([dateString, items]) => ({
      date: dateString,
      items: items.sort((a, b) => {
        const timeA = extractTime(a)
        const timeB = extractTime(b)
        if (timeA && timeB) {
          return timeA.localeCompare(timeB)
        }
        return 0
      })
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return sortedDays
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
  return null
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
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {data.departureTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Departs {data.departureTime}
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
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {data.departureTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Departs {data.departureTime}
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
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              {data.departureTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Departs {data.departureTime}
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

    default:
      return <div>Unknown item type</div>
  }
}
