'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  meetingDates?: Date[]
  taskDates?: Date[]
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  meetingDates = [],
  taskDates = []
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    onDateSelect(today)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  const hasMeeting = (day: number) => {
    return meetingDates.some(meetingDate => {
      const d = new Date(meetingDate)
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth.getMonth() &&
        d.getFullYear() === currentMonth.getFullYear()
      )
    })
  }

  const hasTask = (day: number) => {
    return taskDates.some(taskDate => {
      const d = new Date(taskDate)
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth.getMonth() &&
        d.getFullYear() === currentMonth.getFullYear()
      )
    })
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    onDateSelect(newDate)
  }

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="h-12 bg-gray-50"></div>
    )
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const hasMeetingOnDay = hasMeeting(day)
    const hasTaskOnDay = hasTask(day)

    calendarDays.push(
      <div
        key={day}
        onClick={() => handleDateClick(day)}
        className={`
          h-12 flex flex-col items-center justify-center cursor-pointer relative
          transition-all duration-200 rounded-lg
          ${isSelected(day)
            ? 'bg-blue-600 text-white shadow-lg scale-105'
            : isToday(day)
              ? 'bg-blue-100 text-blue-800 font-bold border-2 border-blue-400'
              : 'hover:bg-gray-100'
          }
        `}
      >
        <span className="text-sm font-medium">{day}</span>

        {/* Indicators for meetings and tasks */}
        <div className="flex gap-1 mt-0.5">
          {hasMeetingOnDay && (
            <div className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? 'bg-yellow-300' : 'bg-green-500'}`}></div>
          )}
          {hasTaskOnDay && (
            <div className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? 'bg-orange-300' : 'bg-orange-500'}`}></div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Today
          </button>
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Meetings</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span>Tasks</span>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>
    </div>
  )
}
