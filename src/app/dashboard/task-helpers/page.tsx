'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'

interface TaskHelper {
  id: number
  firstName: string
  lastName: string
  fullName?: string
  preferredName?: string
  primaryEmail?: string
  primaryPhone?: string
  workType: string
  workLocation?: string
  jobTitle?: string
  degreeOfCooperation: string
  paymentType?: string
  hourlyRate?: number
  dailyRate?: number
  monthlyRate?: number
  currency?: string
  status: string
  overallRating?: number
  country?: string
  city?: string
  hireDate: string
}

const workTypes = [
  { value: 'INTERNAL', label: '🏢 Internal', icon: '🏢' },
  { value: 'EXTERNAL', label: '🌐 External', icon: '🌐' },
  { value: 'CONTRACT', label: '📄 Contract', icon: '📄' },
  { value: 'FREELANCE', label: '💼 Freelance', icon: '💼' }
]

const cooperationLevels = [
  { value: 'HIGH', label: 'High', color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'LOW', label: 'Low', color: 'bg-red-100 text-red-800' },
  { value: 'OCCASIONAL', label: 'Occasional', color: 'bg-gray-100 text-gray-800' }
]

const formatPhoneNumber = (value: string) => {
  return value.replace(/\D/g, '')
}

export default function TaskHelpersPage() {
  const [taskHelpers, setTaskHelpers] = useState<TaskHelper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWorkType, setSelectedWorkType] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingHelper, setEditingHelper] = useState<TaskHelper | null>(null)

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    maritalStatus: '',
    bloodGroup: '',
    nationality: '',
    religion: '',
    languages: [] as string[],

    // Contact Information
    primaryEmail: '',
    personalEmail: '',
    workEmail: '',
    primaryPhone: '',
    mobilePhone: '',
    whatsappNumber: '',
    homePhone: '',
    workPhone: '',
    skypeId: '',
    telegramId: '',
    preferredContact: 'PHONE',

    // Address Information
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    coordinates: '',

    // Work Details
    workType: 'INTERNAL',
    workLocation: '',
    jobTitle: '',
    department: '',
    workDescription: '',
    skills: [] as string[],
    specializations: [] as string[],

    // Collaboration & Availability
    degreeOfCooperation: 'HIGH',
    availability: {},
    timeZone: '',
    bestTimeToCall: '',
    workingHours: {},

    // Education & Qualifications
    highestEducation: '',
    university: '',
    graduationYear: '',
    fieldOfStudy: '',
    certifications: [] as string[],
    previousExperience: '',

    // Financial Information
    paymentType: '',
    hourlyRate: '',
    dailyRate: '',
    monthlyRate: '',
    currency: 'USD',
    paymentMethod: '',
    bankAccount: '',
    bankName: '',
    paymentNotes: '',

    // Gifts & Benefits
    giftsReceived: [] as any[],
    benefitsProvided: [] as string[],
    bonusHistory: [] as any[],

    // Performance & Ratings
    overallRating: '',
    reliability: '',
    quality: '',
    communication: '',
    punctuality: '',

    // Medical & Health
    medicalConditions: '',
    allergies: '',
    medications: '',
    healthInsurance: false,

    // Contract & Legal
    contractType: '',
    contractStart: '',
    contractEnd: '',
    contractTerms: '',
    confidentialityAgreement: false,

    // Background & References
    backgroundCheck: false,
    references: [] as any[],
    previousEmployers: [] as any[],
    criminalRecord: false,

    // Personal Notes
    personalInterests: [] as string[],
    workPreferences: '',
    culturalConsiderations: '',
    personalNotes: '',
    managerNotes: '',

    // Status & Tracking
    status: 'ACTIVE',
    lastContactDate: '',
    nextReviewDate: '',

    // Emergency Contacts
    emergencyContact1Name: '',
    emergencyContact1Relation: '',
    emergencyContact1Phone: '',
    emergencyContact1Address: '',
    emergencyContact2Name: '',
    emergencyContact2Relation: '',
    emergencyContact2Phone: '',
    emergencyContact2Address: '',

    // Identification
    nationalId: '',
    passportNumber: '',
    passportExpiry: '',
    drivingLicense: '',
    licenseExpiry: '',
    visaStatus: '',
    visaExpiry: ''
  })

  const fetchTaskHelpers = async () => {
    try {
      const response = await fetch('/api/task-helpers')
      if (response.ok) {
        const data = await response.json()
        setTaskHelpers(data)
      }
    } catch (error) {
      console.error('Error fetching task helpers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTaskHelpers()
  }, [])

  const resetForm = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      preferredName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      maritalStatus: '',
      bloodGroup: '',
      nationality: '',
      religion: '',
      languages: [],

      primaryEmail: '',
      personalEmail: '',
      workEmail: '',
      primaryPhone: '',
      mobilePhone: '',
      whatsappNumber: '',
      homePhone: '',
      workPhone: '',
      skypeId: '',
      telegramId: '',
      preferredContact: 'PHONE',

      currentAddress: '',
      permanentAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      coordinates: '',

      workType: 'INTERNAL',
      workLocation: '',
      jobTitle: '',
      department: '',
      workDescription: '',
      skills: [],
      specializations: [],

      degreeOfCooperation: 'HIGH',
      availability: {},
      timeZone: '',
      bestTimeToCall: '',
      workingHours: {},

      highestEducation: '',
      university: '',
      graduationYear: '',
      fieldOfStudy: '',
      certifications: [],
      previousExperience: '',

      paymentType: '',
      hourlyRate: '',
      dailyRate: '',
      monthlyRate: '',
      currency: 'USD',
      paymentMethod: '',
      bankAccount: '',
      bankName: '',
      paymentNotes: '',

      giftsReceived: [],
      benefitsProvided: [],
      bonusHistory: [],

      overallRating: '',
      reliability: '',
      quality: '',
      communication: '',
      punctuality: '',

      medicalConditions: '',
      allergies: '',
      medications: '',
      healthInsurance: false,

      contractType: '',
      contractStart: '',
      contractEnd: '',
      contractTerms: '',
      confidentialityAgreement: false,

      backgroundCheck: false,
      references: [],
      previousEmployers: [],
      criminalRecord: false,

      personalInterests: [],
      workPreferences: '',
      culturalConsiderations: '',
      personalNotes: '',
      managerNotes: '',

      status: 'ACTIVE',
      lastContactDate: '',
      nextReviewDate: '',

      emergencyContact1Name: '',
      emergencyContact1Relation: '',
      emergencyContact1Phone: '',
      emergencyContact1Address: '',
      emergencyContact2Name: '',
      emergencyContact2Relation: '',
      emergencyContact2Phone: '',
      emergencyContact2Address: '',

      nationalId: '',
      passportNumber: '',
      passportExpiry: '',
      drivingLicense: '',
      licenseExpiry: '',
      visaStatus: '',
      visaExpiry: ''
    })
    setEditingHelper(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingHelper
        ? `/api/task-helpers/${editingHelper.id}`
        : '/api/task-helpers'

      const method = editingHelper ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchTaskHelpers()
        resetForm()
        alert(`Task helper ${editingHelper ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || `Failed to ${editingHelper ? 'update' : 'create'} task helper`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Network error occurred')
    }
  }

  const handlePhoneChange = (field: string, value: string) => {
    const formattedValue = formatPhoneNumber(value)
    setFormData(prev => ({ ...prev, [field]: formattedValue }))
  }

  const filteredHelpers = taskHelpers.filter(helper => {
    const matchesSearch = (helper.firstName + ' ' + helper.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         helper.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         helper.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         helper.country?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !selectedWorkType || helper.workType === selectedWorkType

    return matchesSearch && matchesType
  })

  const typeStats = workTypes.map(type => ({
    ...type,
    count: taskHelpers.filter(h => h.workType === type.value).length
  }))

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
            <h1 className="text-3xl font-bold text-gray-900">Task Helpers Management</h1>
            <p className="text-gray-600 mt-2">
              Manage personal assistants and task helpers
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
          >
            <span className="mr-2">➕</span>
            Add Task Helper
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {typeStats.map((type) => (
            <div key={type.value} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-center">
                <span className="text-2xl">{type.icon}</span>
                <p className="text-sm font-medium text-gray-600 mt-1">{type.label.replace(/^.+ /, '')}</p>
                <p className="text-xl font-semibold text-gray-900">{type.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search task helpers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedWorkType}
            onChange={(e) => setSelectedWorkType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Work Types</option>
            {workTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingHelper ? 'Edit Task Helper' : 'Add New Task Helper'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">👤 Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Middle Name
                        </label>
                        <input
                          type="text"
                          value={formData.middleName}
                          onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">📞 Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Email
                        </label>
                        <input
                          type="email"
                          value={formData.primaryEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, primaryEmail: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Phone (Numbers only)
                        </label>
                        <input
                          type="tel"
                          value={formData.primaryPhone}
                          onChange={(e) => handlePhoneChange('primaryPhone', e.target.value)}
                          pattern="[0-9]{7,15}"
                          title="Please enter only numbers (7-15 digits)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Number (Numbers only)
                        </label>
                        <input
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={(e) => handlePhoneChange('whatsappNumber', e.target.value)}
                          pattern="[0-9]{7,15}"
                          title="Please enter only numbers (7-15 digits)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Contact Method
                        </label>
                        <select
                          value={formData.preferredContact}
                          onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="PHONE">📞 Phone Call</option>
                          <option value="EMAIL">📧 Email</option>
                          <option value="WHATSAPP">📱 WhatsApp</option>
                          <option value="TELEGRAM">📩 Telegram</option>
                          <option value="SKYPE">💻 Skype</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Work Details */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">💼 Work Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Type *
                        </label>
                        <select
                          required
                          value={formData.workType}
                          onChange={(e) => setFormData(prev => ({ ...prev, workType: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {workTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Location
                        </label>
                        <input
                          type="text"
                          value={formData.workLocation}
                          onChange={(e) => setFormData(prev => ({ ...prev, workLocation: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Degree of Cooperation
                        </label>
                        <select
                          value={formData.degreeOfCooperation}
                          onChange={(e) => setFormData(prev => ({ ...prev, degreeOfCooperation: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {cooperationLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">💰 Payment & Compensation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Type
                        </label>
                        <select
                          value={formData.paymentType}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentType: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Payment Type</option>
                          <option value="HOURLY">Hourly Rate</option>
                          <option value="DAILY">Daily Rate</option>
                          <option value="WEEKLY">Weekly Rate</option>
                          <option value="MONTHLY">Monthly Salary</option>
                          <option value="PROJECT_BASED">Project Based</option>
                          <option value="VOLUNTEER">Volunteer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hourly Rate
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monthly Rate
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.monthlyRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, monthlyRate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">📝 Additional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Description
                        </label>
                        <textarea
                          value={formData.workDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, workDescription: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Personal Notes
                        </label>
                        <textarea
                          value={formData.personalNotes}
                          onChange={(e) => setFormData(prev => ({ ...prev, personalNotes: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      {editingHelper ? 'Update Task Helper' : 'Create Task Helper'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Task Helpers List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Task Helpers ({filteredHelpers.length})
            </h3>

            {filteredHelpers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛠️👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No task helpers found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedWorkType ? 'Try adjusting your search filters' : 'Add your first task helper to get started.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHelpers.map((helper) => {
                  const workTypeInfo = workTypes.find(t => t.value === helper.workType)
                  const cooperationLevel = cooperationLevels.find(l => l.value === helper.degreeOfCooperation)

                  return (
                    <div key={helper.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{workTypeInfo?.icon || '👤'}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{helper.fullName || `${helper.firstName} ${helper.lastName}`}</h4>
                            <p className="text-sm text-gray-500">{helper.jobTitle || helper.workType}</p>
                          </div>
                        </div>
                        {helper.overallRating && (
                          <div className="flex">
                            {Array.from({ length: Math.round(helper.overallRating) }, (_, i) => (
                              <span key={i} className="text-yellow-400">⭐</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        {helper.city && helper.country && (
                          <p className="text-sm text-gray-600">📍 {helper.city}, {helper.country}</p>
                        )}
                        {helper.primaryEmail && (
                          <p className="text-sm text-gray-600">📧 {helper.primaryEmail}</p>
                        )}
                        {helper.primaryPhone && (
                          <p className="text-sm text-gray-600">📞 {helper.primaryPhone}</p>
                        )}
                        {helper.workLocation && (
                          <p className="text-sm text-gray-600">🏢 {helper.workLocation}</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${cooperationLevel?.color || 'bg-gray-100 text-gray-800'}`}>
                          {cooperationLevel?.label || helper.degreeOfCooperation}
                        </span>

                        {(helper.hourlyRate || helper.monthlyRate) && (
                          <span className="text-sm font-medium text-green-600">
                            {helper.hourlyRate && `$${helper.hourlyRate}/hr`}
                            {helper.monthlyRate && `$${helper.monthlyRate}/mo`}
                            {helper.currency && helper.currency !== 'USD' && ` ${helper.currency}`}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        Hired: {new Date(helper.hireDate).toLocaleDateString()}
                      </div>

                      <button
                        onClick={() => {
                          setEditingHelper(helper)
                          // Load helper data into form (implement this)
                          setShowForm(true)
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
                      >
                        ✏️ Edit Task Helper
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}