'use client'

import { useState } from 'react'
import { useTravelRequest } from '@/hooks/travel/useTravelRequest'
import { StatusBadge } from '@/components/travel/StatusBadge'
import { SendDetailsDialog } from '@/components/travel/SendDetailsDialog'
import { AddPassengerDialog } from '@/components/travel/AddPassengerDialog'
import { AddFlightDialog } from '@/components/travel/AddFlightDialog'
import { AddHotelDialog } from '@/components/travel/AddHotelDialog'
import { HotelDetailsDialog } from '@/components/travel/HotelDetailsDialog'
import { EditHotelDialog } from '@/components/travel/EditHotelDialog'
import { AddEventDialog } from '@/components/travel/AddEventDialog'
import { AddPrivateJetDialog } from '@/components/travel/AddPrivateJetDialog'
import { AddTrainDialog } from '@/components/travel/AddTrainDialog'
import { AddRentalCarDialog } from '@/components/travel/AddRentalCarDialog'
import { AddCarWithDriverDialog } from '@/components/travel/AddCarWithDriverDialog'
import { AddEmbassyServiceDialog } from '@/components/travel/AddEmbassyServiceDialog'
import { CommunicationsTab } from '@/components/travel/CommunicationsTab'
import { GenerateItineraryDialog } from '@/components/travel/GenerateItineraryDialog'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import {
  ArrowLeft,
  Plane,
  Users,
  Hotel,
  Calendar,
  Send,
  MessageSquare,
  Plus,
  Train,
  Car,
  Building2,
  FileText,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'

type TabKey = 'passengers' | 'flights' | 'privateJets' | 'trains' | 'rentalCars' | 'carsWithDriver' | 'embassyServices' | 'hotels' | 'events' | 'communications'

export default function TravelRequestDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { data: request, loading, error, refetch } = useTravelRequest(params.id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('passengers')
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showGenerateItineraryDialog, setShowGenerateItineraryDialog] = useState(false)
  const [showAddPassengerDialog, setShowAddPassengerDialog] = useState(false)
  const [showAddFlightDialog, setShowAddFlightDialog] = useState(false)
  const [showAddPrivateJetDialog, setShowAddPrivateJetDialog] = useState(false)
  const [showAddTrainDialog, setShowAddTrainDialog] = useState(false)
  const [showAddRentalCarDialog, setShowAddRentalCarDialog] = useState(false)
  const [showAddCarWithDriverDialog, setShowAddCarWithDriverDialog] = useState(false)
  const [showAddEmbassyServiceDialog, setShowAddEmbassyServiceDialog] = useState(false)
  const [showAddHotelDialog, setShowAddHotelDialog] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null)
  const [showHotelDetailsDialog, setShowHotelDetailsDialog] = useState(false)
  const [showEditHotelDialog, setShowEditHotelDialog] = useState(false)
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)
  const [deletingItem, setDeletingItem] = useState<{type: string, id: number} | null>(null)

  // Delete handlers
  const handleDeletePassenger = async (passengerId: number, passengerName: string) => {
    if (!confirm(`Are you sure you want to remove ${passengerName} from this travel request?`)) {
      return
    }

    try {
      setDeletingItem({ type: 'passenger', id: passengerId })
      const response = await fetch(`/api/travel/passengers/${passengerId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete passenger')
      }

      await refetch()
    } catch (error) {
      console.error('Error deleting passenger:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete passenger')
    } finally {
      setDeletingItem(null)
    }
  }

  const handleDeleteFlight = async (flightId: number, flightNumber: string) => {
    if (!confirm(`Are you sure you want to delete flight ${flightNumber}?`)) {
      return
    }

    try {
      setDeletingItem({ type: 'flight', id: flightId })
      const response = await fetch(`/api/travel/flights/${flightId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete flight')
      }

      await refetch()
    } catch (error) {
      console.error('Error deleting flight:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete flight')
    } finally {
      setDeletingItem(null)
    }
  }

  const handleDeleteHotel = async (hotelId: number, hotelName: string) => {
    if (!confirm(`Are you sure you want to delete hotel ${hotelName}?`)) {
      return
    }

    try {
      setDeletingItem({ type: 'hotel', id: hotelId })
      const response = await fetch(`/api/travel/hotels/${hotelId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete hotel')
      }

      await refetch()
    } catch (error) {
      console.error('Error deleting hotel:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete hotel')
    } finally {
      setDeletingItem(null)
    }
  }

  const handleDeleteEvent = async (eventId: number, eventName: string) => {
    if (!confirm(`Are you sure you want to delete event ${eventName}?`)) {
      return
    }

    try {
      setDeletingItem({ type: 'event', id: eventId })
      const response = await fetch(`/api/travel/events/${eventId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete event')
      }

      await refetch()
    } catch (error) {
      console.error('Error deleting event:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete event')
    } finally {
      setDeletingItem(null)
    }
  }

  const handleDeleteComponent = async (type: string, id: number, name: string, endpoint: string) => {
    if (!confirm(`Are you sure you want to delete ${type} ${name}?`)) {
      return
    }

    try {
      setDeletingItem({ type, id })
      const response = await fetch(endpoint, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || `Failed to delete ${type}`)
      }

      await refetch()
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      alert(error instanceof Error ? error.message : `Failed to delete ${type}`)
    } finally {
      setDeletingItem(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-bounce" />
          <p className="text-gray-600">Loading travel request...</p>
        </div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Request</h2>
          <p className="text-red-600">{error || 'Request not found'}</p>
          <Link
            href="/travel"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Travel Requests
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'passengers', label: 'Passengers', icon: Users, count: request.passengers?.length || 0 },
    { key: 'flights', label: 'Flights', icon: Plane, count: request.flights?.length || 0 },
    { key: 'privateJets', label: 'Private Jets', icon: Plane, count: request.privateJets?.length || 0 },
    { key: 'trains', label: 'Trains', icon: Train, count: request.trains?.length || 0 },
    { key: 'rentalCars', label: 'Rental Cars', icon: Car, count: request.rentalCarsSelfDrive?.length || 0 },
    { key: 'carsWithDriver', label: 'Cars with Driver', icon: Car, count: request.carsWithDriver?.length || 0 },
    { key: 'embassyServices', label: 'Embassy Services', icon: Building2, count: request.embassyServices?.length || 0 },
    { key: 'hotels', label: 'Hotels', icon: Hotel, count: request.hotels?.length || 0 },
    { key: 'events', label: 'Events', icon: Calendar, count: request.events?.length || 0 },
    { key: 'communications', label: 'Communications', icon: MessageSquare, count: request.communications?.length || 0 },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/travel"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Travel Requests
          </Link>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {request.requestNumber}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {request.tripStartDate
                      ? new Date(request.tripStartDate).toLocaleDateString()
                      : 'TBD'}{' '}
                    -{' '}
                    {request.tripEndDate
                      ? new Date(request.tripEndDate).toLocaleDateString()
                      : 'TBD'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={request.status} />
                <button
                  onClick={() => setShowGenerateItineraryDialog(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Generate Itinerary
                </button>
                {request.passengers && request.passengers.length > 0 && (
                  <button
                    onClick={() => setShowSendDialog(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Send Details
                  </button>
                )}
              </div>
            </div>

            {/* Destinations */}
            {request.destinations && request.destinations.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Destinations:</p>
                <div className="flex flex-wrap gap-2">
                  {request.destinations.map((dest, index) => (
                    <span
                      key={dest.id}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="font-medium">{index + 1}.</span>
                      {dest.city}, {dest.country}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {request.notes && (
              <div className="pt-4 border-t mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Notes:</p>
                <p className="text-sm text-gray-600">{request.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          activeTab === tab.key
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'passengers' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Passengers</h3>
                  <button
                    onClick={() => setShowAddPassengerDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Passenger
                  </button>
                </div>
                {request.passengers && request.passengers.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden bg-white">
                    {/* CRM Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max">
                        <thead>
                          <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">N</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Nationality</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Date Of Birth</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Passport Number</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Passport Expiration</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Visa Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Valid Until</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Entrys</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Validation</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-r border-blue-500">Passport</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {request.passengers.map((passenger, index) => {
                            // Passport validation not available without direct relation
                            const validationStatus = 'N/A'
                            const validationColor = 'bg-gray-100 text-gray-800'

                            return (
                              <tr
                                key={passenger.id}
                                className="hover:bg-blue-50 transition-colors"
                              >
                                {/* N - Row Number */}
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium border-r border-gray-200">
                                  {index + 1}
                                </td>

                                {/* Name */}
                                <td className="px-4 py-3 border-r border-gray-200">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                      {passenger.personDetails?.fullName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                      <div className="text-sm font-semibold text-gray-900">
                                        {passenger.personDetails?.fullName || 'Unknown'}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {passenger.isMainPassenger && (
                                          <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">
                                            Main
                                          </span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                          {passenger.personType}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Nationality */}
                                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                  {passenger.personDetails?.nationality || '-'}
                                </td>

                                {/* Date of Birth */}
                                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                  {passenger.personDetails?.dateOfBirth
                                    ? new Date(passenger.personDetails.dateOfBirth).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })
                                    : '-'}
                                </td>

                                {/* Passport Number */}
                                <td className="px-4 py-3 text-sm font-mono text-gray-900 border-r border-gray-200">
                                  {passenger.passportId ? `ID: ${passenger.passportId}` : '-'}
                                </td>

                                {/* Passport Expiration */}
                                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                  -
                                </td>

                                {/* Visa Status */}
                                <td className="px-4 py-3 border-r border-gray-200">
                                  {passenger.visaStatus ? (
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                      passenger.visaStatus === 'HAS_VISA' ? 'bg-green-100 text-green-800' :
                                      passenger.visaStatus === 'UNDER_PROCESS' ? 'bg-yellow-100 text-yellow-800' :
                                      passenger.visaStatus === 'NEEDS_VISA' ? 'bg-orange-100 text-orange-800' :
                                      passenger.visaStatus === 'NOT_REQUIRED' ? 'bg-gray-100 text-gray-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {passenger.visaStatus.replace(/_/g, ' ')}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-500">-</span>
                                  )}
                                </td>

                                {/* Valid Until (Visa Expiry) */}
                                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                  {passenger.visaValidityEnd
                                    ? new Date(passenger.visaValidityEnd).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })
                                    : '-'}
                                </td>

                                {/* Category (Visa Type) */}
                                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                  -
                                </td>

                                {/* Entrys (Number of Entries Allowed) */}
                                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                  -
                                </td>

                                {/* Validation (Passport Validity Status) */}
                                <td className="px-4 py-3 border-r border-gray-200">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${validationColor}`}>
                                    {validationStatus}
                                  </span>
                                </td>

                                {/* Passport (Status Indicator) */}
                                <td className="px-4 py-3 border-r border-gray-200">
                                  {passenger.passportId ? (
                                    <span className="inline-flex items-center text-green-600">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-red-600">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => handleDeletePassenger(passenger.id, passenger.personDetails?.fullName || 'Unknown')}
                                    disabled={deletingItem?.type === 'passenger' && deletingItem?.id === passenger.id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Remove passenger"
                                  >
                                    {deletingItem?.type === 'passenger' && deletingItem?.id === passenger.id ? (
                                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No passengers added yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'flights' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Flights</h3>
                  <button
                    onClick={() => setShowAddFlightDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Flight
                  </button>
                </div>
                {request.flights && request.flights.length > 0 ? (
                  <div className="space-y-3">
                    {request.flights.map((flight) => (
                      <div
                        key={flight.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 relative"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">
                              {flight.airline} {flight.flightNumber}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {flight.departureAirport} → {flight.arrivalAirport}
                            </p>
                            {flight.departureDate && (
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(flight.departureDate).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {flight.status}
                            </span>
                            <button
                              onClick={() => handleDeleteFlight(flight.id, `${flight.airline} ${flight.flightNumber}`)}
                              disabled={deletingItem?.type === 'flight' && deletingItem?.id === flight.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete flight"
                            >
                              {deletingItem?.type === 'flight' && deletingItem?.id === flight.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        {flight.passengers && flight.passengers.length > 0 && (
                          <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
                            {flight.passengers.length} passenger(s)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No flights booked yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'privateJets' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Private Jets</h3>
                  <button
                    onClick={() => setShowAddPrivateJetDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Book Private Jet
                  </button>
                </div>
                {request.privateJets && request.privateJets.length > 0 ? (
                  <div className="space-y-3">
                    {request.privateJets.map((jet) => (
                      <div
                        key={jet.id}
                        className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 bg-gradient-to-r from-purple-50 to-blue-50"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">🛩️</span>
                              <p className="font-medium text-lg">
                                {jet.aircraftType || 'Private Jet'}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {jet.departureAirport} → {jet.arrivalAirport}
                            </p>
                            {jet.operator && (
                              <p className="text-xs text-gray-500 mt-1">
                                Operator: {jet.operator}
                              </p>
                            )}
                            {jet.departureDate && (
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(jet.departureDate).toLocaleString()}
                              </p>
                            )}
                            {jet.amenities && (
                              <p className="text-xs text-purple-600 mt-2">
                                ✨ {jet.amenities}
                              </p>
                            )}
                          </div>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                            {jet.status}
                          </span>
                        </div>
                        {jet.passengers && jet.passengers.length > 0 && (
                          <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
                            {jet.passengers.length} passenger(s)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No private jets booked yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'trains' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Train Journeys</h3>
                  <button
                    onClick={() => setShowAddTrainDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Book Train
                  </button>
                </div>
                {request.trains && request.trains.length > 0 ? (
                  <div className="space-y-3">
                    {request.trains.map((train) => (
                      <div
                        key={train.id}
                        className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 bg-gradient-to-r from-green-50 to-teal-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">
                                🚂 {train.trainNumber || train.route}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  train.status === 'CONFIRMED'
                                    ? 'bg-green-100 text-green-700'
                                    : train.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {train.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {train.departureStation}
                                </p>
                                <p className="text-xs">
                                  {train.departureDate && new Date(train.departureDate).toLocaleDateString()}
                                  {train.departureTime && ` at ${train.departureTime}`}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {train.arrivalStation}
                                </p>
                                <p className="text-xs">
                                  {train.arrivalDate && new Date(train.arrivalDate).toLocaleDateString()}
                                  {train.arrivalTime && ` at ${train.arrivalTime}`}
                                </p>
                              </div>
                            </div>
                            {train.class && (
                              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                                {train.class && <span className="mr-3">Class: {train.class}</span>}
                              </div>
                            )}
                            {train.route && (
                              <p className="text-xs text-gray-500 mt-2">
                                Route: {train.route}
                              </p>
                            )}
                            {train.passengers && train.passengers.length > 0 && (
                              <p className="text-xs text-gray-500 mt-2">
                                {train.passengers.length} passenger(s)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No trains booked yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'rentalCars' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Self-Drive Rental Cars</h3>
                  <button
                    onClick={() => setShowAddRentalCarDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Book Rental Car
                  </button>
                </div>
                {request.rentalCarsSelfDrive && request.rentalCarsSelfDrive.length > 0 ? (
                  <div className="space-y-3">
                    {request.rentalCarsSelfDrive.map((car) => (
                      <div
                        key={car.id}
                        className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 bg-gradient-to-r from-orange-50 to-red-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">
                                🚗 {car.carModel || car.carType || 'Rental Car'}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  car.status === 'CONFIRMED'
                                    ? 'bg-green-100 text-green-700'
                                    : car.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {car.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {car.rentalCompany}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                              <div>
                                <p className="font-medium text-gray-900">Pickup</p>
                                <p>{car.pickupLocation}</p>
                                <p className="text-xs">
                                  {car.pickupDate && new Date(car.pickupDate).toLocaleDateString()}
                                  {car.pickupTime && ` at ${car.pickupTime}`}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Dropoff</p>
                                <p>{car.returnLocation || 'Same as pickup'}</p>
                                <p className="text-xs">
                                  {car.returnDate && new Date(car.returnDate).toLocaleDateString()}
                                  {car.returnTime && ` at ${car.returnTime}`}
                                </p>
                              </div>
                            </div>
                            {car.insuranceType && (
                              <p className="text-xs text-gray-500 mt-2">
                                Insurance: {car.insuranceType}
                              </p>
                            )}
                            <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                              <span className="font-medium">Driver:</span> Employee ID {car.driverPersonId}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No rental cars booked yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'carsWithDriver' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Cars with Driver</h3>
                  <button
                    onClick={() => setShowAddCarWithDriverDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Book Car Service
                  </button>
                </div>
                {request.carsWithDriver && request.carsWithDriver.length > 0 ? (
                  <div className="space-y-3">
                    {request.carsWithDriver.map((car) => (
                      <div
                        key={car.id}
                        className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 bg-gradient-to-r from-indigo-50 to-violet-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">
                                🚙 {car.carType || 'Chauffeur Service'}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  car.status === 'CONFIRMED'
                                    ? 'bg-green-100 text-green-700'
                                    : car.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {car.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {car.rentalCompany}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                              <div>
                                <p className="font-medium text-gray-900">Pickup</p>
                                <p>{car.pickupLocation}</p>
                                <p className="text-xs">
                                  {car.pickupDate && new Date(car.pickupDate).toLocaleDateString()}
                                  {car.pickupTime && ` at ${car.pickupTime}`}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Dropoff</p>
                                <p>{car.returnLocation || 'Same as pickup'}</p>
                                <p className="text-xs">
                                  {car.returnDate && new Date(car.returnDate).toLocaleDateString()}
                                  {car.returnTime && ` at ${car.returnTime}`}
                                </p>
                              </div>
                            </div>
                            {(car.driverName || car.driverPhone) && (
                              <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                                <span className="font-medium">Driver:</span>{' '}
                                {car.driverName && <span>{car.driverName}</span>}
                                {car.driverPhone && <span> • {car.driverPhone}</span>}
                              </div>
                            )}
                            {car.passengers && car.passengers.length > 0 && (
                              <p className="text-xs text-gray-500 mt-2">
                                {car.passengers.length} passenger(s)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No car services booked yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'embassyServices' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Embassy Services</h3>
                  <button
                    onClick={() => setShowAddEmbassyServiceDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg hover:from-amber-700 hover:to-yellow-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Book Embassy Service
                  </button>
                </div>
                {request.embassyServices && request.embassyServices.length > 0 ? (
                  <div className="space-y-3">
                    {request.embassyServices.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 border-2 border-amber-200 rounded-lg hover:bg-amber-50 bg-gradient-to-r from-amber-50 to-yellow-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">
                                🏛️ Embassy Service
                              </h4>
                              <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
                                {service.status}
                              </span>
                            </div>

                            {service.arrivalFlightId && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                                <p className="text-sm font-medium text-green-900 mb-1">✈️ Arrival</p>
                                <div className="text-xs text-gray-600">
                                  {service.arrivalTime && (
                                    <p>
                                      Time: {service.arrivalTime}
                                    </p>
                                  )}
                                  {service.arrivalFlight && (
                                    <p className="mt-1">
                                      Flight: {service.arrivalFlight.flightNumber}
                                    </p>
                                  )}
                                  {service.arrivalContactPerson && (
                                    <p className="mt-1">
                                      Contact: {service.arrivalContactPerson}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {service.departureFlightId && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-sm font-medium text-red-900 mb-1">🛫 Departure</p>
                                <div className="text-xs text-gray-600">
                                  {service.departureTime && (
                                    <p>
                                      Time: {service.departureTime}
                                    </p>
                                  )}
                                  {service.departureFlight && (
                                    <p className="mt-1">
                                      Flight: {service.departureFlight.flightNumber}
                                    </p>
                                  )}
                                  {service.departureContactPerson && (
                                    <p className="mt-1">
                                      Contact: {service.departureContactPerson}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {service.passengers && service.passengers.length > 0 && (
                              <p className="text-xs text-gray-500 mt-3">
                                {service.passengers.length} passenger(s)
                              </p>
                            )}

                            {service.notes && (
                              <p className="text-xs text-gray-500 mt-2 italic">
                                {service.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No embassy services booked yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'hotels' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Hotels</h3>
                  <button
                    onClick={() => setShowAddHotelDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Hotel
                  </button>
                </div>
                {request.hotels && request.hotels.length > 0 ? (
                  <div className="space-y-3">
                    {request.hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                        onClick={() => {
                          setSelectedHotel(hotel)
                          setShowHotelDetailsDialog(true)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-blue-600 hover:text-blue-700">
                              {hotel.hotelName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {hotel.city}, {hotel.country}
                            </p>
                            {hotel.checkInDate && hotel.checkOutDate && (
                              <p className="text-xs text-gray-500 mt-2">
                                Check-in: {new Date(hotel.checkInDate).toLocaleDateString()}{' '}
                                | Check-out:{' '}
                                {new Date(hotel.checkOutDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {hotel.status}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteHotel(hotel.id, hotel.hotelName)
                              }}
                              disabled={deletingItem?.type === 'hotel' && deletingItem?.id === hotel.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete hotel"
                            >
                              {deletingItem?.type === 'hotel' && deletingItem?.id === hotel.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        {hotel.rooms && hotel.rooms.length > 0 && (
                          <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
                            {hotel.rooms.length} room(s)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No hotels booked yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Events & Activities</h3>
                  <button
                    onClick={() => setShowAddEventDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Event
                  </button>
                </div>
                {request.events && request.events.length > 0 ? (
                  <div className="space-y-3">
                    {request.events.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{event.eventName}</p>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                {event.eventType}
                              </span>
                            </div>
                            {event.location && (
                              <p className="text-sm text-gray-600 mt-1">
                                {event.location}
                              </p>
                            )}
                            {event.eventDate && (
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(event.eventDate).toLocaleDateString()}
                                {event.startTime && ` at ${event.startTime}`}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {event.status}
                            </span>
                            <button
                              onClick={() => handleDeleteEvent(event.id, event.eventName)}
                              disabled={deletingItem?.type === 'event' && deletingItem?.id === event.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete event"
                            >
                              {deletingItem?.type === 'event' && deletingItem?.id === event.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        {event.participants && event.participants.length > 0 && (
                          <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
                            {event.participants.length} participant(s)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No events or activities planned yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'communications' && (
              <CommunicationsTab travelRequestId={request.id} />
            )}
          </div>
        </div>
      </div>

      {/* Send Details Dialog */}
      {showSendDialog && request.passengers && (
        <SendDetailsDialog
          travelRequestId={request.id}
          passengers={request.passengers}
          onClose={() => setShowSendDialog(false)}
          onSuccess={() => {
            refetch()
            setShowSendDialog(false)
          }}
        />
      )}

      {/* Generate Itinerary Dialog */}
      {showGenerateItineraryDialog && (
        <GenerateItineraryDialog
          travelRequest={request}
          onClose={() => setShowGenerateItineraryDialog(false)}
        />
      )}

      {/* Add Passenger Dialog */}
      {showAddPassengerDialog && (
        <AddPassengerDialog
          travelRequestId={request.id}
          onClose={() => setShowAddPassengerDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddPassengerDialog(false)
          }}
        />
      )}

      {/* Add Flight Dialog */}
      {showAddFlightDialog && (
        <AddFlightDialog
          travelRequestId={request.id}
          onClose={() => setShowAddFlightDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddFlightDialog(false)
          }}
        />
      )}

      {/* Add Hotel Dialog */}
      {showAddHotelDialog && (
        <AddHotelDialog
          travelRequestId={request.id}
          onClose={() => setShowAddHotelDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddHotelDialog(false)
          }}
        />
      )}

      {/* Hotel Details Dialog */}
      {showHotelDetailsDialog && selectedHotel && (
        <HotelDetailsDialog
          hotel={selectedHotel}
          onClose={() => {
            setShowHotelDetailsDialog(false)
            setSelectedHotel(null)
          }}
          onEdit={() => {
            setShowHotelDetailsDialog(false)
            setShowEditHotelDialog(true)
          }}
          onDelete={() => {
            setShowHotelDetailsDialog(false)
            handleDeleteHotel(selectedHotel.id, selectedHotel.hotelName)
            setSelectedHotel(null)
          }}
        />
      )}

      {/* Edit Hotel Dialog */}
      {showEditHotelDialog && selectedHotel && (
        <EditHotelDialog
          hotel={selectedHotel}
          onClose={() => {
            setShowEditHotelDialog(false)
            setSelectedHotel(null)
          }}
          onSuccess={() => {
            refetch()
            setShowEditHotelDialog(false)
            setSelectedHotel(null)
          }}
        />
      )}

      {/* Add Event Dialog */}
      {showAddEventDialog && (
        <AddEventDialog
          travelRequestId={request.id}
          onClose={() => setShowAddEventDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddEventDialog(false)
          }}
        />
      )}

      {/* Add Private Jet Dialog */}
      {showAddPrivateJetDialog && (
        <AddPrivateJetDialog
          travelRequestId={request.id}
          onClose={() => setShowAddPrivateJetDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddPrivateJetDialog(false)
          }}
        />
      )}

      {/* Add Train Dialog */}
      {showAddTrainDialog && (
        <AddTrainDialog
          travelRequestId={request.id}
          onClose={() => setShowAddTrainDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddTrainDialog(false)
          }}
        />
      )}

      {/* Add Rental Car Dialog */}
      {showAddRentalCarDialog && (
        <AddRentalCarDialog
          travelRequestId={request.id}
          onClose={() => setShowAddRentalCarDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddRentalCarDialog(false)
          }}
        />
      )}

      {/* Add Car with Driver Dialog */}
      {showAddCarWithDriverDialog && (
        <AddCarWithDriverDialog
          travelRequestId={request.id}
          onClose={() => setShowAddCarWithDriverDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddCarWithDriverDialog(false)
          }}
        />
      )}

      {/* Add Embassy Service Dialog */}
      {showAddEmbassyServiceDialog && (
        <AddEmbassyServiceDialog
          travelRequestId={request.id}
          onClose={() => setShowAddEmbassyServiceDialog(false)}
          onSuccess={() => {
            refetch()
            setShowAddEmbassyServiceDialog(false)
          }}
        />
      )}
        </div>
      </div>
    </div>
  )
}
