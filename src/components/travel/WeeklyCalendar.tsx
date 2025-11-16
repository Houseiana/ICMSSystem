'use client'

import { useRouter } from 'next/navigation'
import {
  getWeekDays,
  getShortDayNames,
  getTripsForDate,
  getStatusColor,
  isTripStartDate,
  getTripDuration,
  type TripEvent
} from '@/lib/utils/calendarUtils'
import { MapPin, Users, AlertTriangle, Calendar } from 'lucide-react'

interface WeeklyCalendarProps {
  currentDate: Date
  trips: TripEvent[]
  conflicts: Map<number, number[]>
}

export function WeeklyCalendar({ currentDate, trips, conflicts }: WeeklyCalendarProps) {
  const router = useRouter()
  const days = getWeekDays(currentDate)
  const dayNames = getShortDayNames()

  const handleTripClick = (tripId: number) => {
    router.push(`/travel/${tripId}`)
  }

  const renderTrip = (trip: TripEvent, date: Date) => {
    const isStart = isTripStartDate(trip, date)
    const hasConflict = conflicts.has(trip.id)

    // Only render on start date or first visible day
    if (!isStart) return null

    const statusColor = getStatusColor(trip.status)
    const destinations = trip.destinations?.slice(0, 2).map(d => `${d.city}, ${d.country}`).join(' → ') || 'No destination'
    const duration = getTripDuration(trip)
    const passengerCount = trip.passengers?.length || 0

    return (
      <div
        key={trip.id}
        onClick={(e) => {
          e.stopPropagation()
          handleTripClick(trip.id)
        }}
        className={`
          ${statusColor}
          p-3 rounded-lg border-2 cursor-pointer
          hover:shadow-lg transition-all mb-2
        `}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1">
            {hasConflict && (
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
            )}
            <span className="font-bold text-sm">{trip.requestNumber}</span>
          </div>
          <span className={`
            text-xs px-2 py-0.5 rounded-full font-medium
            ${trip.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : ''}
            ${trip.status === 'APPROVED' ? 'bg-green-200 text-green-800' : ''}
            ${trip.status === 'IN_PROGRESS' ? 'bg-blue-200 text-blue-800' : ''}
            ${trip.status === 'COMPLETED' ? 'bg-gray-200 text-gray-800' : ''}
            ${trip.status === 'REJECTED' || trip.status === 'CANCELLED' ? 'bg-red-200 text-red-800' : ''}
          `}>
            {trip.status}
          </span>
        </div>

        <div className="space-y-1 text-xs">
          {destinations && (
            <div className="flex items-start gap-1">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="truncate">{destinations}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {passengerCount > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{passengerCount} pax</span>
              </div>
            )}

            {duration > 1 && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{duration} days</span>
              </div>
            )}
          </div>

          {trip.notes && (
            <div className="text-gray-600 truncate italic">
              {trip.notes}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Week Header */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-blue-600 to-indigo-600">
        {days.map((day, index) => {
          const isToday = day.isToday
          const dayName = dayNames[index]

          return (
            <div
              key={index}
              className={`
                px-4 py-4 text-center border-r border-blue-500 last:border-r-0
                ${isToday ? 'bg-blue-700' : ''}
              `}
            >
              <div className="text-blue-100 text-xs font-medium mb-1">
                {dayName}
              </div>
              <div className={`
                text-white font-bold text-lg
                ${isToday ? 'bg-white text-blue-600 rounded-full w-8 h-8 mx-auto flex items-center justify-center' : ''}
              `}>
                {day.dayNumber}
              </div>
              <div className="text-blue-200 text-xs mt-1">
                {day.date.toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayTrips = getTripsForDate(trips, day.date)
          const isWeekend = day.isWeekend

          return (
            <div
              key={index}
              className={`
                min-h-[400px] border-r border-b last:border-r-0
                ${isWeekend ? 'bg-gray-50' : 'bg-white'}
                ${day.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
                hover:bg-gray-50 transition-colors
                p-3
              `}
            >
              {/* Trips for this day */}
              <div className="space-y-2 overflow-y-auto max-h-[380px]">
                {dayTrips.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-10">
                    No trips
                  </div>
                ) : (
                  dayTrips.map((trip) => renderTrip(trip, day.date))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
