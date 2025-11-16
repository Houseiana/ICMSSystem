'use client'

import { useState } from 'react'
import { useTravelRequests } from '@/hooks/travel/useTravelRequests'
import { StatusBadge } from '@/components/travel/StatusBadge'
import { TravelCalendar } from '@/components/travel/TravelCalendar'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Plane, Plus, Calendar, MapPin, Users, LayoutGrid, CalendarDays, Trash2 } from 'lucide-react'
import Link from 'next/link'

type ViewMode = 'list' | 'calendar'

export default function TravelRequestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const { data, loading, error, refetch } = useTravelRequests({ status: statusFilter })
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleDeleteRequest = async (e: React.MouseEvent, requestId: number, requestNumber: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Are you sure you want to delete travel request ${requestNumber}? This will delete all associated passengers, flights, hotels, and events. This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(requestId)
      const response = await fetch(`/api/travel/requests/${requestId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete travel request')
      }

      // Refresh the list
      await refetch()
    } catch (error) {
      console.error('Error deleting travel request:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete travel request')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-bounce" />
          <p className="text-gray-600">Loading travel requests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Requests</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Plane className="w-10 h-10 text-blue-600" />
              Travel Requests
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all travel requests, bookings, and itineraries
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                  ${viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <LayoutGrid className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                  ${viewMode === 'calendar'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <CalendarDays className="w-4 h-4" />
                Calendar
              </button>
            </div>

            <Link
              href="/travel/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              New Travel Request
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{data.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-blue-600">
              {data.filter(r => ['PLANNING', 'CONFIRMING', 'EXECUTING'].includes(r.status)).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {data.filter(r => r.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-purple-600">
              {data.filter(r => r.status === 'REQUEST').length}
            </p>
          </div>
        </div>

        {/* Conditional Content Based on View Mode */}
        {viewMode === 'calendar' ? (
          /* Calendar View */
          <TravelCalendar initialTrips={data.map(trip => ({
            ...trip,
            tripStartDate: trip.tripStartDate ? new Date(trip.tripStartDate).toISOString() : '',
            tripEndDate: trip.tripEndDate ? new Date(trip.tripEndDate).toISOString() : ''
          }))} />
        ) : (
          /* List View */
          <>
            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="REQUEST">📝 Request</option>
                  <option value="PLANNING">📋 Planning</option>
                  <option value="CONFIRMING">✓ Confirming</option>
                  <option value="EXECUTING">✈️ Executing</option>
                  <option value="COMPLETED">✅ Completed</option>
                  <option value="CANCELLED">❌ Cancelled</option>
                </select>
              </label>
            </div>

            {/* Requests Grid */}
            {data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-200 overflow-hidden group relative"
                  >
                    <Link href={`/travel/${request.id}`}>
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {request.requestNumber}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {request.tripStartDate
                                  ? new Date(request.tripStartDate).toLocaleDateString()
                                  : 'TBD'}
                                {' - '}
                                {request.tripEndDate
                                  ? new Date(request.tripEndDate).toLocaleDateString()
                                  : 'TBD'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={request.status} />
                          </div>
                        </div>

                      {/* Destinations */}
                      {request.destinations && request.destinations.length > 0 && (
                        <div className="mb-4 pb-4 border-b">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Destinations</p>
                              <p className="text-sm text-gray-700">
                                {request.destinations
                                  .map((d) => `${d.city}, ${d.country}`)
                                  .join(' • ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Passengers */}
                      {request.passengers && request.passengers.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{request.passengers.length} Passenger(s)</span>
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          ✈️ {request.flights?.length || 0} Flights
                        </span>
                        <span className="flex items-center gap-1">
                          🏨 {request.hotels?.length || 0} Hotels
                        </span>
                        <span className="flex items-center gap-1">
                          🎭 {request.events?.length || 0} Events
                        </span>
                      </div>

                        {/* Notes Preview */}
                        {request.notes && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-500 line-clamp-2">{request.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Hover Effect Bottom Bar */}
                      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteRequest(e, request.id, request.requestNumber)}
                      disabled={deleting === request.id}
                      className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                      title="Delete travel request"
                    >
                      {deleting === request.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <Plane className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Travel Requests Found
                </h3>
                <p className="text-gray-500 mb-6">
                  {statusFilter
                    ? `No requests with status "${statusFilter}"`
                    : 'Get started by creating your first travel request'}
                </p>
                <Link
                  href="/travel/new"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Travel Request
                </Link>
              </div>
            )}
          </>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}
