'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Plus, Trash2, Users, Heart } from 'lucide-react'

interface Stakeholder {
  id: number
  firstName: string
  middleName?: string
  lastName: string
  preferredName?: string
  email?: string
  phone?: string
  gender?: string
  occupation?: string
  spouse?: {
    id: number
    firstName: string
    lastName: string
  }
}

interface StakeholderFormProps {
  isOpen: boolean
  onClose: () => void
  stakeholder?: Stakeholder | null
  stakeholders: Stakeholder[]
  onSuccess: () => void
}

export default function StakeholderForm({
  isOpen,
  onClose,
  stakeholder,
  stakeholders,
  onSuccess
}: StakeholderFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    nationality: '',
    religion: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    nationalId: '',
    passportNumber: '',
    occupation: '',
    employer: '',
    workAddress: '',
    bloodGroup: '',
    medicalConditions: '',
    allergies: '',
    notes: '',
    spouseId: '',
    fatherId: '',
    motherId: ''
  })

  const [relationships, setRelationships] = useState<Array<{
    toId: string
    relationshipType: string
    description: string
    strength: number
  }>>([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (stakeholder) {
      setFormData({
        firstName: stakeholder.firstName || '',
        middleName: stakeholder.middleName || '',
        lastName: stakeholder.lastName || '',
        preferredName: stakeholder.preferredName || '',
        email: stakeholder.email || '',
        phone: stakeholder.phone || '',
        alternatePhone: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: stakeholder.gender || '',
        nationality: '',
        religion: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        nationalId: '',
        passportNumber: '',
        occupation: stakeholder.occupation || '',
        employer: '',
        workAddress: '',
        bloodGroup: '',
        medicalConditions: '',
        allergies: '',
        notes: '',
        spouseId: stakeholder.spouse?.id.toString() || '',
        fatherId: '',
        motherId: ''
      })
    } else {
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        preferredName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        nationality: '',
        religion: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        nationalId: '',
        passportNumber: '',
        occupation: '',
        employer: '',
        workAddress: '',
        bloodGroup: '',
        medicalConditions: '',
        allergies: '',
        notes: '',
        spouseId: '',
        fatherId: '',
        motherId: ''
      })
      setRelationships([])
    }
  }, [stakeholder])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddRelationship = () => {
    setRelationships(prev => [...prev, {
      toId: '',
      relationshipType: 'FRIEND',
      description: '',
      strength: 3
    }])
  }

  const handleRelationshipChange = (index: number, field: string, value: string | number) => {
    setRelationships(prev =>
      prev.map((rel, i) => i === index ? { ...rel, [field]: value } : rel)
    )
  }

  const handleRemoveRelationship = (index: number) => {
    setRelationships(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        spouseId: formData.spouseId ? parseInt(formData.spouseId) : null,
        fatherId: formData.fatherId ? parseInt(formData.fatherId) : null,
        motherId: formData.motherId ? parseInt(formData.motherId) : null,
        relationships: relationships.filter(rel => rel.toId && rel.toId !== '').map(rel => ({
          ...rel,
          toId: parseInt(rel.toId)
        }))
      }

      const url = stakeholder
        ? `/api/stakeholders/${stakeholder.id}`
        : '/api/stakeholders'

      const method = stakeholder ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save stakeholder')
      }
    } catch (error) {
      console.error('Error saving stakeholder:', error)
      alert('Failed to save stakeholder')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">
            {stakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Family Relationships */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Family Relationships
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spouse
                  </label>
                  <select
                    name="spouseId"
                    value={formData.spouseId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Spouse</option>
                    {stakeholders
                      .filter(s => s.id !== stakeholder?.id && !s.spouse)
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father
                  </label>
                  <select
                    name="fatherId"
                    value={formData.fatherId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Father</option>
                    {stakeholders
                      .filter(s => s.id !== stakeholder?.id && s.gender === 'MALE')
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mother
                  </label>
                  <select
                    name="motherId"
                    value={formData.motherId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Mother</option>
                    {stakeholders
                      .filter(s => s.id !== stakeholder?.id && s.gender === 'FEMALE')
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employer
                  </label>
                  <input
                    type="text"
                    name="employer"
                    value={formData.employer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Relationships */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Additional Relationships
                </h3>
                <Button
                  type="button"
                  onClick={handleAddRelationship}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Relationship
                </Button>
              </div>

              <div className="space-y-4">
                {relationships.map((rel, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <select
                        value={rel.toId}
                        onChange={(e) => handleRelationshipChange(index, 'toId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Person</option>
                        {stakeholders
                          .filter(s => s.id !== stakeholder?.id)
                          .map(s => (
                            <option key={s.id} value={s.id}>
                              {s.firstName} {s.lastName}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        value={rel.relationshipType}
                        onChange={(e) => handleRelationshipChange(index, 'relationshipType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="FRIEND">Friend</option>
                        <option value="SIBLING">Sibling</option>
                        <option value="COLLEAGUE">Colleague</option>
                        <option value="BUSINESS_PARTNER">Business Partner</option>
                        <option value="NEIGHBOR">Neighbor</option>
                        <option value="RELATIVE">Relative</option>
                      </select>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveRelationship(index)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes about this stakeholder..."
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Saving...' : stakeholder ? 'Update Stakeholder' : 'Create Stakeholder'}
          </Button>
        </div>
      </div>
    </div>
  )
}