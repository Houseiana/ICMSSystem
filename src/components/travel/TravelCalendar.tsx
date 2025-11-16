'use client'

import { useState, useEffect } from 'react'
import { MonthlyCalendar } from './MonthlyCalendar'
import { WeeklyCalendar } from './WeeklyCalendar'
import {
  formatMonthYear,
  formatWeekRange,
  navigatePrevious,
  navigateNext,
  navigateToday,
  detectConflicts,
  type CalendarView,
  type TripEvent
} from '@/lib/utils/calendarUtils'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

interface TravelCalendarProps {
  initialTrips?: TripEvent[]
}

export function TravelCalendar({ initialTrips = [] }: TravelCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('month')
  const [trips, setTrips] = useState<TripEvent[]>(initialTrips)
  const [conflicts, setConflicts] = useState<Map<number, number[]>>(new Map())
  const [loading, setLoading] = useState(false)

  // Fetch trips from API
  const fetchTrips = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/travel/requests')
      const data = await response.json()
      if (data.success) {
        setTrips(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  // Detect conflicts whenever trips change
  useEffect(() => {
    const detectedConflicts = detectConflicts(trips)
    setConflicts(detectedConflicts)
  }, [trips])

  // Initial fetch
  useEffect(() => {
    if (initialTrips.length === 0) {
      fetchTrips()
    }
  }, [])

  const handlePrevious = () => {
    setCurrentDate(navigatePrevious(currentDate, view))
  }

  const handleNext = () => {
    setCurrentDate(navigateNext(currentDate, view))
  }

  const handleToday = () => {
    setCurrentDate(navigateToday())
  }

  const handleViewChange = (newView: CalendarView) => {
    setView(newView)
  }

  const formatTitle = () => {
    return view === 'month' ? formatMonthYear(currentDate) : formatWeekRange(currentDate)
  }

  const conflictCount = conflicts.size

  return (
    <div className="space-y-4">
      {/* Calendar Controls */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={handleToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Today
            </button>

            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 ml-4">
              {formatTitle()}
            </h2>
          </div>

          {/* View Switcher & Stats */}
          <div className="flex items-center gap-3">
            {/* Conflict Warning */}
            {conflictCount > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {conflictCount} trip{conflictCount > 1 ? 's' : ''} with conflicts
                </span>
              </div>
            )}

            {/* Trip Count */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {trips.length} trip{trips.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchTrips}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh trips"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* View Buttons */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handleViewChange('month')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                  ${view === 'month'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Calendar className="w-4 h-4" />
                Month
              </button>

              <button
                onClick={() => handleViewChange('week')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                  ${view === 'week'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <CalendarDays className="w-4 h-4" />
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-gray-700 font-medium">Loading trips...</span>
            </div>
          </div>
        )}

        {view === 'month' ? (
          <MonthlyCalendar
            currentDate={currentDate}
            trips={trips}
            conflicts={conflicts}
          />
        ) : (
          <WeeklyCalendar
            currentDate={currentDate}
            trips={trips}
            conflicts={conflicts}
          />
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span className="text-xs text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-xs text-gray-600">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
            <span className="text-xs text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
            <span className="text-xs text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-xs text-gray-600">Rejected/Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-600">Has Conflicts</span>
          </div>
        </div>
      </div>

      {/* Conflict Details */}
      {conflictCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Trip Conflicts Detected
          </h3>
          <p className="text-sm text-red-700 mb-3">
            The following trips have overlapping dates. Click on a trip in the calendar to view details.
          </p>
          <div className="space-y-2">
            {Array.from(conflicts.entries()).map(([tripId, conflictingIds]) => {
              const trip = trips.find(t => t.id === tripId)
              if (!trip) return null

              return (
                <div key={tripId} className="bg-white rounded p-3 text-sm">
                  <div className="font-medium text-gray-900">{trip.requestNumber}</div>
                  <div className="text-gray-600 text-xs">
                    Conflicts with: {conflictingIds.map(id => {
                      const conflictTrip = trips.find(t => t.id === id)
                      return conflictTrip?.requestNumber
                    }).join(', ')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
