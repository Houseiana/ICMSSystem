'use client'

import { useRouter } from 'next/navigation'
import {
  getMonthDays,
  getShortDayNames,
  getTripsForDate,
  getStatusColor,
  isTripStartDate,
  type TripEvent
} from '@/lib/utils/calendarUtils'
import { MapPin, Users, AlertTriangle } from 'lucide-react'

interface MonthlyCalendarProps {
  currentDate: Date
  trips: TripEvent[]
  conflicts: Map<number, number[]>
}

export function MonthlyCalendar({ currentDate, trips, conflicts }: MonthlyCalendarProps) {
  const router = useRouter()
  const days = getMonthDays(currentDate)
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

    return (
      <div
        key={trip.id}
        onClick={(e) => {
          e.stopPropagation()
          handleTripClick(trip.id)
        }}
        className={`
          ${statusColor}
          text-xs px-2 py-1 rounded border cursor-pointer
          hover:shadow-md transition-all mb-1
          flex items-center gap-1 truncate
        `}
        title={`${trip.requestNumber} - ${destinations}`}
      >
        {hasConflict && (
          <AlertTriangle className="w-3 h-3 flex-shrink-0 text-red-600" />
        )}
        <span className="font-semibold truncate">{trip.requestNumber}</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Day Names Header */}
      <div className="grid grid-cols-7 bg-gray-100 border-b">
        {dayNames.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-sm font-semibold text-gray-700 border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayTrips = getTripsForDate(trips, day.date)
          const isWeekend = day.isWeekend

          return (
            <div
              key={index}
              className={`
                min-h-[120px] border-r border-b last:border-r-0
                ${!day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                ${day.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
                ${isWeekend ? 'bg-gray-50/50' : ''}
                hover:bg-gray-50 transition-colors
                p-2
              `}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`
                    text-sm font-semibold
                    ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                    ${day.isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : ''}
                  `}
                >
                  {day.dayNumber}
                </span>
                {dayTrips.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                    {dayTrips.length}
                  </span>
                )}
              </div>

              {/* Trips for this day */}
              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                {dayTrips.slice(0, 3).map((trip) => renderTrip(trip, day.date))}
                {dayTrips.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{dayTrips.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
