'use client'

import { useState, useEffect } from 'react'

interface Employer {
  id: number
  employerType: string
  displayName: string
  description: string
}

interface EmployeeFormProps {
  onSubmit: (employeeData: any) => void
  loading?: boolean
}

export default function EmployeeForm({ onSubmit, loading }: EmployeeFormProps) {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [loadingEmployers, setLoadingEmployers] = useState(false)

  const [formData, setFormData] = useState({
    empId: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    employerId: '',
    hireDate: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    salary: '',
    status: 'Active'
  })

  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      setLoadingEmployers(true)
      const response = await fetch('/api/employers/list')
      if (response.ok) {
        const data = await response.json()
        setEmployers(data.employers || [])
      }
    } catch (error) {
      console.error('Error fetching employers:', error)
    } finally {
      setLoadingEmployers(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      employerId: formData.employerId ? parseInt(formData.employerId) : null
    }
    onSubmit(submitData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const departments = [
    'Human Resources',
    'Information Technology',
    'Finance',
    'Marketing',
    'Operations',
    'Sales',
    'Customer Service',
    'Research & Development'
  ]

  const positions = [
    'Manager',
    'Senior Developer',
    'Developer',
    'Analyst',
    'Coordinator',
    'Specialist',
    'Assistant',
    'Director',
    'Executive',
    'Intern'
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">➕ Add New Employee</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Required Information Section */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
            ⚠️ Required Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="EMP001"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* 🏢 EMPLOYER FIELD - SELECT COMPANY/PERSON */}
            <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
              <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center">
                🏢 Select Employee's Employer *
              </label>
              <select
                name="employerId"
                value={formData.employerId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-medium"
              >
                <option value="">🏢 Choose Employer (Company or Individual)</option>
                {loadingEmployers ? (
                  <option value="" disabled>⏳ Loading employers...</option>
                ) : (
                  employers.map(employer => (
                    <option key={employer.id} value={employer.id}>
                      {employer.employerType === 'COMPANY' ? '🏢' : '👤'} {employer.displayName} - {employer.description}
                    </option>
                  ))
                )}
              </select>
              {employers.length === 0 && !loadingEmployers && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ No employers found! Please add employers first:
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Go to Dashboard → Employers → Add New Employer
                  </p>
                </div>
              )}
              {employers.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  ℹ️ Found {employers.length} employer(s) available for selection
                </p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Position</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            {/* Hire Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hire Date *
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Optional Information Section */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
            👤 Additional Information (Optional)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Phone
              </label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Adding Employee...' : '✅ Add Employee'}
          </button>
        </div>
      </form>
    </div>
  )
}