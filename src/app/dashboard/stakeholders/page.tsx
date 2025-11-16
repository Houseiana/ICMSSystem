'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PersonPreviewModal from '@/components/PersonPreviewModal'
import StakeholderForm from '@/components/StakeholderForm'
import ConfirmModal from '@/components/ConfirmModal'
import { Eye, Edit, Trash2 } from 'lucide-react'

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
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    stakeholderId?: number
  }>({
    isOpen: false
  })
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean
    personId?: number
  }>({
    isOpen: false
  })

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

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder)
    setShowForm(true)
  }

  const handleDeleteClick = (stakeholderId: number) => {
    setDeleteModal({ isOpen: true, stakeholderId })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.stakeholderId) return

    try {
      const response = await fetch(`/api/stakeholders/${deleteModal.stakeholderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchStakeholders()
        setDeleteModal({ isOpen: false })
        alert('Stakeholder deleted successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete stakeholder')
      }
    } catch (error) {
      console.error('Error deleting stakeholder:', error)
      alert('Network error while deleting stakeholder')
    }
  }

  const handleFormSuccess = async () => {
    await fetchStakeholders()
    setShowForm(false)
    setEditingStakeholder(null)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingStakeholder(null)
  }

  const createSampleStakeholders = async () => {
    try {
      // Create John Smith - Father
      const john = await fetch('/api/stakeholders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '+1-555-0101',
          gender: 'MALE',
          occupation: 'Software Engineer',
          dateOfBirth: '1980-05-15'
        })
      })
      const johnData = await john.json()

      // Create Mary Smith - Mother
      const mary = await fetch('/api/stakeholders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Mary',
          lastName: 'Smith',
          email: 'mary.smith@email.com',
          phone: '+1-555-0102',
          gender: 'FEMALE',
          occupation: 'Teacher',
          dateOfBirth: '1982-08-22',
          spouseId: johnData.id
        })
      })
      const maryData = await mary.json()

      // Update John to be married to Mary
      await fetch(`/api/stakeholders/${johnData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...johnData,
          spouseId: maryData.id
        })
      })

      // Create Tommy Smith - Son
      await fetch('/api/stakeholders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Tommy',
          lastName: 'Smith',
          email: 'tommy.smith@email.com',
          phone: '+1-555-0103',
          gender: 'MALE',
          occupation: 'Student',
          dateOfBirth: '2010-03-10',
          fatherId: johnData.id,
          motherId: maryData.id
        })
      })

      alert('Sample stakeholder family created successfully!')
      fetchStakeholders()
    } catch (error) {
      console.error('Error creating sample stakeholders:', error)
      alert('Error creating sample stakeholders')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stakeholder Management</h1>
            <p className="text-gray-600 mt-2">
              Manage stakeholders and their relationships
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setEditingStakeholder(null)
                setShowForm(!showForm)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <span className="mr-2">➕</span>
              Add Stakeholder
            </button>
            <button
              onClick={createSampleStakeholders}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <span className="mr-2">👪</span>
              Create Sample Family
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <span className="text-4xl text-blue-600">👥</span>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stakeholders</p>
                <p className="text-2xl font-semibold text-gray-900">{stakeholders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <span className="text-4xl text-green-600">🔗</span>
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
              <span className="text-4xl text-purple-600">💕</span>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Married Couples</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.floor(stakeholders.filter(s => s.spouse).length / 2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search stakeholders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>


        {/* Stakeholder List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stakeholders ({stakeholders.length})</h3>

            {stakeholders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stakeholders yet</h3>
                <p className="text-gray-500 mb-4">
                  Add stakeholders to see them here or create a sample family to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stakeholders
                  .filter(s =>
                    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (s.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (s.occupation?.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((stakeholder) => (
                    <div key={stakeholder.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {stakeholder.firstName} {stakeholder.lastName}
                            {stakeholder.preferredName && ` (${stakeholder.preferredName})`}
                          </h4>
                          <div className="mt-1 space-y-1">
                            {stakeholder.email && (
                              <p className="text-sm text-gray-600">📧 {stakeholder.email}</p>
                            )}
                            {stakeholder.phone && (
                              <p className="text-sm text-gray-600">📱 {stakeholder.phone}</p>
                            )}
                            {stakeholder.occupation && (
                              <p className="text-sm text-gray-600">💼 {stakeholder.occupation}</p>
                            )}
                          </div>

                          {/* Relationships */}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {stakeholder.spouse && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                💕 Married to {stakeholder.spouse.firstName} {stakeholder.spouse.lastName}
                              </span>
                            )}
                            {stakeholder.father && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                👨 Father: {stakeholder.father.firstName} {stakeholder.father.lastName}
                              </span>
                            )}
                            {stakeholder.mother && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                👩 Mother: {stakeholder.mother.firstName} {stakeholder.mother.lastName}
                              </span>
                            )}
                            {(stakeholder.childrenAsFather?.length || 0) + (stakeholder.childrenAsMother?.length || 0) > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                👶 {(stakeholder.childrenAsFather?.length || 0) + (stakeholder.childrenAsMother?.length || 0)} Children
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setPreviewModal({ isOpen: true, personId: stakeholder.id })}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Preview Stakeholder"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(stakeholder)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Stakeholder"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(stakeholder.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Stakeholder"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            stakeholder.gender === 'MALE' ? 'bg-blue-100 text-blue-800' :
                            stakeholder.gender === 'FEMALE' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {stakeholder.gender === 'MALE' ? '👨' : stakeholder.gender === 'FEMALE' ? '👩' : '👤'}
                            {stakeholder.gender || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        <PersonPreviewModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal({ isOpen: false })}
          personId={previewModal.personId}
          personType="STAKEHOLDER"
        />

        {/* Stakeholder Form Modal */}
        <StakeholderForm
          isOpen={showForm}
          onClose={handleFormClose}
          stakeholder={editingStakeholder}
          stakeholders={stakeholders}
          onSuccess={handleFormSuccess}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={handleDeleteConfirm}
          title="Delete Stakeholder"
          message="Are you sure you want to delete this stakeholder? This action cannot be undone and will remove all associated relationships."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  )
}