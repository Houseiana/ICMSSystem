'use client'

import { useState } from 'react'
import { Send, X, Mail, MessageCircle, CheckCircle } from 'lucide-react'
import { ContentType, CommunicationType, TripPassenger } from '@/types/travel'

interface SendDetailsDialogProps {
  travelRequestId: number
  passengers: TripPassenger[]
  onClose: () => void
  onSuccess: () => void
}

export function SendDetailsDialog({
  travelRequestId,
  passengers,
  onClose,
  onSuccess,
}: SendDetailsDialogProps) {
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([])
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [communicationType, setCommunicationType] = useState<CommunicationType>('EMAIL')
  const [customMessage, setCustomMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async () => {
    if (selectedPassengers.length === 0 || contentTypes.length === 0) {
      alert('Please select at least one passenger and one content type')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/travel/passengers/send-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelRequestId,
          passengerIds: selectedPassengers,
          contentTypes,
          communicationType,
          customMessage: customMessage.trim() || undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setShowSuccess(true)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      } else {
        alert(`Failed to send details: ${result.error}`)
      }
    } catch (error) {
      alert('Error sending details. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const togglePassenger = (passengerId: number) => {
    setSelectedPassengers((prev) =>
      prev.includes(passengerId)
        ? prev.filter((id) => id !== passengerId)
        : [...prev, passengerId]
    )
  }

  const toggleContentType = (type: ContentType) => {
    setContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const selectAllPassengers = () => {
    setSelectedPassengers(passengers.map((p) => p.id))
  }

  const deselectAllPassengers = () => {
    setSelectedPassengers([])
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Details Sent!</h3>
          <p className="text-gray-600">
            Travel details have been sent to {selectedPassengers.length} passenger(s)
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Send Travel Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select passengers and content to send via email or WhatsApp
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
          {/* Passengers Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-900">
                Select Passengers <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAllPassengers}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={deselectAllPassengers}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
              {passengers.length > 0 ? (
                passengers.map((passenger) => (
                  <label
                    key={passenger.id}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPassengers.includes(passenger.id)}
                      onChange={() => togglePassenger(passenger.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {passenger.personDetails?.fullName || 'Unknown'}
                        </span>
                        {passenger.isMainPassenger && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                            Main
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                        {passenger.personDetails?.email && (
                          <span>✉️ {passenger.personDetails.email}</span>
                        )}
                        {passenger.personDetails?.phone && (
                          <span>📱 {passenger.personDetails.phone}</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No passengers added yet
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {selectedPassengers.length} of {passengers.length} passengers selected
            </p>
          </div>

          {/* Content Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              What to Send <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { value: 'FLIGHT_DETAILS', label: 'Flight Details', icon: '✈️' },
                { value: 'HOTEL_DETAILS', label: 'Hotel Details', icon: '🏨' },
                { value: 'EVENT_DETAILS', label: 'Events & Activities', icon: '🎭' },
                { value: 'FULL_ITINERARY', label: 'Full Itinerary', icon: '📋' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    contentTypes.includes(option.value as ContentType)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={contentTypes.includes(option.value as ContentType)}
                    onChange={() => toggleContentType(option.value as ContentType)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Communication Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Send Via <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'EMAIL', label: 'Email', icon: Mail },
                { value: 'WHATSAPP', label: 'WhatsApp', icon: MessageCircle },
                { value: 'BOTH', label: 'Both', icon: Send },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    communicationType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="communicationType"
                    value={option.value}
                    checked={communicationType === option.value}
                    onChange={(e) =>
                      setCommunicationType(e.target.value as CommunicationType)
                    }
                    className="sr-only"
                  />
                  <option.icon
                    className={`w-6 h-6 ${
                      communicationType === option.value
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      communicationType === option.value
                        ? 'text-blue-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Custom Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              placeholder="Add a personal message to include with the travel details..."
            />
            <p className="text-xs text-gray-500 mt-2">
              This message will be included at the beginning of the email/WhatsApp
            </p>
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
            disabled={
              loading || selectedPassengers.length === 0 || contentTypes.length === 0
            }
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Details</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
