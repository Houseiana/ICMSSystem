'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import StatsCard from '@/components/StatsCard'
import EmployeeForm from '@/components/EmployeeForm'
import EmployeeList from '@/components/EmployeeList'
import { Employee } from '@/types'

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [creatingEmployee, setCreatingEmployee] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    newHires: 0,
    departments: 0,
    avgSalary: 0
  })

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)

        // Calculate enhanced stats
        const active = data.filter((emp: any) => emp.status === 'ACTIVE').length
        const onLeave = data.filter((emp: any) => emp.status === 'ON_LEAVE').length
        const thisMonth = new Date()
        const lastMonth = new Date(thisMonth.setMonth(thisMonth.getMonth() - 1))
        const newHires = data.filter((emp: any) =>
          new Date(emp.createdAt) >= lastMonth
        ).length
        const departments = new Set(data.map((emp: any) => emp.department?.name || 'Unknown')).size
        const totalSalary = data.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0)
        const avgSalary = data.length > 0 ? Math.round(totalSalary / data.length) : 0

        setStats({
          total: data.length,
          active,
          onLeave,
          newHires,
          departments,
          avgSalary
        })
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  const handleCreateEmployee = async (employeeData: any) => {
    setCreatingEmployee(true)
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      })

      if (response.ok) {
        const newEmployee = await response.json()
        setEmployees(prev => [newEmployee, ...prev])
        setShowForm(false)
        fetchEmployees() // Refresh stats
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create employee')
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Network error. Please try again.')
    } finally {
      setCreatingEmployee(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin</h1>
          <p className="text-gray-600">Here's what's happening with your team today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatsCard
            title="Total Employees"
            value={stats.total}
            icon="👥"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon="✅"
            bgColor="bg-gradient-to-r from-green-50 to-green-100"
            textColor="text-green-700"
          />
          <StatsCard
            title="On Leave"
            value={stats.onLeave}
            icon="🏖️"
            bgColor="bg-gradient-to-r from-yellow-50 to-yellow-100"
            textColor="text-yellow-700"
          />
          <StatsCard
            title="New Hires"
            value={stats.newHires}
            icon="🆕"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Departments"
            value={stats.departments}
            icon="🏢"
          />
          <StatsCard
            title="Avg. Salary"
            value={`$${stats.avgSalary.toLocaleString()}`}
            icon="💰"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <span className="text-2xl">➕</span>
              <div className="text-left">
                <p className="font-medium text-blue-900">Add Employee</p>
                <p className="text-sm text-blue-600">Create new record</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <p className="font-medium text-purple-900">View Reports</p>
                <p className="text-sm text-purple-600">Analytics & insights</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
              <span className="text-2xl">💰</span>
              <div className="text-left">
                <p className="font-medium text-green-900">Process Payroll</p>
                <p className="text-sm text-green-600">Monthly payments</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200">
              <span className="text-2xl">⚙️</span>
              <div className="text-left">
                <p className="font-medium text-orange-900">Settings</p>
                <p className="text-sm text-orange-600">Configure system</p>
              </div>
            </button>
          </div>
        </div>

        {/* Employee Form */}
        {showForm && (
          <div className="animate-fade-in">
            <EmployeeForm onSubmit={handleCreateEmployee} loading={creatingEmployee} />
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New employee onboarded</p>
                <p className="text-xs text-gray-500">John Smith joined the Development team</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Leave request submitted</p>
                <p className="text-xs text-gray-500">Sarah Johnson requested vacation leave</p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Department update</p>
                <p className="text-xs text-gray-500">IT department structure modified</p>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <EmployeeList employees={employees} loading={loadingEmployees} />
      </div>
    </DashboardLayout>
  )
}