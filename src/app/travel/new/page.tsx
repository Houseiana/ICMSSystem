'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function NewTravelRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tripStartDate: '',
    tripEndDate: '',
    notes: '',
    destinations: [{ city: '', country: '' }]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/travel/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createdById: 1, // TODO: Get from auth session
          tripStartDate: formData.tripStartDate || null,
          tripEndDate: formData.tripEndDate || null,
          notes: formData.notes || null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/travel/${result.data.id}`)
      } else {
        alert(`Failed to create travel request: ${result.error}`)
      }
    } catch (error) {
      console.error(error)
      alert('Error creating travel request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addDestination = () => {
    setFormData({
      ...formData,
      destinations: [...formData.destinations, { city: '', country: '' }]
    })
  }

  const removeDestination = (index: number) => {
    setFormData({
      ...formData,
      destinations: formData.destinations.filter((_, i) => i !== index)
    })
  }

  const updateDestination = (index: number, field: 'city' | 'country', value: string) => {
    const newDestinations = [...formData.destinations]
    newDestinations[index][field] = value
    setFormData({ ...formData, destinations: newDestinations })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/travel"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Travel Requests
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">Create New Travel Request</h1>
          <p className="text-gray-600 mt-2">Start planning a new trip</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Trip Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.tripStartDate}
                  onChange={(e) => setFormData({ ...formData, tripStartDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.tripEndDate}
                  onChange={(e) => setFormData({ ...formData, tripEndDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Destinations (Optional)
              </label>
              <button
                type="button"
                onClick={addDestination}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Destination
              </button>
            </div>

            <div className="space-y-3">
              {formData.destinations.map((dest, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={dest.city}
                    onChange={(e) => updateDestination(index, 'city', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={dest.country}
                    onChange={(e) => updateDestination(index, 'country', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.destinations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDestination(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Add any additional notes about this trip..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Link
              href="/travel"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Creating...' : 'Create Travel Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
