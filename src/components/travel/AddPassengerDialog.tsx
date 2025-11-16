'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Search } from 'lucide-react'
import { PersonType, NotificationPreference } from '@/types/travel'

interface AddPassengerDialogProps {
  travelRequestId: number
  onClose: () => void
  onSuccess: () => void
}

interface PersonOption {
  id: number
  type: PersonType
  fullName: string
  email?: string
  phone?: string
}

export function AddPassengerDialog({
  travelRequestId,
  onClose,
  onSuccess,
}: AddPassengerDialogProps) {
  const [selectedPersonType, setSelectedPersonType] = useState<PersonType>('EMPLOYEE')
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null)
  const [persons, setPersons] = useState<PersonOption[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingPersons, setFetchingPersons] = useState(false)
  const [isMainPassenger, setIsMainPassenger] = useState(false)
  const [notificationPreference, setNotificationPreference] = useState<NotificationPreference>('ALL')

  // Fetch persons based on selected type
  useEffect(() => {
    const fetchPersons = async () => {
      setFetchingPersons(true)
      setSelectedPersonId(null) // Reset selection when type changes
      try {
        let endpoint = ''
        switch (selectedPersonType) {
          case 'EMPLOYEE':
            endpoint = '/api/employees'
            break
          case 'STAKEHOLDER':
            endpoint = '/api/stakeholders'
            break
          case 'EMPLOYER':
            endpoint = '/api/employers'
            break
          case 'TASK_HELPER':
            endpoint = '/api/task-helpers'
            break
        }

        const response = await fetch(endpoint)
        const result = await response.json()

        // Handle different API response formats
        let dataArray: any[] = []

        if (result.success && result.data) {
          // Format: { success: true, data: [...] } - Employees, Stakeholders, Task Helpers
          dataArray = result.data
        } else if (result.employers) {
          // Format: { employers: [...], stats, industries, relationshipTypes } - Employers API
          dataArray = result.employers
        } else if (Array.isArray(result)) {
          // Format: [...] - Direct array
          dataArray = result
        }

        const mappedPersons: PersonOption[] = dataArray.map((person: any) => {
          // Handle different name formats
          let fullName = 'Unknown'

          if (selectedPersonType === 'EMPLOYER') {
            // Employers can be companies or individuals
            fullName = person.companyName || person.fullName || person.tradingName ||
                      (person.firstName && person.lastName ? `${person.firstName} ${person.lastName}` : '') ||
                      'Unknown'
          } else if (selectedPersonType === 'STAKEHOLDER') {
            // Stakeholders use firstName + lastName
            fullName = person.fullName ||
                      (person.firstName && person.lastName ? `${person.firstName} ${person.lastName}` : '') ||
                      person.firstName || person.lastName || 'Unknown'
          } else {
            // Employees and Task Helpers typically have fullName
            fullName = person.fullName || person.name ||
                      (person.firstName && person.lastName ? `${person.firstName} ${person.lastName}` : '') ||
                      'Unknown'
          }

          return {
            id: person.id,
            type: selectedPersonType,
            fullName: fullName,
            email: person.email || person.contactEmail || person.companyEmail,
            phone: person.phone || person.contactPhone || person.mobile || person.companyPhone,
          }
        })

        setPersons(mappedPersons)
      } catch (error) {
        console.error('Error fetching persons:', error)
        setPersons([])
      } finally {
        setFetchingPersons(false)
      }
    }

    fetchPersons()
  }, [selectedPersonType])

  const filteredPersons = persons.filter((person) =>
    person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async () => {
    if (!selectedPersonId) {
      alert('Please select a person')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/travel/passengers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelRequestId,
          personType: selectedPersonType,
          personId: selectedPersonId,
          isMainPassenger,
          notificationPreference,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(`Failed to add passenger: ${result.error}`)
      }
    } catch (error) {
      alert('Error adding passenger. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Passenger</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a person to add to this travel request
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
          {/* Person Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Person Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'EMPLOYEE', label: 'Employee', icon: '👤' },
                { value: 'STAKEHOLDER', label: 'Stakeholder', icon: '🤝' },
                { value: 'EMPLOYER', label: 'Employer', icon: '🏢' },
                { value: 'TASK_HELPER', label: 'Task Helper', icon: '🛠️' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPersonType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="personType"
                    value={option.value}
                    checked={selectedPersonType === option.value}
                    onChange={(e) => {
                      setSelectedPersonType(e.target.value as PersonType)
                      setSelectedPersonId(null)
                    }}
                    className="sr-only"
                  />
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Search Person <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedPersonType.toLowerCase()}s...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Person List */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Select Person <span className="text-red-500">*</span>
            </label>
            {fetchingPersons ? (
              <div className="text-center py-8 text-gray-500">
                Loading {selectedPersonType.toLowerCase()}s...
              </div>
            ) : (
              <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {filteredPersons.length > 0 ? (
                  filteredPersons.map((person) => (
                    <label
                      key={person.id}
                      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedPersonId === person.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="person"
                        value={person.id}
                        checked={selectedPersonId === person.id}
                        onChange={() => setSelectedPersonId(person.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{person.fullName}</p>
                        <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                          {person.email && <span>✉️ {person.email}</span>}
                          {person.phone && <span>📱 {person.phone}</span>}
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No {selectedPersonType.toLowerCase()}s found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            {/* Main Passenger */}
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={isMainPassenger}
                onChange={(e) => setIsMainPassenger(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-900">Main Passenger</p>
                <p className="text-xs text-gray-500">
                  This person is the primary contact for this trip
                </p>
              </div>
            </label>

            {/* Notification Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Notification Preference
              </label>
              <select
                value={notificationPreference}
                onChange={(e) => setNotificationPreference(e.target.value as NotificationPreference)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EMAIL">Email Only</option>
                <option value="WHATSAPP">WhatsApp Only</option>
                <option value="BOTH">Both Email & WhatsApp</option>
                <option value="NONE">No Notifications</option>
              </select>
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
            disabled={loading || !selectedPersonId}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Passenger</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
