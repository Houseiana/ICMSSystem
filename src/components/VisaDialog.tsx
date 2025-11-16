'use client'

import React, { useState, useEffect } from 'react'
import { X, User, Mail, Globe, Calendar } from 'lucide-react'
import PersonSelectorDialog from './PersonSelectorDialog'

interface Person {
  id: number
  fullName: string
  email: string | null
  phone: string | null
  nationality: string | null
  type: 'EMPLOYEE' | 'EMPLOYER' | 'STAKEHOLDER' | 'TASK_HELPER'
}

interface VisaDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  visa?: any | null
}

const COUNTRIES = [
  { code: 'UK', name: 'United Kingdom', icon: '\ud83c\uddec\ud83c\udde7' },
  { code: 'SCHENGEN', name: 'Schengen Area', icon: '\ud83c\uddea\ud83c\uddfa' },
  { code: 'KSA', name: 'Saudi Arabia', icon: '\ud83c\uddf8\ud83c\udde6' },
  { code: 'USA', name: 'United States', icon: '\ud83c\uddfa\ud83c\uddf8' },
  { code: 'TURKEY', name: 'Turkey', icon: '\ud83c\uddf9\ud83c\uddf7' }
]

const VISA_CATEGORIES = [
  'VISIT',
  'BUSINESS',
  'ESCORT',
  'DOMESTIC_WORKER',
  'TOURIST',
  'STUDENT',
  'WORK',
  'TRANSIT',
  'FAMILY',
  'MEDICAL'
]

const PURPOSE_OPTIONS = [
  'General Visit',
  'Business Meeting',
  'Tourism',
  'Family Visit',
  'Medical Treatment',
  'Conference',
  'Training',
  'Work Assignment',
  'Study',
  'Transit'
]

const APPLICATION_STATUS_OPTIONS = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'COLLECTED'
]

