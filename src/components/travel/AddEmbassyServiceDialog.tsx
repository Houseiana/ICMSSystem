'use client'

import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

interface AddEmbassyServiceDialogProps {
  travelRequestId: number
  onClose: () => void
  onSuccess: () => void
}

const SERVICE_TYPES = [
  'ARRIVAL',
  'DEPARTURE',
  'BOTH',
]

const SERVICE_TYPE_LABELS: Record<string, string> = {
  ARRIVAL: 'Arrival Only',
  DEPARTURE: 'Departure Only',
  BOTH: 'Arrival & Departure',
}

const PERSON_TYPES = [
  'EMPLOYEE',
  'STAKEHOLDER',
  'EMPLOYER',
  'TASK_HELPER',
]

interface Flight {
  id: number
  flightNumber: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  departureDate: string
  departureTime: string
}

interface Employee {
  id: number
  empId: string
  firstName: string
  middleName?: string
  lastName: string
}

export function AddEmbassyServiceDialog({
  travelRequestId,
  onClose,
  onSuccess,
}: AddEmbassyServiceDialogProps) {
  const [loading, setLoading] = useState(false)
  const [flights, setFlights] = useState<Flight[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    serviceType: '',
    arrivalContactPersonType: '',
    arrivalContactPersonId: '',
    departureContactPersonType: '',
    departureContactPersonId: '',
    arrivalFlightId: '',
    departureFlightId: '',
    arrivalDate: '',
    arrivalTime: '',
    departureDate: '',
    departureTime: '',
    location: '',
    notes: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch flights for this travel request
        const flightsResponse = await fetch(`/api/travel-requests/${travelRequestId}`)
        const flightsResult = await flightsResponse.json()
        if (flightsResult.success && flightsResult.data.flights) {
          setFlights(flightsResult.data.flights)
        }

        // Fetch employees for contact persons
        const employeesResponse = await fetch('/api/employees')
        const employeesResult = await employeesResponse.json()
        if (employeesResult.success) {
          setEmployees(employeesResult.data || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [travelRequestId])

  const handleSubmit = async () => {
    if (!formData.serviceType || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

    // Validate based on service type
    if (formData.serviceType === 'ARRIVAL' || formData.serviceType === 'BOTH') {
      if (!formData.arrivalContactPersonType || !formData.arrivalContactPersonId) {
        alert('Please select an arrival contact person')
        return
      }
    }

    if (formData.serviceType === 'DEPARTURE' || formData.serviceType === 'BOTH') {
      if (!formData.departureContactPersonType || !formData.departureContactPersonId) {
        alert('Please select a departure contact person')
        return
      }
    }

    setLoading(true)
    try {
      const response = await fetch('/api/travel/embassy-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelRequestId,
          ...formData,
          arrivalContactPersonId: formData.arrivalContactPersonId ? parseInt(formData.arrivalContactPersonId) : null,
          departureContactPersonId: formData.departureContactPersonId ? parseInt(formData.departureContactPersonId) : null,
          arrivalFlightId: formData.arrivalFlightId ? parseInt(formData.arrivalFlightId) : null,
          departureFlightId: formData.departureFlightId ? parseInt(formData.departureFlightId) : null,
          arrivalDate: formData.arrivalDate ? new Date(formData.arrivalDate) : null,
          departureDate: formData.departureDate ? new Date(formData.departureDate) : null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(`Failed to add embassy service: ${result.error}`)
      }
    } catch (error) {
      alert('Error adding embassy service. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🏛️ Book Embassy Service
            </h2>
            <p className="text-amber-100 text-sm mt-1">
              Arrival/Departure embassy greeting service
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-amber-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Type Selection */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">Select Service Type</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {SERVICE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Choose whether you need arrival greeting, departure assistance, or both
            </p>
          </div>

          {/* Arrival Section */}
          {(formData.serviceType === 'ARRIVAL' || formData.serviceType === 'BOTH') && (
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="text-lg font-semibold text-green-900 mb-4">✈️ Arrival Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Contact Person Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.arrivalContactPersonType}
                    onChange={(e) => setFormData({ ...formData, arrivalContactPersonType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select Type</option>
                    {PERSON_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Contact Person <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.arrivalContactPersonId}
                    onChange={(e) => setFormData({ ...formData, arrivalContactPersonId: e.target.value })}
                    disabled={loadingData || !formData.arrivalContactPersonType}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingData ? 'Loading...' : formData.arrivalContactPersonType ? 'Select Contact Person' : 'Select type first'}
                    </option>
                    {formData.arrivalContactPersonType === 'EMPLOYEE' && employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.empId} - {emp.firstName} {emp.middleName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link to Arrival Flight
                  </label>
                  <select
                    value={formData.arrivalFlightId}
                    onChange={(e) => setFormData({ ...formData, arrivalFlightId: e.target.value })}
                    disabled={loadingData}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
                  >
                    <option value="">No flight linkage</option>
                    {flights.map((flight) => (
                      <option key={flight.id} value={flight.id}>
                        {flight.flightNumber} - {flight.departureAirport} → {flight.arrivalAirport}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      value={formData.arrivalDate}
                      onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Departure Section */}
          {(formData.serviceType === 'DEPARTURE' || formData.serviceType === 'BOTH') && (
            <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
              <h3 className="text-lg font-semibold text-red-900 mb-4">🛫 Departure Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Contact Person Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.departureContactPersonType}
                    onChange={(e) => setFormData({ ...formData, departureContactPersonType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select Type</option>
                    {PERSON_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Contact Person <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.departureContactPersonId}
                    onChange={(e) => setFormData({ ...formData, departureContactPersonId: e.target.value })}
                    disabled={loadingData || !formData.departureContactPersonType}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingData ? 'Loading...' : formData.departureContactPersonType ? 'Select Contact Person' : 'Select type first'}
                    </option>
                    {formData.departureContactPersonType === 'EMPLOYEE' && employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.empId} - {emp.firstName} {emp.middleName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link to Departure Flight
                  </label>
                  <select
                    value={formData.departureFlightId}
                    onChange={(e) => setFormData({ ...formData, departureFlightId: e.target.value })}
                    disabled={loadingData}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
                  >
                    <option value="">No flight linkage</option>
                    {flights.map((flight) => (
                      <option key={flight.id} value={flight.id}>
                        {flight.flightNumber} - {flight.departureAirport} → {flight.arrivalAirport}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Embassy <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., US Embassy, Paris"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Special requirements, VIP protocols, security clearances..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
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
            disabled={loading || !formData.serviceType || !formData.location}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg hover:from-amber-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Booking...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Book Embassy Service</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
