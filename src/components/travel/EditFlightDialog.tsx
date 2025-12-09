'use client'

import { useState, useEffect } from 'react'
import { X, Save, Plane, Eye, Users } from 'lucide-react'

interface PassengerData {
  id: number
  personType: string
  personId: number
  personName?: string
  personDetails?: {
    fullName?: string
    firstName?: string
    lastName?: string
    companyName?: string
  }
}

interface FlightPassenger {
  id?: number
  personType: string
  personId: number
  seatNumber?: string
  mealPreference?: string
  specialAssistance?: string
  ticketClass?: string
  ticketPrice?: number
  baggageAllowance?: string
  bookingReference?: string
}

interface PassengerDetails {
  passengerId: number
  seatNumber: string
  mealPreference: string
  specialAssistance: string
  ticketClass: string
  ticketPrice: string
  baggageAllowance: string
  bookingReference: string
}

interface FlightData {
  id: number
  travelRequestId?: number
  flightNumber?: string
  airline?: string
  departureAirport?: string
  arrivalAirport?: string
  departureDate?: string
  departureTime?: string
  arrivalDate?: string
  arrivalTime?: string
  terminal?: string
  gate?: string
  status?: string
  notes?: string
  specialRequests?: string
  passengers?: FlightPassenger[]
}

interface EditFlightDialogProps {
  flight: FlightData
  onClose: () => void
  onSuccess: () => void
}

