'use client'

import { useState } from 'react'
import { X, Plus, UserPlus, Trash2 } from 'lucide-react'

interface Passenger {
  id: number
  personType: string
  personId: number
  isMainPassenger: boolean
  personDetails?: {
    fullName?: string
    companyName?: string
    firstName?: string
    lastName?: string
  }
}

interface AddRentalCarDialogProps {
  travelRequestId: number
  passengers: Passenger[]
  onClose: () => void
  onSuccess: () => void
}

const VEHICLE_TYPES = [
  'Compact',
  'Sedan',
  'SUV',
  'Luxury',
  'Van',
  'Convertible',
  'Electric',
]

const INSURANCE_TYPES = [
  'Basic',
  'Standard',
  'Premium',
  'Full Coverage',
  'CDW',
  'LDW',
]

interface AdditionalDriver {
  personType: string
  personId: number
  name: string
}

export function AddRentalCarDialog({
  travelRequestId,
  passengers,
  onClose,
  onSuccess,
}: AddRentalCarDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    vehicleType: '',
    vehicleModel: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    mainDriver: '', // Format: "personType:personId"
    insuranceType: '',
    bookingReference: '',
    status: 'PENDING',
    notes: '',
  })
  const [additionalDrivers, setAdditionalDrivers] = useState<AdditionalDriver[]>([])
  const [showAddDriver, setShowAddDriver] = useState(false)

  const getPassengerName = (passenger: Passenger) => {
    const details = passenger.personDetails
    if (details?.fullName) return details.fullName
    if (details?.companyName) return details.companyName
    if (details?.firstName || details?.lastName) {
      return `${details.firstName || ''} ${details.lastName || ''}`.trim()
    }
    return `${passenger.personType} #${passenger.personId}`
  }

  const getAvailablePassengersForAdditionalDriver = () => {
    // Exclude main driver and already added additional drivers
    const mainDriverKey = formData.mainDriver
    const addedKeys = additionalDrivers.map(d => `${d.personType}:${d.personId}`)

    return passengers.filter(p => {
      const key = `${p.personType}:${p.personId}`
      return key !== mainDriverKey && !addedKeys.includes(key)
    })
  }

  const handleAddAdditionalDriver = (passengerKey: string) => {
    const [personType, personIdStr] = passengerKey.split(':')
    const personId = parseInt(personIdStr)
    const passenger = passengers.find(p => p.personType === personType && p.personId === personId)

    if (passenger) {
      setAdditionalDrivers([
        ...additionalDrivers,
        {
          personType,
          personId,
          name: getPassengerName(passenger)
        }
      ])
    }
    setShowAddDriver(false)
  }

  const handleRemoveAdditionalDriver = (index: number) => {
    setAdditionalDrivers(additionalDrivers.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!formData.company || !formData.pickupLocation || !formData.mainDriver) {
      alert('Please fill in all required fields')
      return
    }

    const [driverPersonType, driverPersonIdStr] = formData.mainDriver.split(':')
    const driverPersonId = parseInt(driverPersonIdStr)

    setLoading(true)
    try {
      const response = await fetch('/api/travel/rental-cars-self-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelRequestId,
          rentalCompany: formData.company,
          carType: formData.vehicleType,
          carModel: formData.vehicleModel,
          pickupLocation: formData.pickupLocation,
          returnLocation: formData.dropoffLocation,
          pickupDate: formData.pickupDate ? new Date(formData.pickupDate) : null,
          pickupTime: formData.pickupTime,
          returnDate: formData.dropoffDate ? new Date(formData.dropoffDate) : null,
          returnTime: formData.dropoffTime,
          driverPersonType,
          driverPersonId,
          additionalDrivers: additionalDrivers.length > 0
            ? additionalDrivers.map(d => ({ personType: d.personType, personId: d.personId }))
            : null,
          insuranceType: formData.insuranceType,
          bookingReference: formData.bookingReference,
          status: formData.status,
          notes: formData.notes,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(`Failed to add rental car: ${result.error}`)
      }
    } catch (error) {
      alert('Error adding rental car. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🚗 Book Rental Car (Self-Drive)
            </h2>
            <p className="text-orange-100 text-sm mt-1">
              Self-drive car rental booking
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Rental Company & Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Hertz, Enterprise"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select Type</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Model
              </label>
              <input
                type="text"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                placeholder="e.g., Toyota Camry"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Main Driver Selection */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Driver (Passenger) <span className="text-red-500">*</span>
            </label>
            {passengers.length === 0 ? (
              <div className="text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                No passengers added to this travel request yet. Please add passengers first.
              </div>
            ) : (
              <select
                value={formData.mainDriver}
                onChange={(e) => {
                  setFormData({ ...formData, mainDriver: e.target.value })
                  // Remove from additional drivers if selected as main
                  const newAdditional = additionalDrivers.filter(
                    d => `${d.personType}:${d.personId}` !== e.target.value
                  )
                  setAdditionalDrivers(newAdditional)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select Main Driver</option>
                {passengers.map((passenger) => (
                  <option
                    key={`${passenger.personType}:${passenger.personId}`}
                    value={`${passenger.personType}:${passenger.personId}`}
                  >
                    {getPassengerName(passenger)} {passenger.isMainPassenger ? '(Main Passenger)' : ''}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Driver must be one of the passengers in this travel request
            </p>
          </div>

          {/* Additional Drivers */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Additional Drivers (Optional)
              </label>
              {formData.mainDriver && getAvailablePassengersForAdditionalDriver().length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAddDriver(!showAddDriver)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Driver
                </button>
              )}
            </div>

            {/* Add Driver Dropdown */}
            {showAddDriver && (
              <div className="mb-3">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddAdditionalDriver(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select passenger to add as driver...</option>
                  {getAvailablePassengersForAdditionalDriver().map((passenger) => (
                    <option
                      key={`${passenger.personType}:${passenger.personId}`}
                      value={`${passenger.personType}:${passenger.personId}`}
                    >
                      {getPassengerName(passenger)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* List of Additional Drivers */}
            {additionalDrivers.length > 0 ? (
              <div className="space-y-2">
                {additionalDrivers.map((driver, index) => (
                  <div
                    key={`${driver.personType}:${driver.personId}`}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border"
                  >
                    <span className="text-sm font-medium text-gray-700">{driver.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalDriver(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {!formData.mainDriver
                  ? 'Select a main driver first to add additional drivers'
                  : 'No additional drivers added'}
              </p>
            )}
          </div>

          {/* Pickup & Dropoff Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                placeholder="e.g., LAX Airport"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dropoff Location
              </label>
              <input
                type="text"
                value={formData.dropoffLocation}
                onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                placeholder="e.g., LAX Airport"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Pickup & Dropoff Times */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.pickupTime}
                onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dropoff Date
              </label>
              <input
                type="date"
                value={formData.dropoffDate}
                onChange={(e) => setFormData({ ...formData, dropoffDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.dropoffTime}
                onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Insurance & Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Type
              </label>
              <select
                value={formData.insuranceType}
                onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select Insurance</option>
                {INSURANCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Reference
              </label>
              <input
                type="text"
                value={formData.bookingReference}
                onChange={(e) => setFormData({ ...formData, bookingReference: e.target.value })}
                placeholder="REF123456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
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
              placeholder="Any special requirements or information..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
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
            disabled={loading || !formData.company || !formData.pickupLocation || !formData.mainDriver}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Booking...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Book Rental Car</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
