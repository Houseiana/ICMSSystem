'use client'

import { useState } from 'react'
import { X, UserCheck, Plane, Star, Building2 } from 'lucide-react'

interface AddMeetAssistDialogProps {
  travelRequestId: number
  onClose: () => void
  onSuccess: () => void
}

const SERVICE_TYPES = [
  { value: 'ARRIVAL', label: 'Arrival Service' },
  { value: 'DEPARTURE', label: 'Departure Service' },
  { value: 'BOTH', label: 'Arrival & Departure' },
  { value: 'TRANSIT', label: 'Transit/Connection' },
]

const VIP_LEVELS = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'VIP', label: 'VIP' },
  { value: 'VVIP', label: 'VVIP' },
]

const CURRENCIES = ['USD', 'EUR', 'GBP', 'QAR', 'AED', 'SAR']

export function AddMeetAssistDialog({
  travelRequestId,
  onClose,
  onSuccess,
}: AddMeetAssistDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    serviceType: 'ARRIVAL',
    serviceProvider: '',
    airport: '',
    airportName: '',
    terminal: '',
    flightNumber: '',
    serviceDate: '',
    serviceTime: '',
    meetingPoint: '',
    greeterName: '',
    greeterPhone: '',
    greeterEmail: '',
    numberOfPassengers: '',
    vipLevel: 'STANDARD',
    includesFastTrack: false,
    includesLounge: false,
    includesPorterage: false,
    includesBuggy: false,
    loungeAccess: '',
    specialRequests: '',
    pricePerPerson: '',
    totalPrice: '',
    currency: 'USD',
    bookingReference: '',
    confirmationNumber: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    websiteUrl: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/travel/meet-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelRequestId,
          ...formData,
          numberOfPassengers: formData.numberOfPassengers
            ? parseInt(formData.numberOfPassengers)
            : null,
          pricePerPerson: formData.pricePerPerson
            ? parseFloat(formData.pricePerPerson)
            : null,
          totalPrice: formData.totalPrice
            ? parseFloat(formData.totalPrice)
            : null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert('Error: ' + result.error)
      }
    } catch {
      alert('Failed to create meet & assist service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6" />
            Add Meet & Assist Service
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-violet-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Type & VIP Level */}
          <div className="bg-violet-50 p-4 rounded-lg">
            <h3 className="font-semibold text-violet-900 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Service Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceType: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                  required
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VIP Level
                </label>
                <select
                  value={formData.vipLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, vipLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  {VIP_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Provider
                </label>
                <input
                  type="text"
                  value={formData.serviceProvider}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceProvider: e.target.value })
                  }
                  placeholder="e.g., Reserve PS, VIP Terminal"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Passengers
                </label>
                <input
                  type="number"
                  value={formData.numberOfPassengers}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfPassengers: e.target.value })
                  }
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Airport & Flight Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Airport & Flight Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airport Code *
                </label>
                <input
                  type="text"
                  value={formData.airport}
                  onChange={(e) =>
                    setFormData({ ...formData, airport: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., LAX"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airport Name
                </label>
                <input
                  type="text"
                  value={formData.airportName}
                  onChange={(e) =>
                    setFormData({ ...formData, airportName: e.target.value })
                  }
                  placeholder="e.g., Los Angeles International Airport"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terminal
                </label>
                <input
                  type="text"
                  value={formData.terminal}
                  onChange={(e) =>
                    setFormData({ ...formData, terminal: e.target.value })
                  }
                  placeholder="e.g., Terminal B"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Associated Flight Number
                </label>
                <input
                  type="text"
                  value={formData.flightNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, flightNumber: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., QR 739"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Date
                </label>
                <input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Time
                </label>
                <input
                  type="time"
                  value={formData.serviceTime}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Point
                </label>
                <input
                  type="text"
                  value={formData.meetingPoint}
                  onChange={(e) =>
                    setFormData({ ...formData, meetingPoint: e.target.value })
                  }
                  placeholder="e.g., Arrivals Hall, Gate B12, VIP Terminal Entrance"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Services Included */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Services Included</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includesFastTrack}
                  onChange={(e) =>
                    setFormData({ ...formData, includesFastTrack: e.target.checked })
                  }
                  className="w-4 h-4 text-violet-600 rounded"
                />
                <span className="text-sm">Fast Track</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includesLounge}
                  onChange={(e) =>
                    setFormData({ ...formData, includesLounge: e.target.checked })
                  }
                  className="w-4 h-4 text-violet-600 rounded"
                />
                <span className="text-sm">Lounge Access</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includesPorterage}
                  onChange={(e) =>
                    setFormData({ ...formData, includesPorterage: e.target.checked })
                  }
                  className="w-4 h-4 text-violet-600 rounded"
                />
                <span className="text-sm">Porterage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includesBuggy}
                  onChange={(e) =>
                    setFormData({ ...formData, includesBuggy: e.target.checked })
                  }
                  className="w-4 h-4 text-violet-600 rounded"
                />
                <span className="text-sm">Buggy/Cart</span>
              </label>
            </div>
            {formData.includesLounge && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lounge Name
                </label>
                <input
                  type="text"
                  value={formData.loungeAccess}
                  onChange={(e) =>
                    setFormData({ ...formData, loungeAccess: e.target.value })
                  }
                  placeholder="e.g., Al Mourjan Business Lounge"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
            )}
          </div>

          {/* Greeter Information */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Greeter Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Greeter Name
                </label>
                <input
                  type="text"
                  value={formData.greeterName}
                  onChange={(e) =>
                    setFormData({ ...formData, greeterName: e.target.value })
                  }
                  placeholder="Name of person meeting"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Greeter Phone
                </label>
                <input
                  type="tel"
                  value={formData.greeterPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, greeterPhone: e.target.value })
                  }
                  placeholder="+1 234 567 8900"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Greeter Email
                </label>
                <input
                  type="email"
                  value={formData.greeterEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, greeterEmail: e.target.value })
                  }
                  placeholder="greeter@email.com"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Pricing & References</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Per Person
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerPerson: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, totalPrice: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Reference
                </label>
                <input
                  type="text"
                  value={formData.bookingReference}
                  onChange={(e) =>
                    setFormData({ ...formData, bookingReference: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmation Number
                </label>
                <input
                  type="text"
                  value={formData.confirmationNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmationNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Service Provider Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests / Notes
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({ ...formData, specialRequests: e.target.value })
              }
              rows={3}
              placeholder="Any special requirements or requests..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Meet & Assist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
