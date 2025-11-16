/**
 * Calendar Utilities
 * Helper functions for calendar view functionality
 */

export type CalendarView = 'month' | 'week'

export interface CalendarDay {
  date: Date
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
}

export interface TripEvent {
  id: number
  requestNumber: string
  status: string
  tripStartDate: string
  tripEndDate: string
  notes?: string | null
  destinations?: Array<{
    country: string
    city: string
  }>
  passengers?: Array<{
    id: number
  }>
}

/**
 * Get the first day of the month
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Get the last day of the month
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Get all days to display in a month view (including padding from prev/next month)
 */
export function getMonthDays(date: Date): CalendarDay[] {
  const firstDay = getFirstDayOfMonth(date)
  const lastDay = getLastDayOfMonth(date)
  const startPadding = firstDay.getDay() // 0 = Sunday
  const endPadding = 6 - lastDay.getDay()

  const days: CalendarDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Add days from previous month
  for (let i = startPadding - 1; i >= 0; i--) {
    const prevDate = new Date(firstDay)
    prevDate.setDate(firstDay.getDate() - i - 1)
    days.push({
      date: prevDate,
      dayNumber: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: prevDate.getTime() === today.getTime(),
      isWeekend: prevDate.getDay() === 0 || prevDate.getDay() === 6
    })
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i)
    days.push({
      date: currentDate,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: currentDate.getTime() === today.getTime(),
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6
    })
  }

  // Add days from next month
  for (let i = 1; i <= endPadding; i++) {
    const nextDate = new Date(lastDay)
    nextDate.setDate(lastDay.getDate() + i)
    days.push({
      date: nextDate,
      dayNumber: nextDate.getDate(),
      isCurrentMonth: false,
      isToday: nextDate.getTime() === today.getTime(),
      isWeekend: nextDate.getDay() === 0 || nextDate.getDay() === 6
    })
  }

  return days
}

/**
 * Get all days to display in a week view
 */
export function getWeekDays(date: Date): CalendarDay[] {
  const days: CalendarDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find the start of the week (Sunday)
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  // Generate 7 days
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek)
    currentDate.setDate(startOfWeek.getDate() + i)
    days.push({
      date: currentDate,
      dayNumber: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === date.getMonth(),
      isToday: currentDate.getTime() === today.getTime(),
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6
    })
  }

  return days
}

/**
 * Format month and year for display
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/**
 * Format week range for display
 */
export function formatWeekRange(date: Date): string {
  const weekDays = getWeekDays(date)
  const firstDay = weekDays[0].date
  const lastDay = weekDays[6].date

  const firstMonth = firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const lastMonth = lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return `${firstMonth} - ${lastMonth}`
}

/**
 * Navigate to previous period (month or week)
 */
export function navigatePrevious(date: Date, view: CalendarView): Date {
  const newDate = new Date(date)
  if (view === 'month') {
    newDate.setMonth(newDate.getMonth() - 1)
  } else {
    newDate.setDate(newDate.getDate() - 7)
  }
  return newDate
}

/**
 * Navigate to next period (month or week)
 */
export function navigateNext(date: Date, view: CalendarView): Date {
  const newDate = new Date(date)
  if (view === 'month') {
    newDate.setMonth(newDate.getMonth() + 1)
  } else {
    newDate.setDate(newDate.getDate() + 7)
  }
  return newDate
}

/**
 * Navigate to today
 */
export function navigateToday(): Date {
  return new Date()
}

/**
 * Check if a trip is active on a specific date
 */
export function isTripActiveOnDate(trip: TripEvent, date: Date): boolean {
  if (!trip.tripStartDate || !trip.tripEndDate) return false

  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)

  const startDate = new Date(trip.tripStartDate)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(trip.tripEndDate)
  endDate.setHours(0, 0, 0, 0)

  return dateOnly >= startDate && dateOnly <= endDate
}

/**
 * Get trips for a specific date
 */
export function getTripsForDate(trips: TripEvent[], date: Date): TripEvent[] {
  return trips.filter(trip => isTripActiveOnDate(trip, date))
}

/**
 * Detect conflicts - trips with overlapping dates
 */
export function detectConflicts(trips: TripEvent[]): Map<number, number[]> {
  const conflicts = new Map<number, number[]>()

  for (let i = 0; i < trips.length; i++) {
    const trip1 = trips[i]
    if (!trip1.tripStartDate || !trip1.tripEndDate) continue

    const start1 = new Date(trip1.tripStartDate)
    const end1 = new Date(trip1.tripEndDate)

    for (let j = i + 1; j < trips.length; j++) {
      const trip2 = trips[j]
      if (!trip2.tripStartDate || !trip2.tripEndDate) continue

      const start2 = new Date(trip2.tripStartDate)
      const end2 = new Date(trip2.tripEndDate)

      // Check if dates overlap
      if (start1 <= end2 && end1 >= start2) {
        // Add conflict
        if (!conflicts.has(trip1.id)) {
          conflicts.set(trip1.id, [])
        }
        if (!conflicts.has(trip2.id)) {
          conflicts.set(trip2.id, [])
        }
        conflicts.get(trip1.id)!.push(trip2.id)
        conflicts.get(trip2.id)!.push(trip1.id)
      }
    }
  }

  return conflicts
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800'
    case 'APPROVED':
      return 'bg-green-100 border-green-300 text-green-800'
    case 'REJECTED':
      return 'bg-red-100 border-red-300 text-red-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 border-blue-300 text-blue-800'
    case 'COMPLETED':
      return 'bg-gray-100 border-gray-300 text-gray-800'
    case 'CANCELLED':
      return 'bg-red-100 border-red-300 text-red-800'
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800'
  }
}

/**
 * Get short day names
 */
export function getShortDayNames(): string[] {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

/**
 * Calculate trip duration in days
 */
export function getTripDuration(trip: TripEvent): number {
  if (!trip.tripStartDate || !trip.tripEndDate) return 0

  const start = new Date(trip.tripStartDate)
  const end = new Date(trip.tripEndDate)

  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end days

  return diffDays
}

/**
 * Check if trip starts on this date
 */
export function isTripStartDate(trip: TripEvent, date: Date): boolean {
  if (!trip.tripStartDate) return false

  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)

  const startDate = new Date(trip.tripStartDate)
  startDate.setHours(0, 0, 0, 0)

  return dateOnly.getTime() === startDate.getTime()
}

/**
 * Check if trip ends on this date
 */
export function isTripEndDate(trip: TripEvent, date: Date): boolean {
  if (!trip.tripEndDate) return false

  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)

  const endDate = new Date(trip.tripEndDate)
  endDate.setHours(0, 0, 0, 0)

  return dateOnly.getTime() === endDate.getTime()
}