export default function VisaDialog({
  isOpen,
  onClose,
  onSuccess,
  visa
}: VisaDialogProps) {
  const [showPersonSelector, setShowPersonSelector] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    destinationCountry: '',
    visaStatus: 'NEEDS_VISA',
    visaNumber: '',
    visaCategory: '',
    issuanceDate: '',
    expiryDate: '',
    purposeOfTravel: '',
    applicationStatus: 'DRAFT',
    plannedDepartureDate: '',
    plannedReturnDate: ''
  })

  useEffect(() => {
    if (visa) {
      // Editing existing visa
      setFormData({
        destinationCountry: visa.destinationCountry || '',
        visaStatus: visa.visaStatus || 'NEEDS_VISA',
        visaNumber: visa.visaNumber || '',
        visaCategory: visa.visaCategory || '',
        issuanceDate: visa.issuanceDate ? new Date(visa.issuanceDate).toISOString().split('T')[0] : '',
        expiryDate: visa.expiryDate ? new Date(visa.expiryDate).toISOString().split('T')[0] : '',
        purposeOfTravel: visa.purposeOfTravel || '',
        applicationStatus: visa.applicationStatus || 'DRAFT',
        plannedDepartureDate: visa.plannedDepartureDate ? new Date(visa.plannedDepartureDate).toISOString().split('T')[0] : '',
        plannedReturnDate: visa.plannedReturnDate ? new Date(visa.plannedReturnDate).toISOString().split('T')[0] : ''
      })
      setSelectedPerson({
        id: visa.personId,
        fullName: visa.personName,
        email: visa.personEmail,
        phone: null,
        nationality: visa.personNationality,
        type: visa.personType
      })
    } else {
      // Reset form for new visa
      setFormData({
        destinationCountry: '',
        visaStatus: 'NEEDS_VISA',
        visaNumber: '',
        visaCategory: '',
        issuanceDate: '',
        expiryDate: '',
        purposeOfTravel: '',
        applicationStatus: 'DRAFT',
        plannedDepartureDate: '',
        plannedReturnDate: ''
      })
      setSelectedPerson(null)
    }
  }, [visa, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPerson) {
      alert('Please select a person')
      return
    }

    if (!formData.destinationCountry) {
      alert('Please select a destination country')
      return
    }

    setLoading(true)

    try {
      const country = COUNTRIES.find(c => c.code === formData.destinationCountry)

      const payload = {
        personType: selectedPerson.type,
        personId: selectedPerson.id,
        destinationCountry: formData.destinationCountry,
        countryIcon: country?.icon || '',
        countryFullName: country?.name || '',
        visaStatus: formData.visaStatus,
        visaNumber: formData.visaNumber || null,
        visaCategory: formData.visaCategory || null,
        issuanceDate: formData.issuanceDate || null,
        expiryDate: formData.expiryDate || null,
        purposeOfTravel: formData.purposeOfTravel || null,
        applicationStatus: formData.applicationStatus,
        plannedDepartureDate: formData.plannedDepartureDate || null,
        plannedReturnDate: formData.plannedReturnDate || null
      }

      const url = visa ? `/api/visas/${visa.id}` : '/api/visas'
      const method = visa ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save visa')
      }
    } catch (error) {
      console.error('Error saving visa:', error)
      alert('Failed to save visa')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 mx-4">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {visa ? 'Edit Visa Record' : 'Add New Visa Record'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Person Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <User size={20} />
                Person Information
              </h3>
              {selectedPerson ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{selectedPerson.fullName}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Type: {selectedPerson.type.replace('_', ' ')}
                      </p>
                      {selectedPerson.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Mail size={14} />
                          {selectedPerson.email}
                        </p>
                      )}
                      {selectedPerson.nationality && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Globe size={14} />
                          {selectedPerson.nationality}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPersonSelector(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Change Person
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPersonSelector(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <User className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-gray-600">Click to select a person</p>
                </button>
              )}
            </div>

            {/* Destination Country */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Destination Country</h3>
              <select
                value={formData.destinationCountry}
                onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.icon} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Visa Status */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Visa Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['HAS_VISA', 'NO_VISA', 'NEEDS_VISA', 'UNDER_PROCESS'].map((status) => (
                  <label
                    key={status}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.visaStatus === status
                        ? 'bg-blue-50 border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visaStatus"
                      value={status}
                      checked={formData.visaStatus === status}
                      onChange={(e) => setFormData({ ...formData, visaStatus: e.target.value })}
                      className="mr-2"
                    />
                    {status.replace(/_/g, ' ')}
                  </label>
                ))}
              </div>
            </div>

            {/* Visa Details (show when HAS_VISA) */}
            {formData.visaStatus === 'HAS_VISA' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Visa Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visa Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.visaNumber}
                      onChange={(e) => setFormData({ ...formData, visaNumber: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required={formData.visaStatus === 'HAS_VISA'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visa Category
                    </label>
                    <select
                      value={formData.visaCategory}
                      onChange={(e) => setFormData({ ...formData, visaCategory: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {VISA_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuance Date
                    </label>
                    <input
                      type="date"
                      value={formData.issuanceDate}
                      onChange={(e) => setFormData({ ...formData, issuanceDate: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Travel Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
                <Calendar size={20} />
                Travel Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Travel
                  </label>
                  <select
                    value={formData.purposeOfTravel}
                    onChange={(e) => setFormData({ ...formData, purposeOfTravel: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Purpose</option>
                    {PURPOSE_OPTIONS.map((purpose) => (
                      <option key={purpose} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Status
                  </label>
                  <select
                    value={formData.applicationStatus}
                    onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {APPLICATION_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Planned Departure Date
                  </label>
                  <input
                    type="date"
                    value={formData.plannedDepartureDate}
                    onChange={(e) => setFormData({ ...formData, plannedDepartureDate: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Planned Return Date
                  </label>
                  <input
                    type="date"
                    value={formData.plannedReturnDate}
                    onChange={(e) => setFormData({ ...formData, plannedReturnDate: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : visa ? 'Update Visa Record' : 'Create Visa Record'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Person Selector Dialog */}
      <PersonSelectorDialog
        isOpen={showPersonSelector}
        onClose={() => setShowPersonSelector(false)}
        onSelect={(person) => setSelectedPerson(person)}
      />
    </>
  )
}
