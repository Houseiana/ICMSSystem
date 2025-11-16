'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PersonPreviewModal from '@/components/PersonPreviewModal'
import { Eye } from 'lucide-react'

interface EmployerContact {
  id?: number
  firstName: string
  middleName?: string
  lastName: string
  fullName?: string
  jobTitle?: string
  department?: string
  workEmail?: string
  workPhone?: string
  mobilePhone?: string
  isPrimary: boolean
  status: string
}

interface Employer {
  id: number
  employerType: string
  // Company fields
  companyName?: string
  tradingName?: string
  companyType?: string
  industry?: string
  // Individual fields
  firstName?: string
  middleName?: string
  lastName?: string
  fullName?: string
  preferredName?: string
  dateOfBirth?: string
  placeOfBirth?: string
  gender?: string
  maritalStatus?: string
  nationality?: string
  profession?: string
  // Common fields
  primaryEmail?: string
  mainPhone?: string
  website?: string
  headOfficeAddress?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  establishedYear?: number
  employeeCount?: string
  relationshipType?: string
  status: string
  overallRating?: number
  contacts?: EmployerContact[]
  createdAt: string
  updatedAt: string
}

const companyTypes = [
  'CORPORATION', 'LLC', 'PARTNERSHIP', 'GOVERNMENT', 'NON_PROFIT', 'STARTUP', 'SME'
]

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail',
  'Construction', 'Transportation', 'Energy', 'Agriculture', 'Media', 'Hospitality',
  'Real Estate', 'Legal', 'Consulting', 'Other'
]

const relationshipTypes = [
  'CLIENT', 'PARTNER', 'VENDOR', 'COMPETITOR', 'POTENTIAL'
]

const employeeCounts = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
]

const departments = [
  'HR', 'Finance', 'Operations', 'Legal', 'IT', 'Sales', 'Marketing', 'Management'
]

const genderOptions = [
  'MALE', 'FEMALE', 'OTHER'
]

const maritalStatusOptions = [
  'SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED'
]

const statusOptions = [
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'INACTIVE', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { value: 'SUSPENDED', label: 'Suspended', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'BLACKLISTED', label: 'Blacklisted', color: 'bg-red-100 text-red-800' },
  { value: 'POTENTIAL', label: 'Potential', color: 'bg-blue-100 text-blue-800' }
]