export function EditFlightDialog({
  flight,
  onClose,
  onSuccess,
}: EditFlightDialogProps) {
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [loadingPassengers, setLoadingPassengers] = useState(true)
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([])
  const [passengerDetails, setPassengerDetails] = useState<Record<number, PassengerDetails>>({})

  const formatDateForInput = (date: string | undefined | null): string => {
    if (!date) return ''
    try {
      const d = new Date(date)
      return d.toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  const [formData, setFormData] = useState({
    flightNumber: flight.flightNumber || '',
    airline: flight.airline || '',
    departureAirport: flight.departureAirport || '',
    arrivalAirport: flight.arrivalAirport || '',
    departureDate: formatDateForInput(flight.departureDate),
    departureTime: flight.departureTime || '',
    arrivalDate: formatDateForInput(flight.arrivalDate),
    arrivalTime: flight.arrivalTime || '',
    terminal: flight.terminal || '',
    gate: flight.gate || '',
    notes: flight.notes || '',
    specialRequests: flight.specialRequests || '',
  })

  // Fetch passengers from the travel request
  useEffect(() => {
    const fetchPassengers = async () => {
      if (!flight.travelRequestId) {
        setLoadingPassengers(false)
        return
      }

      try {
        const response = await fetch(`/api/travel/passengers?travelRequestId=${flight.travelRequestId}`)
        const result = await response.json()

        if (result.success && result.data) {
          setPassengers(result.data)

          // Initialize selected passengers and details from existing flight passengers
          const existingPassengerIds: number[] = []
          const initialDetails: Record<number, PassengerDetails> = {}

          // First, create default details for all passengers
          result.data.forEach((p: PassengerData) => {
            initialDetails[p.id] = {
              passengerId: p.id,
              seatNumber: '',
              mealPreference: '',
              specialAssistance: '',
              ticketClass: 'ECONOMY',
              ticketPrice: '',
              baggageAllowance: '',
              bookingReference: ''
            }
          })

          // Then, populate with existing flight passenger data
          if (flight.passengers && flight.passengers.length > 0) {
            flight.passengers.forEach((fp: FlightPassenger) => {
              // Find matching passenger from travel request
              const matchingPassenger = result.data.find(
                (p: PassengerData) => p.personType === fp.personType && p.personId === fp.personId
              )
              if (matchingPassenger) {
                existingPassengerIds.push(matchingPassenger.id)
                initialDetails[matchingPassenger.id] = {
                  passengerId: matchingPassenger.id,
                  seatNumber: fp.seatNumber || '',
                  mealPreference: fp.mealPreference || '',
                  specialAssistance: fp.specialAssistance || '',
                  ticketClass: fp.ticketClass || 'ECONOMY',
                  ticketPrice: fp.ticketPrice?.toString() || '',
                  baggageAllowance: fp.baggageAllowance || '',
                  bookingReference: fp.bookingReference || ''
                }
              }
            })
          }

          setSelectedPassengers(existingPassengerIds)
          setPassengerDetails(initialDetails)
        }
      } catch (error) {
        console.error('Error fetching passengers:', error)
      } finally {
        setLoadingPassengers(false)
      }
    }

    fetchPassengers()
  }, [flight.travelRequestId, flight.passengers])

  const togglePassenger = (passengerId: number) => {
    setSelectedPassengers(prev =>
      prev.includes(passengerId)
        ? prev.filter(id => id !== passengerId)
        : [...prev, passengerId]
    )
  }

  const updatePassengerDetail = (passengerId: number, field: keyof PassengerDetails, value: string) => {
    setPassengerDetails(prev => ({
      ...prev,
      [passengerId]: {
        ...prev[passengerId],
        [field]: value
      }
    }))
  }

  const getPassengerName = (passenger: PassengerData): string => {
    if (passenger.personDetails) {
      return passenger.personDetails.fullName ||
             passenger.personDetails.companyName ||
             `${passenger.personDetails.firstName || ''} ${passenger.personDetails.lastName || ''}`.trim() ||
             `${passenger.personType} #${passenger.personId}`
    }
    return passenger.personName || `${passenger.personType} #${passenger.personId}`
  }

  const handleSubmit = async () => {
    if (!formData.airline || !formData.departureAirport || !formData.arrivalAirport) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/travel/flights/${flight.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          departureDate: formData.departureDate ? new Date(formData.departureDate) : null,
          arrivalDate: formData.arrivalDate ? new Date(formData.arrivalDate) : null,
          passengers: selectedPassengers.map(pid => {
            const passenger = passengers.find(p => p.id === pid)
            const details = passengerDetails[pid]
            return {
              personType: passenger?.personType,
              personId: passenger?.personId,
              seatNumber: details?.seatNumber || null,
              mealPreference: details?.mealPreference || null,
              specialAssistance: details?.specialAssistance || null,
              ticketClass: details?.ticketClass || null,
              ticketPrice: details?.ticketPrice ? parseFloat(details.ticketPrice) : null,
              baggageAllowance: details?.baggageAllowance || null,
              bookingReference: details?.bookingReference || null
            }
          })
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(`Failed to update flight: ${result.error}`)
      }
    } catch (error) {
      alert('Error updating flight. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (date: string | undefined, time: string | undefined) => {
    if (!date) return 'Not set'
    const d = new Date(date)
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    return time ? `${dateStr} at ${time}` : dateStr
  }

  // Review/View Mode
  if (viewMode) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Plane className="w-6 h-6" />
                Flight Details
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                {formData.airline} {formData.flightNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Flight Route */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-gray-900">{formData.departureAirport || 'TBD'}</p>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTime(formData.departureDate, formData.departureTime)}</p>
                </div>
                <div className="flex-shrink-0 px-4">
                  <Plane className="w-8 h-8 text-blue-600 transform rotate-90" />
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-gray-900">{formData.arrivalAirport || 'TBD'}</p>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTime(formData.arrivalDate, formData.arrivalTime)}</p>
                </div>
              </div>
            </div>

            {/* Flight Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Airline</p>
                <p className="font-semibold">{formData.airline || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Flight Number</p>
                <p className="font-semibold">{formData.flightNumber || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Terminal</p>
                <p className="font-semibold">{formData.terminal || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Gate</p>
                <p className="font-semibold">{formData.gate || 'N/A'}</p>
              </div>
            </div>

            {/* Special Requests */}
            {formData.specialRequests && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-xs text-yellow-600 font-medium mb-1">Special Requests</p>
                <p className="text-gray-800">{formData.specialRequests}</p>
              </div>
            )}

            {/* Notes */}
            {formData.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                <p className="text-gray-800">{formData.notes}</p>
              </div>
            )}

            {/* Passengers */}
            {flight.passengers && flight.passengers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Passengers ({flight.passengers.length})
                </h3>
                <div className="space-y-3">
                  {flight.passengers.map((p: FlightPassenger, idx: number) => {
                    const passengerInfo = passengers.find(
                      (pas) => pas.personType === p.personType && pas.personId === p.personId
                    )
                    const passengerName = passengerInfo ? getPassengerName(passengerInfo) : `${p.personType} #${p.personId}`

                    return (
                      <div key={p.id || idx} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {passengerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{passengerName}</p>
                            <p className="text-xs text-gray-500">{p.personType}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Ticket Class:</span>
                            <span className="ml-1 font-medium">{p.ticketClass?.replace('_', ' ') || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ticket Price:</span>
                            <span className="ml-1 font-medium">{p.ticketPrice ? `$${p.ticketPrice}` : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Seat:</span>
                            <span className="ml-1 font-medium">{p.seatNumber || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Booking Ref:</span>
                            <span className="ml-1 font-medium font-mono">{p.bookingReference || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Baggage:</span>
                            <span className="ml-1 font-medium">{p.baggageAllowance || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Meal:</span>
                            <span className="ml-1 font-medium">{p.mealPreference || 'N/A'}</span>
                          </div>
                          {p.specialAssistance && (
                            <div className="col-span-2">
                              <span className="text-gray-500">Special Assistance:</span>
                              <span className="ml-1 font-medium">{p.specialAssistance}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setViewMode(false)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Edit Flight
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Edit Mode
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Plane className="w-6 h-6 text-blue-600" />
              Edit Flight
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update flight details
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Flight Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Airline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.airline}
                onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                placeholder="e.g., Qatar Airways"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Number
              </label>
              <input
                type="text"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                placeholder="e.g., QR123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Departure & Arrival */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Airport <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.departureAirport}
                onChange={(e) => setFormData({ ...formData, departureAirport: e.target.value })}
                placeholder="e.g., DOH - Hamad International"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrival Airport <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.arrivalAirport}
                onChange={(e) => setFormData({ ...formData, arrivalAirport: e.target.value })}
                placeholder="e.g., JFK - New York"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Departure Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terminal
              </label>
              <input
                type="text"
                value={formData.terminal}
                onChange={(e) => setFormData({ ...formData, terminal: e.target.value })}
                placeholder="e.g., T1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Arrival Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrival Date
              </label>
              <input
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gate
              </label>
              <input
                type="text"
                value={formData.gate}
                onChange={(e) => setFormData({ ...formData, gate: e.target.value })}
                placeholder="e.g., A12"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="e.g., Wheelchair assistance, child seat, specific meals, etc."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Passengers Section */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Passengers</h3>
              <span className="text-sm text-gray-500">
                ({selectedPassengers.length} selected)
              </span>
            </div>

            {loadingPassengers ? (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500 mt-2">Loading passengers...</p>
              </div>
            ) : passengers.length > 0 ? (
              <div className="space-y-4">
                {passengers.map((passenger) => {
                  const isSelected = selectedPassengers.includes(passenger.id)
                  const details = passengerDetails[passenger.id]

                  return (
                    <div
                      key={passenger.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePassenger(passenger.id)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {getPassengerName(passenger)}
                          </div>
                          <div className="text-xs text-gray-500 mb-3">{passenger.personType}</div>

                          {isSelected && (
                            <div className="space-y-3 mt-3 pt-3 border-t">
                              {/* Row 1: Ticket Class and Ticket Price */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Ticket Class
                                  </label>
                                  <select
                                    value={details?.ticketClass || 'ECONOMY'}
                                    onChange={(e) => updatePassengerDetail(passenger.id, 'ticketClass', e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="ECONOMY">Economy</option>
                                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                    <option value="BUSINESS">Business</option>
                                    <option value="FIRST">First Class</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Ticket Price
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={details?.ticketPrice || ''}
                                    onChange={(e) => updatePassengerDetail(passenger.id, 'ticketPrice', e.target.value)}
                                    placeholder="e.g., 1500.00"
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              {/* Row 2: Seat Number and Booking Reference */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Seat Number
                                  </label>
                                  <input
                                    type="text"
                                    value={details?.seatNumber || ''}
                                    onChange={(e) => updatePassengerDetail(passenger.id, 'seatNumber', e.target.value)}
                                    placeholder="e.g., 12A"
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Booking Reference
                                  </label>
                                  <input
                                    type="text"
                                    value={details?.bookingReference || ''}
                                    onChange={(e) => updatePassengerDetail(passenger.id, 'bookingReference', e.target.value)}
                                    placeholder="e.g., ABC123"
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              {/* Row 3: Baggage Allowance and Meal Preference */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Baggage Allowance
                                  </label>
                                  <input
                                    type="text"
                                    value={details?.baggageAllowance || ''}
                                    onChange={(e) => updatePassengerDetail(passenger.id, 'baggageAllowance', e.target.value)}
                                    placeholder="e.g., 2 x 23kg"
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Meal Preference
                                  </label>
                                  <input
                                    type="text"
                                    value={details?.mealPreference || ''}
                                    onChange={(e) => updatePassengerDetail(passenger.id, 'mealPreference', e.target.value)}
                                    placeholder="e.g., Vegetarian"
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              {/* Row 4: Special Assistance */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Special Assistance
                                </label>
                                <input
                                  type="text"
                                  value={details?.specialAssistance || ''}
                                  onChange={(e) => updatePassengerDetail(passenger.id, 'specialAssistance', e.target.value)}
                                  placeholder="e.g., Wheelchair, Child seat, etc."
                                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No passengers available for this travel request</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this flight..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.airline || !formData.departureAirport || !formData.arrivalAirport}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
