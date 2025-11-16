'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import StatsCard from '@/components/StatsCard'
import EmployeeForm from '@/components/EmployeeForm'
import EmployeeList from '@/components/EmployeeList'
import { Employee } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [creatingEmployee, setCreatingEmployee] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newHires: 0,
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

        // Fix date calculation - create separate date objects to avoid mutation
        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const newHires = data.filter((emp: any) => {
          const createdDate = new Date(emp.createdAt || emp.hireDate)
          return createdDate >= lastMonth
        }).length

        const totalSalary = data.reduce((sum: number, emp: any) => sum + (parseFloat(emp.salary) || 0), 0)
        const avgSalary = data.length > 0 ? Math.round(totalSalary / data.length) : 0

        setStats({
          total: data.length,
          active,
          newHires,
          avgSalary
        })
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const activities: any[] = []

      // Get recent employees
      const employeeResponse = await fetch('/api/employees')
      if (employeeResponse.ok) {
        const employees = await employeeResponse.json()
        const recentEmployees = employees
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2)

        recentEmployees.forEach((emp: any) => {
          activities.push({
            id: `emp-${emp.id}`,
            type: 'employee',
            title: 'New employee onboarded',
            description: `${emp.firstName} ${emp.lastName} joined ${emp.department || 'the company'}`,
            time: new Date(emp.createdAt),
            color: 'green'
          })
        })
      }

      // Get recent passports
      try {
        const passportResponse = await fetch('/api/passports')
        if (passportResponse.ok) {
          const passports = await passportResponse.json()
          const recentPassports = passports
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 1)

          recentPassports.forEach((passport: any) => {
            activities.push({
              id: `passport-${passport.id}`,
              type: 'passport',
              title: 'New passport registered',
              description: `${passport.ownerName} passport (${passport.passportNumber}) added`,
              time: new Date(passport.createdAt),
              color: 'blue'
            })
          })
        }
      } catch (error) {
        console.log('Passports API not available')
      }

      // Sort all activities by time
      const sortedActivities = activities
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, 3)

      setRecentActivities(sortedActivities)
    } catch (error) {
      console.error('Error fetching activities:', error)
      setRecentActivities([])
    }
  }

  const handleNavigateToContractors = () => {
    router.push('/dashboard/contractors')
  }

  const handleNavigateToSettings = () => {
    router.push('/dashboard/settings')
  }

  const handleViewReports = () => {
    router.push('/dashboard/reports')
  }

  const handleViewAllActivities = () => {
    router.push('/dashboard/activity')
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
        fetchRecentActivities() // Refresh activities
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
    fetchRecentActivities()
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            title="New Hires"
            value={stats.newHires}
            icon="🆕"
            trend={{ value: 12, isPositive: true }}
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

            <button
              onClick={handleViewReports}
              className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
            >
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <p className="font-medium text-purple-900">View Reports</p>
                <p className="text-sm text-purple-600">Analytics & insights</p>
              </div>
            </button>

            <button
              onClick={handleNavigateToContractors}
              className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
            >
              <span className="text-2xl">🤝🏢</span>
              <div className="text-left">
                <p className="font-medium text-green-900">Manage Contractors</p>
                <p className="text-sm text-green-600">Service providers</p>
              </div>
            </button>

            <button
              onClick={handleNavigateToSettings}
              className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            >
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
            <button
              onClick={handleViewAllActivities}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.time).toLocaleDateString()} {new Date(activity.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No recent activity to display</p>
                <p className="text-xs text-gray-400 mt-1">Activities will appear here as you use the system</p>
              </div>
            )}
          </div>
        </div>

        {/* Employee List */}
        <EmployeeList employees={employees} loading={loadingEmployees} />
      </div>
    </DashboardLayout>
  )
}