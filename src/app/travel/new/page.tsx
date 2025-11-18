'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Plus, Trash2, User, Plane, Building2, Hotel, Landmark, Train, Car, CarFront, Ticket } from 'lucide-react'
import Link from 'next/link'
import { CountryCitySelector } from '@/components/common/CountryCitySelector'

interface PersonOption {
  id: number
  name: string
  type: string
  email?: string
}

const TRAVEL_REQUIREMENTS = [
  { key: 'needsFlight', label: 'Flight', icon: Plane, color: 'blue' },
  { key: 'needsPrivateJet', label: 'Private Jet', icon: Building2, color: 'purple' },
  { key: 'needsHotel', label: 'Hotel', icon: Hotel, color: 'green' },
  { key: 'needsEmbassyService', label: 'Embassy Service', icon: Landmark, color: 'red' },
  { key: 'needsTrain', label: 'Train', icon: Train, color: 'yellow' },
  { key: 'needsRentalCar', label: 'Rental Car', icon: Car, color: 'indigo' },
  { key: 'needsCarWithDriver', label: 'Car with Driver', icon: CarFront, color: 'pink' },
  { key: 'needsEvents', label: 'Events & Activities', icon: Ticket, color: 'orange' }
] as const

export default function NewTravelRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [people, setPeople] = useState<PersonOption[]>([])
  const [formData, setFormData] = useState({
    tripOwnerType: '',
    tripOwnerId: '',
    tripStartDate: '',
    tripEndDate: '',
    notes: '',
    destinations: [{ city: '', country: '' }],
    needsFlight: false,
    needsPrivateJet: false,
    needsHotel: false,
    needsEmbassyService: false,
    needsTrain: false,
    needsRentalCar: false,
    needsCarWithDriver: false,
    needsEvents: false
  })

  // Fetch people (employees, stakeholders, etc.) for trip owner selection
  useEffect(() => {
    const fetchPeople = async () => {
      setLoadingPeople(true)
      try {
        const response = await fetch('/api/people')
        const result = await response.json()

        if (result.success && result.data) {
          const peopleOptions: PersonOption[] = result.data.map((person: any) => ({
            id: person.id,
            name: person.fullName || person.name || `${person.firstName} ${person.lastName}`,
            type: person.personType || person.type,
            email: person.email
          }))
          setPeople(peopleOptions)
        }
      } catch (error) {
        console.error('Error fetching people:', error)
      } finally {
        setLoadingPeople(false)
      }
    }

    fetchPeople()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/travel/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createdById: 1, // TODO: Get from auth session
          tripOwnerType: formData.tripOwnerType || null,
          tripOwnerId: formData.tripOwnerId ? parseInt(formData.tripOwnerId) : null,
          tripStartDate: formData.tripStartDate || null,
          tripEndDate: formData.tripEndDate || null,
          notes: formData.notes || null,
          needsFlight: formData.needsFlight,
          needsPrivateJet: formData.needsPrivateJet,
          needsHotel: formData.needsHotel,
          needsEmbassyService: formData.needsEmbassyService,
          needsTrain: formData.needsTrain,
          needsRentalCar: formData.needsRentalCar,
          needsCarWithDriver: formData.needsCarWithDriver,
          needsEvents: formData.needsEvents
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

  const updateDestinationCountry = (index: number, country: string) => {
    updateDestination(index, 'country', country)
  }

  const updateDestinationCity = (index: number, city: string) => {
    updateDestination(index, 'city', city)
  }

  const toggleRequirement = (key: string) => {
    setFormData({ ...formData, [key]: !formData[key as keyof typeof formData] })
  }

  const handleTripOwnerChange = (value: string) => {
    if (!value) {
      setFormData({ ...formData, tripOwnerType: '', tripOwnerId: '' })
      return
    }

    const [type, id] = value.split(':')
    setFormData({ ...formData, tripOwnerType: type, tripOwnerId: id })
  }

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected
        ? 'bg-blue-100 border-blue-500 text-blue-700'
        : 'bg-white border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300',
      purple: isSelected
        ? 'bg-purple-100 border-purple-500 text-purple-700'
        : 'bg-white border-gray-300 text-gray-600 hover:bg-purple-50 hover:border-purple-300',
      green: isSelected
        ? 'bg-green-100 border-green-500 text-green-700'
        : 'bg-white border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-300',
      red: isSelected
        ? 'bg-red-100 border-red-500 text-red-700'
        : 'bg-white border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300',
      yellow: isSelected
        ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
        : 'bg-white border-gray-300 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300',
      indigo: isSelected
        ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
        : 'bg-white border-gray-300 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300',
      pink: isSelected
        ? 'bg-pink-100 border-pink-500 text-pink-700'
        : 'bg-white border-gray-300 text-gray-600 hover:bg-pink-50 hover:border-pink-300',
      orange: isSelected
        ? 'bg-orange-100 border-orange-500 text-orange-700'
        : 'bg-white border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300'
    }
    return colors[color as keyof typeof colors] || colors.blue
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
          {/* Trip Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Owner
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.tripOwnerType && formData.tripOwnerId ? `${formData.tripOwnerType}:${formData.tripOwnerId}` : ''}
                onChange={(e) => handleTripOwnerChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingPeople}
              >
                <option value="">Select trip owner...</option>
                {people.map((person) => (
                  <option key={`${person.type}:${person.id}`} value={`${person.type}:${person.id}`}>
                    {person.name} ({person.type})
                  </option>
                ))}
              </select>
            </div>
            {loadingPeople && (
              <p className="text-xs text-gray-500 mt-1">Loading people...</p>
            )}
          </div>

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

          {/* Travel Requirements - Icon-Based Selectors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What do you need for this trip?
            </label>
            <p className="text-xs text-gray-500 mb-4">Select the services and requirements for this travel request</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRAVEL_REQUIREMENTS.map((req) => {
                const Icon = req.icon
                const isSelected = formData[req.key as keyof typeof formData] as boolean
                return (
                  <button
                    key={req.key}
                    type="button"
                    onClick={() => toggleRequirement(req.key)}
                    className={`relative p-4 border-2 rounded-lg transition-all flex flex-col items-center justify-center gap-2 min-h-[120px] ${getColorClasses(req.color, isSelected)}`}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="text-sm font-medium text-center">{req.label}</span>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className={`w-5 h-5 rounded-full bg-${req.color}-600 flex items-center justify-center`}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
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

            <div className="space-y-4">
              {formData.destinations.map((dest, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Destination {index + 1}</h4>
                    {formData.destinations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDestination(index)}
                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <CountryCitySelector
                    country={dest.country}
                    city={dest.city}
                    onCountryChange={(country) => updateDestinationCountry(index, country)}
                    onCityChange={(city) => updateDestinationCity(index, city)}
                    countryLabel="Country"
                    cityLabel="City"
                  />
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
