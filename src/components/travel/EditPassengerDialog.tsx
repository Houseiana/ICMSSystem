'use client'

import { useState } from 'react'
import { X, Save, Eye, Edit2, User } from 'lucide-react'

interface PassengerData {
  id: number
  travelRequestId: number
  personType: string
  personId: number
  isMainPassenger: boolean
  visaStatus?: string
  visaId?: number
  visaValidityStart?: string
  visaValidityEnd?: string
  passportId?: number
  notificationPreference: string
  receiveFlightDetails: boolean
  receiveHotelDetails: boolean
  receiveEventDetails: boolean
  receiveItinerary: boolean
  personDetails?: {
    fullName?: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    nationality?: string
    dateOfBirth?: string
    companyName?: string
  }
}

interface EditPassengerDialogProps {
  passenger: PassengerData
  mode: 'preview' | 'edit'
  onClose: () => void
  onSuccess: () => void
}

export function EditPassengerDialog({
  passenger,
  mode: initialMode,
  onClose,
  onSuccess,
}: EditPassengerDialogProps) {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(initialMode)

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
    isMainPassenger: passenger.isMainPassenger,
    visaStatus: passenger.visaStatus || '',
    visaValidityStart: formatDateForInput(passenger.visaValidityStart),
    visaValidityEnd: formatDateForInput(passenger.visaValidityEnd),
    passportId: passenger.passportId?.toString() || '',
    notificationPreference: passenger.notificationPreference || 'ALL',
    receiveFlightDetails: passenger.receiveFlightDetails,
    receiveHotelDetails: passenger.receiveHotelDetails,
    receiveEventDetails: passenger.receiveEventDetails,
    receiveItinerary: passenger.receiveItinerary,
  })

  const personDetails = passenger.personDetails as any
  const passengerName = personDetails?.fullName ||
    personDetails?.companyName ||
    `${personDetails?.firstName || ''} ${personDetails?.lastName || ''}`.trim() ||
    `${passenger.personType} #${passenger.personId}`

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/travel/passengers/${passenger.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          visaValidityStart: formData.visaValidityStart ? new Date(formData.visaValidityStart) : null,
          visaValidityEnd: formData.visaValidityEnd ? new Date(formData.visaValidityEnd) : null,
          passportId: formData.passportId ? parseInt(formData.passportId) : null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(`Failed to update passenger: ${result.error}`)
      }
    } catch (error) {
      alert('Error updating passenger. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Preview Mode
  if (mode === 'preview') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                {passengerName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">Passenger Details</h2>
                <p className="text-sm text-blue-100">{passengerName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Person Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Person Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-semibold text-gray-900">{passengerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-semibold text-gray-900">{passenger.personType}</p>
                </div>
                {personDetails?.email && (
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{personDetails.email}</p>
                  </div>
                )}
                {personDetails?.phone && (
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{personDetails.phone}</p>
                  </div>
                )}
                {personDetails?.nationality && (
                  <div>
                    <p className="text-xs text-gray-500">Nationality</p>
                    <p className="font-semibold text-gray-900">{personDetails.nationality}</p>
                  </div>
                )}
                {personDetails?.dateOfBirth && (
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(personDetails.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Main Passenger</p>
                <p className="font-semibold text-gray-900">
                  {passenger.isMainPassenger ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Notification Preference</p>
                <p className="font-semibold text-gray-900">
                  {formData.notificationPreference.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            {/* Visa Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Visa Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Visa Status</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    passenger.visaStatus === 'HAS_VISA' ? 'bg-green-100 text-green-800' :
                    passenger.visaStatus === 'UNDER_PROCESS' ? 'bg-yellow-100 text-yellow-800' :
                    passenger.visaStatus === 'NEEDS_VISA' ? 'bg-orange-100 text-orange-800' :
                    passenger.visaStatus === 'NOT_REQUIRED' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {passenger.visaStatus?.replace(/_/g, ' ') || 'Not Set'}
                  </span>
                </div>
                {passenger.visaValidityEnd && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Valid Until</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(passenger.visaValidityEnd).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Passport Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Passport Information</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Passport ID</p>
                <p className="font-semibold text-gray-900">
                  {passenger.passportId ? `ID: ${passenger.passportId}` : 'Not linked'}
                </p>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Notification Settings</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${formData.receiveFlightDetails ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <p className="text-sm font-medium text-gray-900">Flight Details</p>
                  <p className="text-xs text-gray-500">{formData.receiveFlightDetails ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className={`p-3 rounded-lg ${formData.receiveHotelDetails ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <p className="text-sm font-medium text-gray-900">Hotel Details</p>
                  <p className="text-xs text-gray-500">{formData.receiveHotelDetails ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className={`p-3 rounded-lg ${formData.receiveEventDetails ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <p className="text-sm font-medium text-gray-900">Event Details</p>
                  <p className="text-xs text-gray-500">{formData.receiveEventDetails ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className={`p-3 rounded-lg ${formData.receiveItinerary ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <p className="text-sm font-medium text-gray-900">Itinerary</p>
                  <p className="text-xs text-gray-500">{formData.receiveItinerary ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
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
              onClick={() => setMode('edit')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Passenger
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Edit Mode
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Passenger</h2>
            <p className="text-sm text-gray-500 mt-1">{passengerName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('preview')}
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
          {/* Main Passenger */}
          <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.isMainPassenger}
              onChange={(e) => setFormData({ ...formData, isMainPassenger: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div>
              <p className="font-medium text-gray-900">Main Passenger</p>
              <p className="text-xs text-gray-500">
                This person is the primary contact for this trip
              </p>
            </div>
          </label>

          {/* Visa Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Visa Status
            </label>
            <select
              value={formData.visaStatus}
              onChange={(e) => setFormData({ ...formData, visaStatus: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Not Set</option>
              <option value="HAS_VISA">Has Visa</option>
              <option value="NEEDS_VISA">Needs Visa</option>
              <option value="UNDER_PROCESS">Under Process</option>
              <option value="NOT_REQUIRED">Not Required</option>
            </select>
          </div>

          {/* Visa Validity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Visa Valid From
              </label>
              <input
                type="date"
                value={formData.visaValidityStart}
                onChange={(e) => setFormData({ ...formData, visaValidityStart: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Visa Valid Until
              </label>
              <input
                type="date"
                value={formData.visaValidityEnd}
                onChange={(e) => setFormData({ ...formData, visaValidityEnd: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Passport ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Passport ID (Reference)
            </label>
            <input
              type="number"
              value={formData.passportId}
              onChange={(e) => setFormData({ ...formData, passportId: e.target.value })}
              placeholder="Enter passport record ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Notification Preference */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Notification Preference
            </label>
            <select
              value={formData.notificationPreference}
              onChange={(e) => setFormData({ ...formData, notificationPreference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Notifications</option>
              <option value="MINIMAL">Minimal</option>
              <option value="NONE">None</option>
            </select>
          </div>

          {/* Notification Settings */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Receive Notifications For
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.receiveFlightDetails}
                  onChange={(e) => setFormData({ ...formData, receiveFlightDetails: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">Flight Details</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.receiveHotelDetails}
                  onChange={(e) => setFormData({ ...formData, receiveHotelDetails: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">Hotel Details</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.receiveEventDetails}
                  onChange={(e) => setFormData({ ...formData, receiveEventDetails: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">Event Details</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.receiveItinerary}
                  onChange={(e) => setFormData({ ...formData, receiveItinerary: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">Full Itinerary</span>
              </label>
            </div>
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
            disabled={loading}
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
