'use client'

import React, { useState, useEffect } from 'react'
import { X, Search, User, Building2, Users, Briefcase } from 'lucide-react'

interface Person {
  id: number
  fullName: string
  email: string | null
  phone: string | null
  nationality: string | null
  type: 'EMPLOYEE' | 'EMPLOYER' | 'STAKEHOLDER' | 'TASK_HELPER'
}

interface PersonSelectorDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (person: Person) => void
}

export default function PersonSelectorDialog({
  isOpen,
  onClose,
  onSelect
}: PersonSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'EMPLOYEE' | 'EMPLOYER' | 'STAKEHOLDER' | 'TASK_HELPER'>('EMPLOYEE')
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'EMPLOYEE' as const, label: 'Employees', icon: User },
    { id: 'EMPLOYER' as const, label: 'Employers', icon: Building2 },
    { id: 'STAKEHOLDER' as const, label: 'Stakeholders', icon: Users },
    { id: 'TASK_HELPER' as const, label: 'Task Helpers', icon: Briefcase }
  ]

  useEffect(() => {
    if (isOpen) {
      if (searchTerm.length >= 2) {
        searchPersons()
      } else if (searchTerm.length === 0) {
        // Load all persons when no search term is entered
        loadAllPersons()
      } else {
        setPersons([])
      }
    }
  }, [searchTerm, activeTab, isOpen])

  const loadAllPersons = async () => {
    setLoading(true)
    try {
      let endpoint = ''
      switch (activeTab) {
        case 'EMPLOYEE':
          endpoint = '/api/employees'
          break
        case 'EMPLOYER':
          endpoint = '/api/employers'
          break
        case 'STAKEHOLDER':
          endpoint = '/api/stakeholders'
          break
        case 'TASK_HELPER':
          endpoint = '/api/task-helpers'
          break
      }

      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()

        // Transform the data to match Person interface
        const transformedData = data.map((item: any) => {
          let fullName = ''
          let email = null
          let phone = null

          if (activeTab === 'EMPLOYEE') {
            fullName = item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim()
            email = item.email
            phone = item.phone
          } else if (activeTab === 'EMPLOYER') {
            fullName = item.companyName || item.fullName || 'Unknown'
            email = item.primaryEmail || item.secondaryEmail
            phone = item.mainPhone || item.alternatePhone
          } else if (activeTab === 'STAKEHOLDER') {
            fullName = `${item.firstName || ''}${item.middleName ? ' ' + item.middleName : ''} ${item.lastName || ''}`.trim()
            email = item.email
            phone = item.phone
          } else if (activeTab === 'TASK_HELPER') {
            fullName = item.fullName || 'Unknown'
            email = item.primaryEmail
            phone = item.primaryPhone
          }

          return {
            id: item.id,
            fullName,
            email,
            phone,
            nationality: item.nationality,
            type: activeTab
          }
        })

        setPersons(transformedData)
      }
    } catch (error) {
      console.error('Error loading persons:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchPersons = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/persons/search?q=${encodeURIComponent(searchTerm)}&type=${activeTab}`
      )

      if (response.ok) {
        const data = await response.json()
        setPersons(data.data || [])
      }
    } catch (error) {
      console.error('Error searching persons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (person: Person) => {
    onSelect(person)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Select Person</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Box */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone (optional)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {searchTerm.length === 0
              ? 'Showing all records. Type to search for specific persons.'
              : searchTerm.length === 1
              ? 'Enter at least 2 characters to search'
              : `Searching for "${searchTerm}"...`
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : persons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User size={48} className="mx-auto mb-2 opacity-50" />
              <p>
                {searchTerm.length >= 2
                  ? `No persons found matching "${searchTerm}"`
                  : 'No records available'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {persons.map((person) => (
                <button
                  key={`${person.type}-${person.id}`}
                  onClick={() => handleSelect(person)}
                  className="w-full p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {person.fullName}
                      </h3>
                      <div className="mt-1 space-y-1">
                        {person.email && (
                          <p className="text-sm text-gray-600">
                            Email: {person.email}
                          </p>
                        )}
                        {person.phone && (
                          <p className="text-sm text-gray-600">
                            Phone: {person.phone}
                          </p>
                        )}
                        {person.nationality && (
                          <p className="text-sm text-gray-600">
                            Nationality: {person.nationality}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {person.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
