'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Users, Network, Search, Filter } from 'lucide-react'
import StakeholderForm from '@/components/StakeholderForm'
import StakeholderGraph from '@/components/StakeholderGraph'
import StakeholderList from '@/components/StakeholderList'

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
  father?: {
    id: number
    firstName: string
    lastName: string
  }
  mother?: {
    id: number
    firstName: string
    lastName: string
  }
  childrenAsFather?: Stakeholder[]
  childrenAsMother?: Stakeholder[]
  relationships?: any[]
  relatedTo?: any[]
}

export default function StakeholdersPage() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null)
  const [view, setView] = useState<'list' | 'graph'>('list')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStakeholders = async () => {
    try {
      const response = await fetch('/api/stakeholders')
      if (response.ok) {
        const data = await response.json()
        setStakeholders(data)
      }
    } catch (error) {
      console.error('Error fetching stakeholders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStakeholders()
  }, [])

  const handleCreateStakeholder = () => {
    setSelectedStakeholder(null)
    setIsFormOpen(true)
  }

  const handleEditStakeholder = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedStakeholder(null)
    fetchStakeholders()
  }

  const filteredStakeholders = stakeholders.filter(stakeholder =>
    stakeholder.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stakeholder.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stakeholder.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (stakeholder.occupation?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stakeholder Management</h1>
          <p className="text-gray-600 mt-2">
            Manage stakeholders and their relationships
          </p>
        </div>
        <Button
          onClick={handleCreateStakeholder}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Stakeholder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stakeholders</p>
              <p className="text-2xl font-semibold text-gray-900">{stakeholders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Network className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Relationships</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stakeholders.reduce((count, s) =>
                  count + (s.relationships?.length || 0) + (s.relatedTo?.length || 0), 0
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Married Couples</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stakeholders.filter(s => s.spouse).length / 2}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search stakeholders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
            className="px-4 py-2"
          >
            <Users className="w-4 h-4 mr-2" />
            List View
          </Button>
          <Button
            variant={view === 'graph' ? 'default' : 'outline'}
            onClick={() => setView('graph')}
            className="px-4 py-2"
          >
            <Network className="w-4 h-4 mr-2" />
            Graph View
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {view === 'list' ? (
          <StakeholderList
            stakeholders={filteredStakeholders}
            onEdit={handleEditStakeholder}
            onRefresh={fetchStakeholders}
          />
        ) : (
          <StakeholderGraph
            stakeholders={filteredStakeholders}
            onSelectStakeholder={handleEditStakeholder}
          />
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <StakeholderForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          stakeholder={selectedStakeholder}
          stakeholders={stakeholders}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}