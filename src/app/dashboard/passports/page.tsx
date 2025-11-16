'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PassportTable from '@/components/PassportTable'
import PassportForm from '@/components/PassportForm'
import ConfirmModal from '@/components/ConfirmModal'

export default function PassportsPage() {
  const [passports, setPassports] = useState<any[]>([])
  const [entities, setEntities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [entitiesLoading, setEntitiesLoading] = useState(true)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'view' | 'edit' | 'create'
    passport?: any
  }>({
    isOpen: false,
    mode: 'create'
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    passport?: any
  }>({
    isOpen: false
  })
  const [selectedEntityType, setSelectedEntityType] = useState<string>('ALL')

  const fetchPassports = async () => {
    try {
      const response = await fetch('/api/passports')
      if (response.ok) {
        const data = await response.json()
        setPassports(data)
      } else {
        console.error('Failed to fetch passports')
      }
    } catch (error) {
      console.error('Error fetching passports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEntities = async () => {
    try {
      setEntitiesLoading(true)
      const response = await fetch(`/api/passports/entities?type=${selectedEntityType}`)
      if (response.ok) {
        const data = await response.json()
        setEntities(data.entities)
      } else {
        console.error('Failed to fetch entities')
      }
    } catch (error) {
      console.error('Error fetching entities:', error)
    } finally {
      setEntitiesLoading(false)
    }
  }

  const handleCreatePassport = async (passportData: any) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/passports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...passportData,
          createdBy: 'Admin User' // This should come from auth context
        })
      })

      if (response.ok) {
        await fetchPassports()
        await fetchEntities() // Refresh entities to update passport counts
        setModalState({ isOpen: false, mode: 'create' })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create passport')
      }
    } catch (error) {
      console.error('Error creating passport:', error)
      alert('Network error. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdatePassport = async (passportData: any) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/passports/${modalState.passport.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...passportData,
          lastModifiedBy: 'Admin User' // This should come from auth context
        })
      })

      if (response.ok) {
        await fetchPassports()
        setModalState({ isOpen: false, mode: 'create' })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update passport')
      }
    } catch (error) {
      console.error('Error updating passport:', error)
      alert('Network error. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeletePassport = (passport: any) => {
    setConfirmModal({
      isOpen: true,
      passport
    })
  }

  const confirmDeletePassport = async () => {
    if (!confirmModal.passport) return

    try {
      const response = await fetch(`/api/passports/${confirmModal.passport.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPassports()
        await fetchEntities() // Refresh entities to update passport counts
        setConfirmModal({ isOpen: false })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete passport')
      }
    } catch (error) {
      console.error('Error deleting passport:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleViewPassport = (passport: any) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      passport
    })
  }

  const handleEditPassport = (passport: any) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      passport
    })
  }

  const handleModalSave = (data: any) => {
    if (modalState.mode === 'create') {
      handleCreatePassport(data)
    } else if (modalState.mode === 'edit') {
      handleUpdatePassport(data)
    }
  }

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create' })
  }

  useEffect(() => {
    fetchPassports()
  }, [])

  useEffect(() => {
    fetchEntities()
  }, [selectedEntityType])

  // Show all entities for passport form (entities can have multiple passports)
  const availableEntities = entities

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Passport Management</h1>
            <p className="text-gray-600 mt-1">Track passports and their locations</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setModalState({ isOpen: true, mode: 'create' })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Passport
            </button>
          </div>
        </div>

        {/* Entity Type Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Filter by Entity Type</h3>
              <p className="text-sm text-gray-500">Select the type of entity to view</p>
            </div>
            <div className="flex gap-2">
              {['ALL', 'EMPLOYEE', 'EMPLOYER', 'STAKEHOLDER'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedEntityType(type)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedEntityType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'ALL' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase() + 's'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📘</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Passports</p>
                <p className="text-2xl font-semibold text-gray-900">{passports.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {passports.filter(p => p.status === 'ACTIVE' && p.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⚠️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {passports.filter(p => {
                    const expiryDate = new Date(p.expiryDate)
                    const sixMonthsFromNow = new Date()
                    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
                    return expiryDate <= sixMonthsFromNow && p.isActive
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">🏢</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">At Office</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {passports.filter(p => p.currentLocation === 'AT_OFFICE').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Passport Table */}
        <PassportTable
          passports={passports}
          loading={loading}
          onView={handleViewPassport}
          onEdit={handleEditPassport}
          onDelete={handleDeletePassport}
        />

        {/* Passport Modal */}
        <PassportForm
          isOpen={modalState.isOpen}
          onClose={closeModal}
          passport={modalState.passport}
          mode={modalState.mode}
          onSave={handleModalSave}
          loading={actionLoading}
          entities={availableEntities}
          entitiesLoading={entitiesLoading}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false })}
          onConfirm={confirmDeletePassport}
          title="Delete Passport"
          message={`Are you sure you want to delete the passport for ${confirmModal.passport?.ownerName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  )
}