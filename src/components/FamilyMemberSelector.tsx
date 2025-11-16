import React, { useState, useEffect, useCallback } from 'react'

interface Stakeholder {
  id: number
  firstName: string
  middleName?: string | null
  lastName: string
  email?: string | null
  phone?: string | null
  dateOfBirth?: string | null
  placeOfBirth?: string | null
  gender?: string | null
  nationality?: string | null
  occupation?: string | null
  employer?: string | null
  address?: string | null
  nationalId?: string | null
  passportNumber?: string | null
  qidNumber?: string | null
  bloodGroup?: string | null
  medicalConditions?: string | null
  allergies?: string | null
  fullName: string
  displayInfo: string
}

interface FamilyMemberData {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  occupation: string
  phone: string
  nationalId: string
}

interface Props {
  title: string
  memberType: 'father' | 'mother' | 'spouse'
  data: FamilyMemberData
  disabled?: boolean
  onDataChange: (data: FamilyMemberData, stakeholderId?: number) => void
  additionalFields?: React.ReactNode
}

export const FamilyMemberSelector: React.FC<Props> = ({
  title,
  memberType,
  data,
  disabled = false,
  onDataChange,
  additionalFields
}) => {
  const [selectionMode, setSelectionMode] = useState<'manual' | 'stakeholder'>('manual')
  const [searchTerm, setSearchTerm] = useState('')
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Debounced search function
  const searchStakeholders = useCallback(async (term: string) => {
    if (term.length < 2) {
      setStakeholders([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/stakeholders/search?q=${encodeURIComponent(term)}&limit=10`)
      const result = await response.json()
      setStakeholders(result.stakeholders || [])
      setShowDropdown(true)
    } catch (error) {
      console.error('Error searching stakeholders:', error)
      setStakeholders([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectionMode === 'stakeholder' && searchTerm) {
        searchStakeholders(searchTerm)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, selectionMode, searchStakeholders])

  const handleStakeholderSelect = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder)
    setSearchTerm(stakeholder.fullName)
    setShowDropdown(false)

    // Auto-fill form data from stakeholder
    const newData: FamilyMemberData = {
      firstName: stakeholder.firstName,
      middleName: stakeholder.middleName || '',
      lastName: stakeholder.lastName,
      dateOfBirth: stakeholder.dateOfBirth ? stakeholder.dateOfBirth.split('T')[0] : '',
      placeOfBirth: stakeholder.placeOfBirth || '',
      nationality: stakeholder.nationality || '',
      occupation: stakeholder.occupation || '',
      phone: stakeholder.phone || '',
      nationalId: stakeholder.nationalId || ''
    }

    onDataChange(newData, stakeholder.id)
  }

  const handleModeChange = (mode: 'manual' | 'stakeholder') => {
    setSelectionMode(mode)
    if (mode === 'manual') {
      setSelectedStakeholder(null)
      setSearchTerm('')
      setStakeholders([])
      setShowDropdown(false)
    }
  }

  const handleFieldChange = (field: keyof FamilyMemberData, value: string) => {
    const newData = { ...data, [field]: value }
    onDataChange(newData)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium text-gray-900">{title}</h4>

        {!disabled && (
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleModeChange('manual')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectionMode === 'manual'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enter Manually
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('stakeholder')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectionMode === 'stakeholder'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Select from Stakeholders
            </button>
          </div>
        )}
      </div>

      {/* Stakeholder Search */}
      {selectionMode === 'stakeholder' && !disabled && (
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Stakeholder
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => stakeholders.length > 0 && setShowDropdown(true)}
              placeholder="Search by name, email, phone, or ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && stakeholders.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {stakeholders.map((stakeholder) => (
                <button
                  key={stakeholder.id}
                  type="button"
                  onClick={() => handleStakeholderSelect(stakeholder)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                >
                  <div className="font-medium text-gray-900">{stakeholder.fullName}</div>
                  <div className="text-sm text-gray-600">{stakeholder.displayInfo}</div>
                </button>
              ))}
            </div>
          )}

          {selectedStakeholder && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">
                  Selected: {selectedStakeholder.fullName}
                </p>
                <p className="text-xs text-green-700">
                  {selectedStakeholder.email || selectedStakeholder.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedStakeholder(null)
                  setSearchTerm('')
                }}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
          <input
            type="text"
            value={data.middleName}
            onChange={(e) => handleFieldChange('middleName', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
          <input
            type="text"
            value={data.nationality}
            onChange={(e) => handleFieldChange('nationality', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
          <input
            type="text"
            value={data.placeOfBirth}
            onChange={(e) => handleFieldChange('placeOfBirth', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            placeholder="City, Country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
          <input
            type="text"
            value={data.occupation}
            onChange={(e) => handleFieldChange('occupation', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
          <input
            type="text"
            value={data.nationalId}
            onChange={(e) => handleFieldChange('nationalId', e.target.value)}
            disabled={disabled || (selectionMode === 'stakeholder' && !!selectedStakeholder)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* Additional fields (like Date of Marriage for spouse) */}
      {additionalFields}
    </div>
  )
}
