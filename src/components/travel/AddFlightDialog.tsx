'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Plane, Users } from 'lucide-react'

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

interface AddFlightDialogProps {
  travelRequestId: number
  onClose: () => void
  onSuccess: () => void
}

export function AddFlightDialog({
  travelRequestId,
  onClose,
  onSuccess,
}: AddFlightDialogProps) {
  const [loading, setLoading] = useState(false)
  const [loadingPassengers, setLoadingPassengers] = useState(true)
  const [passengers, setPassengers] = useState<PassengerData[]>([])
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([])
  const [passengerDetails, setPassengerDetails] = useState<Record<number, PassengerDetails>>({})

  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    departureAirport: '',
    arrivalAirport: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    terminal: '',
    gate: '',
    notes: '',
    specialRequests: '',
  })

  // Fetch passengers from the travel request
  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await fetch(`/api/travel/passengers?travelRequestId=${travelRequestId}`)
        const result = await response.json()

        if (result.success && result.data) {
          setPassengers(result.data)
          // Auto-select all passengers by default
          setSelectedPassengers(result.data.map((p: PassengerData) => p.id))

          // Initialize passenger details
          const initialDetails: Record<number, PassengerDetails> = {}
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
          setPassengerDetails(initialDetails)
        }
      } catch (error) {
        console.error('Error fetching passengers:', error)
      } finally {
        setLoadingPassengers(false)
      }
    }

    fetchPassengers()
  }, [travelRequestId])

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
      const response = await fetch('/api/travel/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelRequestId,
          ...formData,
          departureDate: formData.departureDate ? new Date(formData.departureDate) : null,
          arrivalDate: formData.arrivalDate ? new Date(formData.arrivalDate) : null,
          status: 'PENDING',
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
        alert(`Failed to add flight: ${result.error}`)
      }
    } catch (error) {
      alert('Error adding flight. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Plane className="w-6 h-6 text-blue-600" />
              Add Flight
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add flight details to this travel request
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
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
                <p className="text-gray-500">No passengers added to this travel request yet</p>
                <p className="text-sm text-gray-400 mt-1">Add passengers to the travel request first</p>
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
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Flight</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
