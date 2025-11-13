'use client'

import { useState } from 'react'
import UnifiedEmployeeForm from '@/components/UnifiedEmployeeForm'

// Example of how to use the UnifiedEmployeeForm component anywhere in your project
export default function QuickEmployeeAdd() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSaveEmployee = async (employeeData: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      })

      if (response.ok) {
        alert('Employee created successfully!')
        setIsFormOpen(false)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create employee')
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* This button can be anywhere in your application */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        Quick Add Employee
      </button>

      {/* The unified form - same component used everywhere */}
      <UnifiedEmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode="create"
        onSave={handleSaveEmployee}
        loading={loading}
        title="Quick Add Employee"
        size="large" // You can choose: 'small', 'medium', 'large', 'full'
      />
    </div>
  )
}

// Example usage in any component:
/*
import QuickEmployeeAdd from '@/components/examples/QuickEmployeeAdd'

function MyComponent() {
  return (
    <div>
      <h1>My Component</h1>
      <QuickEmployeeAdd />
    </div>
  )
}
*/