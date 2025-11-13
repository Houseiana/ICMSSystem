'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import EmployeeTable from '@/components/EmployeeTable'
import UnifiedEmployeeForm from '@/components/UnifiedEmployeeForm'
import ConfirmModal from '@/components/ConfirmModal'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'view' | 'edit' | 'create'
    employee?: any
  }>({
    isOpen: false,
    mode: 'create'
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    employee?: any
  }>({
    isOpen: false
  })

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      } else {
        console.error('Failed to fetch employees')
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmployee = async (employeeData: any) => {
    setActionLoading(true)
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      })

      if (response.ok) {
        await fetchEmployees()
        setModalState({ isOpen: false, mode: 'create' })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create employee')
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Network error. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateEmployee = async (employeeData: any) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/employees/${modalState.employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      })

      if (response.ok) {
        await fetchEmployees()
        setModalState({ isOpen: false, mode: 'create' })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update employee')
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      alert('Network error. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteEmployee = (employee: any) => {
    setConfirmModal({
      isOpen: true,
      employee
    })
  }

  const confirmDeleteEmployee = async () => {
    if (!confirmModal.employee) return

    try {
      const response = await fetch(`/api/employees/${confirmModal.employee.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchEmployees()
        setConfirmModal({ isOpen: false })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete employee')
      }
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleViewEmployee = (employee: any) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      employee
    })
  }

  const handleEditEmployee = (employee: any) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      employee
    })
  }

  const handleModalSave = (data: any) => {
    if (modalState.mode === 'create') {
      handleCreateEmployee(data)
    } else if (modalState.mode === 'edit') {
      handleUpdateEmployee(data)
    }
  }

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create' })
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-1">Manage your organization's workforce</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setModalState({ isOpen: true, mode: 'create' })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
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
                  {employees.filter(emp => emp.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">🏖️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">On Leave</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {employees.filter(emp => emp.status === 'ON_LEAVE').length}
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
                <p className="text-sm font-medium text-gray-500">Departments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(employees.map(emp => emp.department?.name).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          onView={handleViewEmployee}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />

        {/* Employee Modal */}
        <UnifiedEmployeeForm
          isOpen={modalState.isOpen}
          onClose={closeModal}
          employee={modalState.employee}
          mode={modalState.mode}
          onSave={handleModalSave}
          loading={actionLoading}
          size="full"
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false })}
          onConfirm={confirmDeleteEmployee}
          title="Delete Employee"
          message={`Are you sure you want to delete ${confirmModal.employee?.firstName} ${confirmModal.employee?.lastName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  )
}