export default function EmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [editingEmployer, setEditingEmployer] = useState<Employer | null>(null)
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [filterRelationship, setFilterRelationship] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [stats, setStats] = useState<Record<string, number>>({})
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean
    personId?: number
  }>({
    isOpen: false
  })

  // Form state
  const [formData, setFormData] = useState({
    employerType: 'COMPANY',
    // Company fields
    companyName: '',
    tradingName: '',
    companyType: '',
    industry: '',
    businessNature: '',
    // Individual fields
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    profession: '',
    bloodGroup: '',
    religion: '',
    // Registration
    registrationNumber: '',
    taxId: '',
    // Contact
    primaryEmail: '',
    secondaryEmail: '',
    mainPhone: '',
    alternatePhone: '',
    website: '',
    // Address
    headOfficeAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    // Document URLs
    photoUrl: '',
    qidDocumentUrl: '',
    passportDocumentUrl: '',
    // Passport/Visa Information
    passportNumber: '',
    passportExpiry: '',
    passportIssuingCountry: '',
    visaStatus: '',
    visaType: '',
    visaNumber: '',
    visaValidFrom: '',
    visaValidTo: '',
    visaCategory: '',
    visaEntries: '',
    // Business
    establishedYear: '',
    employeeCount: '',
    relationshipType: '',
    status: 'ACTIVE',
    overallRating: '',
    publicNotes: '',
    privateNotes: ''
  })

  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    jobTitle: '',
    department: '',
    workEmail: '',
    personalEmail: '',
    workPhone: '',
    mobilePhone: '',
    isPrimary: false,
    status: 'ACTIVE'
  })

  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/employers?includeContacts=true')
      if (response.ok) {
        const data = await response.json()
        setEmployers(data.employers)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching employers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setContactFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setContactFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingEmployer ? `/api/employers/${editingEmployer.id}` : '/api/employers'
      const method = editingEmployer ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
        overallRating: formData.overallRating ? parseFloat(formData.overallRating) : null
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchEmployers()
        resetForm()
        setShowForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'An error occurred')
      }
    } catch (error) {
      console.error('Error saving employer:', error)
      alert('An error occurred while saving')
    } finally {
      setLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployer) return

    try {
      const response = await fetch(`/api/employers/${selectedEmployer.id}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactFormData)
      })

      if (response.ok) {
        await fetchEmployers()
        resetContactForm()
        setShowContactForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'An error occurred')
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('An error occurred while saving')
    }
  }

  const handleEdit = (employer: Employer) => {
    setFormData({
      employerType: employer.employerType,
      // Company fields
      companyName: employer.companyName || '',
      tradingName: employer.tradingName || '',
      companyType: employer.companyType || '',
      industry: employer.industry || '',
      businessNature: '',
      // Individual fields
      firstName: employer.firstName || '',
      middleName: employer.middleName || '',
      lastName: employer.lastName || '',
      preferredName: employer.preferredName || '',
      dateOfBirth: employer.dateOfBirth ? employer.dateOfBirth.split('T')[0] : '',
      placeOfBirth: employer.placeOfBirth || '',
      gender: employer.gender || '',
      maritalStatus: employer.maritalStatus || '',
      nationality: employer.nationality || '',
      profession: employer.profession || '',
      bloodGroup: (employer as any).bloodGroup || '',
      religion: (employer as any).religion || '',
      // Registration
      registrationNumber: '',
      taxId: '',
      // Contact
      primaryEmail: employer.primaryEmail || '',
      secondaryEmail: '',
      mainPhone: employer.mainPhone || '',
      alternatePhone: '',
      website: employer.website || '',
      // Address
      headOfficeAddress: employer.headOfficeAddress || '',
      city: employer.city || '',
      state: employer.state || '',
      country: employer.country || '',
      postalCode: employer.postalCode || '',
      // Document URLs
      photoUrl: (employer as any).photoUrl || '',
      qidDocumentUrl: (employer as any).qidDocumentUrl || '',
      passportDocumentUrl: (employer as any).passportDocumentUrl || '',
      // Passport/Visa Information
      passportNumber: '',
      passportExpiry: '',
      passportIssuingCountry: '',
      visaStatus: '',
      visaType: '',
      visaNumber: '',
      visaValidFrom: '',
      visaValidTo: '',
      visaCategory: '',
      visaEntries: '',
      // Business
      establishedYear: employer.establishedYear?.toString() || '',
      employeeCount: employer.employeeCount || '',
      relationshipType: employer.relationshipType || '',
      status: employer.status,
      overallRating: employer.overallRating?.toString() || '',
      publicNotes: '',
      privateNotes: ''
    })
    setEditingEmployer(employer)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employer?')) return

    try {
      const response = await fetch(`/api/employers/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchEmployers()
      }
    } catch (error) {
      console.error('Error deleting employer:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      employerType: 'COMPANY',
      // Company fields
      companyName: '',
      tradingName: '',
      companyType: '',
      industry: '',
      businessNature: '',
      // Individual fields
      firstName: '',
      middleName: '',
      lastName: '',
      preferredName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      profession: '',
      bloodGroup: '',
      religion: '',
      // Registration
      registrationNumber: '',
      taxId: '',
      // Contact
      primaryEmail: '',
      secondaryEmail: '',
      mainPhone: '',
      alternatePhone: '',
      website: '',
      // Address
      headOfficeAddress: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      // Document URLs
      photoUrl: '',
      qidDocumentUrl: '',
      passportDocumentUrl: '',
      // Passport/Visa Information
      passportNumber: '',
      passportExpiry: '',
      passportIssuingCountry: '',
      visaStatus: '',
      visaType: '',
      visaNumber: '',
      visaValidFrom: '',
      visaValidTo: '',
      visaCategory: '',
      visaEntries: '',
      // Business
      establishedYear: '',
      employeeCount: '',
      relationshipType: '',
      status: 'ACTIVE',
      overallRating: '',
      publicNotes: '',
      privateNotes: ''
    })
    setEditingEmployer(null)
  }

  const resetContactForm = () => {
    setContactFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      jobTitle: '',
      department: '',
      workEmail: '',
      personalEmail: '',
      workPhone: '',
      mobilePhone: '',
      isPrimary: false,
      status: 'ACTIVE'
    })
  }

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = !searchTerm ||
      employer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.tradingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.city?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesIndustry = !filterIndustry || employer.industry === filterIndustry
    const matchesRelationship = !filterRelationship || employer.relationshipType === filterRelationship
    const matchesStatus = !filterStatus || employer.status === filterStatus

    return matchesSearch && matchesIndustry && matchesRelationship && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    return statusConfig ? statusConfig : { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  const getRatingStars = (rating?: number) => {
    if (!rating) return '⚫⚫⚫⚫⚫'
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
    return stars
  }

  if (loading && !showForm && !showContactForm) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading employers...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Management</h1>
            <p className="text-gray-600">Manage employer companies and contacts</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Employer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statusOptions.map(status => (
            <div key={status.value} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats[status.value] || 0}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${status.color} flex items-center justify-center`}>
                  <span className="text-lg">🏢</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showForm && !showContactForm ? (
          <>
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search employers..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <select
                    value={filterRelationship}
                    onChange={(e) => setFilterRelationship(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Relationships</option>
                    {relationshipTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => { setSearchTerm(''); setFilterIndustry(''); setFilterRelationship(''); setFilterStatus('') }}
                    className="w-full p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Employers List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Employers ({filteredEmployers.length})
                </h2>

                {filteredEmployers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏢</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No employers found</h3>
                    <p className="text-gray-500 mb-4">Get started by adding an employer</p>
                    <button
                      onClick={() => { resetForm(); setShowForm(true) }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Employer
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Industry/Profession
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployers.map((employer) => (
                          <tr key={employer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {employer.employerType === 'COMPANY'
                                    ? employer.companyName
                                    : employer.fullName || `${employer.firstName} ${employer.lastName}`}
                                </div>
                                {employer.employerType === 'COMPANY' && employer.tradingName && (
                                  <div className="text-sm text-gray-500">Trading as: {employer.tradingName}</div>
                                )}
                                {employer.employerType === 'INDIVIDUAL' && employer.profession && (
                                  <div className="text-sm text-gray-500">Profession: {employer.profession}</div>
                                )}
                                <div className="text-xs text-gray-500">
                                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                    employer.employerType === 'COMPANY'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {employer.employerType === 'COMPANY' ? '🏢 Company' : '👤 Individual'}
                                  </span>
                                  {employer.relationshipType && (
                                    <span className="ml-2">{employer.relationshipType}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {employer.employerType === 'COMPANY'
                                  ? employer.industry || 'Not specified'
                                  : employer.profession || 'Not specified'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {employer.city && employer.country ? `${employer.city}, ${employer.country}` : 'Not specified'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {employer.primaryEmail && (
                                  <div className="text-sm text-gray-900">{employer.primaryEmail}</div>
                                )}
                                {employer.mainPhone && (
                                  <div className="text-sm text-gray-500">{employer.mainPhone}</div>
                                )}
                                {employer.contacts && employer.contacts.length > 0 && (
                                  <div className="text-xs text-blue-600">{employer.contacts.length} contact(s)</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(employer.status).color}`}>
                                {getStatusBadge(employer.status).label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{getRatingStars(employer.overallRating)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setPreviewModal({ isOpen: true, personId: employer.id })}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Preview Employer"
                              >
                                <Eye className="w-4 h-4 inline-block" />
                              </button>
                              <button
                                onClick={() => handleEdit(employer)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => { setSelectedEmployer(employer); setShowContactForm(true) }}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Add Contact
                              </button>
                              <button
                                onClick={() => handleDelete(employer.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : showContactForm && selectedEmployer ? (
          /* Contact Form */
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add Contact - {selectedEmployer.companyName}
                </h2>
                <button
                  onClick={() => { setShowContactForm(false); resetContactForm() }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={contactFormData.firstName}
                        onChange={handleContactInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        name="middleName"
                        value={contactFormData.middleName}
                        onChange={handleContactInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={contactFormData.lastName}
                        onChange={handleContactInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={contactFormData.jobTitle}
                        onChange={handleContactInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        name="department"
                        value={contactFormData.department}
                        onChange={handleContactInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                      <input
                        type="email"
                        name="workEmail"
                        value={contactFormData.workEmail}
                        onChange={handleContactInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email</label>
                      <input
                        type="email"
                        name="personalEmail"
                        value={contactFormData.personalEmail}
                        onChange={handleContactInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Work Phone</label>
                      <input
                        type="tel"
                        name="workPhone"
                        value={contactFormData.workPhone}
                        onChange={handleContactInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone</label>
                      <input
                        type="tel"
                        name="mobilePhone"
                        value={contactFormData.mobilePhone}
                        onChange={handleContactInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        name="isPrimary"
                        checked={contactFormData.isPrimary}
                        onChange={handleContactInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
                        Primary Contact
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={contactFormData.status}
                        onChange={handleContactInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => { setShowContactForm(false); resetContactForm() }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Employer Form */
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingEmployer ? 'Edit Employer' : 'Add New Employer'}
                </h2>
                <button
                  onClick={() => { setShowForm(false); resetForm() }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Employer Type Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Employer Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, employerType: 'COMPANY' }))}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.employerType === 'COMPANY'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">🏢</div>
                      <div className="text-sm font-medium text-gray-900">Company</div>
                      <div className="text-xs text-gray-500">Organization or business entity</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, employerType: 'INDIVIDUAL' }))}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        formData.employerType === 'INDIVIDUAL'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">👤</div>
                      <div className="text-sm font-medium text-gray-900">Individual</div>
                      <div className="text-xs text-gray-500">Single person employer</div>
                    </button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formData.employerType === 'COMPANY' ? 'Company Information' : 'Personal Information'}
                  </h3>
                  {formData.employerType === 'COMPANY' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required={formData.employerType === 'COMPANY'}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trading Name</label>
                        <input
                          type="text"
                          name="tradingName"
                          value={formData.tradingName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                        <select
                          name="companyType"
                          value={formData.companyType}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Type</option>
                          {companyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Industry</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required={formData.employerType === 'INDIVIDUAL'}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                          <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required={formData.employerType === 'INDIVIDUAL'}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Name</label>
                          <input
                            type="text"
                            name="preferredName"
                            value={formData.preferredName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Gender</option>
                            {genderOptions.map(gender => (
                              <option key={gender} value={gender}>{gender}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                          <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Status</option>
                            {maritalStatusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                          <input
                            type="text"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                          <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                          <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                          <input
                            type="text"
                            name="religion"
                            value={formData.religion}
                            onChange={handleInputChange}
                            placeholder="e.g., Islam, Christianity, etc."
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Documents & Photos (for Individual Employers) */}
                {formData.employerType === 'INDIVIDUAL' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Documents & Photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Personal Photo URL (Dropbox Link)
                        </label>
                        <input
                          type="url"
                          name="photoUrl"
                          value={formData.photoUrl}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://www.dropbox.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          QID Document URL (Dropbox Link)
                        </label>
                        <input
                          type="url"
                          name="qidDocumentUrl"
                          value={formData.qidDocumentUrl}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://www.dropbox.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Document URL (Dropbox Link)
                        </label>
                        <input
                          type="url"
                          name="passportDocumentUrl"
                          value={formData.passportDocumentUrl}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://www.dropbox.com/..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                      <input
                        type="email"
                        name="primaryEmail"
                        value={formData.primaryEmail}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Phone</label>
                      <input
                        type="tel"
                        name="mainPhone"
                        value={formData.mainPhone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Head Office Address</label>
                      <input
                        type="text"
                        name="headOfficeAddress"
                        value={formData.headOfficeAddress}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Information */}
                {formData.employerType === 'INDIVIDUAL' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Travel Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Number
                        </label>
                        <input
                          type="text"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Expiration
                        </label>
                        <input
                          type="date"
                          name="passportExpiry"
                          value={formData.passportExpiry}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Issuing Country
                        </label>
                        <input
                          type="text"
                          name="passportIssuingCountry"
                          value={formData.passportIssuingCountry}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Visa Status
                        </label>
                        <select
                          name="visaStatus"
                          value={formData.visaStatus}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="VALID">Valid</option>
                          <option value="EXPIRED">Expired</option>
                          <option value="PENDING">Pending</option>
                          <option value="NOT_REQUIRED">Not Required</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Visa Type
                        </label>
                        <select
                          name="visaType"
                          value={formData.visaType}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Type</option>
                          <option value="TOURIST">Tourist</option>
                          <option value="BUSINESS">Business</option>
                          <option value="WORK">Work</option>
                          <option value="STUDENT">Student</option>
                          <option value="RESIDENCE">Residence</option>
                          <option value="TRANSIT">Transit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Visa Number
                        </label>
                        <input
                          type="text"
                          name="visaNumber"
                          value={formData.visaNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Visa Valid From
                        </label>
                        <input
                          type="date"
                          name="visaValidFrom"
                          value={formData.visaValidFrom}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valid Until (Visa Expiry)
                        </label>
                        <input
                          type="date"
                          name="visaValidTo"
                          value={formData.visaValidTo}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Visa Category
                        </label>
                        <input
                          type="text"
                          name="visaCategory"
                          value={formData.visaCategory}
                          onChange={handleInputChange}
                          placeholder="e.g., B1/B2, H1B, F1"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Entry Type
                        </label>
                        <select
                          name="visaEntries"
                          value={formData.visaEntries}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Entry Type</option>
                          <option value="SINGLE">Single Entry</option>
                          <option value="MULTIPLE">Multiple Entries</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                      <input
                        type="number"
                        name="establishedYear"
                        value={formData.establishedYear}
                        onChange={handleInputChange}
                        min="1800"
                        max={new Date().getFullYear()}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                      <select
                        name="employeeCount"
                        value={formData.employeeCount}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Range</option>
                        {employeeCounts.map(count => (
                          <option key={count} value={count}>{count}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Type</label>
                      <select
                        name="relationshipType"
                        value={formData.relationshipType}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Relationship</option>
                        {relationshipTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status and Rating */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Status & Rating</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating (1-5)</label>
                      <input
                        type="number"
                        name="overallRating"
                        value={formData.overallRating}
                        onChange={handleInputChange}
                        min="1"
                        max="5"
                        step="0.1"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm() }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading ||
                      (formData.employerType === 'COMPANY' && !formData.companyName) ||
                      (formData.employerType === 'INDIVIDUAL' && (!formData.firstName || !formData.lastName))
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : editingEmployer ? 'Update Employer' : 'Create Employer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        <PersonPreviewModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal({ isOpen: false })}
          personId={previewModal.personId}
          personType="EMPLOYER"
        />
      </div>
    </DashboardLayout>
  )
}