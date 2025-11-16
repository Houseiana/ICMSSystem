'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import VisaDialog from '@/components/VisaDialog'

interface Person {
  id: number
  type: 'EMPLOYEE' | 'EMPLOYER' | 'STAKEHOLDER' | 'TASK_HELPER'
  firstName: string
  middleName?: string
  lastName: string
  fullName: string
  email?: string
  nationality?: string
  department?: string
  position?: string
  occupation?: string
  employer?: string
}

interface Visa {
  id: number
  personType: string
  personId: number
  personName: string
  personEmail?: string
  personNationality?: string
  destinationCountry: string
  countryIcon: string
  countryFullName: string
  visaStatus: string
  visaNumber?: string
  issuanceDate?: string
  expiryDate?: string
  visaCategory?: string
  applicationStatus: string
  createdAt: string
}

const countries = [
  { code: 'UK', name: 'United Kingdom', icon: '🇬🇧', fullName: 'United Kingdom of Great Britain and Northern Ireland' },
  { code: 'SCHENGEN', name: 'Schengen Area', icon: '🇪🇺', fullName: 'European Schengen Area' },
  { code: 'KSA', name: 'Saudi Arabia', icon: '🇸🇦', fullName: 'Kingdom of Saudi Arabia' },
  { code: 'USA', name: 'United States', icon: '🇺🇸', fullName: 'United States of America' },
  { code: 'TURKEY', name: 'Turkey', icon: '🇹🇷', fullName: 'Republic of Turkey' }
]

const visaStatuses = [
  { value: 'HAS_VISA', label: 'Has Visa', color: 'bg-green-100 text-green-800' },
  { value: 'NO_VISA', label: 'No Visa', color: 'bg-red-100 text-red-800' },
  { value: 'NEEDS_VISA', label: 'Needs Visa', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'UNDER_PROCESS', label: 'Under Process', color: 'bg-blue-100 text-blue-800' }
]

const visaCategories = [
  'VISIT', 'BUSINESS', 'ESCORT', 'DOMESTIC_WORKER', 'TOURIST',
  'STUDENT', 'WORK', 'TRANSIT', 'FAMILY', 'MEDICAL'
]

const applicationStatuses = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'SUBMITTED', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'COLLECTED', label: 'Collected', color: 'bg-purple-100 text-purple-800' }
]

export default function VisasPage() {
  const [visas, setVisas] = useState<Visa[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showVisaDialog, setShowVisaDialog] = useState(false)
  const [editingVisa, setEditingVisa] = useState<Visa | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current')
  const [showTravelHistory, setShowTravelHistory] = useState(false)
  const [selectedVisaForTravel, setSelectedVisaForTravel] = useState<Visa | null>(null)
  const [travelHistory, setTravelHistory] = useState<any[]>([])
  const [showTravelForm, setShowTravelForm] = useState(false)

  useEffect(() => {
    fetchVisas()
    fetchStats()
  }, [])

  const fetchVisas = async () => {
    try {
      const response = await fetch('/api/visas')
      if (response.ok) {
        const data = await response.json()
        setVisas(data)
      }
    } catch (error) {
      console.error('Error fetching visas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/visas/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchTravelHistory = async (visaId: number) => {
    try {
      const response = await fetch(`/api/travel-history?visaId=${visaId}`)
      if (response.ok) {
        const data = await response.json()
        setTravelHistory(data)
      }
    } catch (error) {
      console.error('Error fetching travel history:', error)
    }
  }

  const handleEdit = (visa: Visa) => {
    setEditingVisa(visa)
    setShowVisaDialog(true)
  }

  const handleAddNew = () => {
    setEditingVisa(null)
    setShowVisaDialog(true)
  }

  const handleVisaSuccess = () => {
    fetchVisas()
    fetchStats()
    setEditingVisa(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this visa record?')) return

    try {
      const response = await fetch(`/api/visas/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchVisas()
      }
    } catch (error) {
      console.error('Error deleting visa:', error)
    }
  }

  const handleArchiveVisa = async (id: number) => {
    if (!confirm('Are you sure you want to move this visa to Previous Visas?')) return

    try {
      const response = await fetch(`/api/visas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: false,
          archiveReason: 'Moved to previous visas'
        })
      })
      if (response.ok) {
        await fetchVisas()
      }
    } catch (error) {
      console.error('Error archiving visa:', error)
    }
  }

  const handleShowTravelHistory = (visa: Visa) => {
    setSelectedVisaForTravel(visa)
    fetchTravelHistory(visa.id)
    setShowTravelHistory(true)
  }

  const filteredVisas = visas.filter(visa => {
    const matchesSearch = !searchTerm ||
      visa.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visa.visaNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCountry = !filterCountry || visa.destinationCountry === filterCountry
    const matchesStatus = !filterStatus || visa.visaStatus === filterStatus

    // Filter by active/inactive based on current tab
    const isActiveVisa = (visa as any).isActive !== false // Default to true if undefined
    const matchesTab = activeTab === 'current' ? isActiveVisa : !isActiveVisa

    return matchesSearch && matchesCountry && matchesStatus && matchesTab
  })

  const getVisaStatusBadge = (status: string) => {
    const statusConfig = visaStatuses.find(s => s.value === status)
    return statusConfig ? statusConfig : { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  const getApplicationStatusBadge = (status: string) => {
    const statusConfig = applicationStatuses.find(s => s.value === status)
    return statusConfig ? statusConfig : { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading visas...</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Visa Management</h1>
          <p className="text-gray-600">Manage visa applications and status</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Visa Record
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {countries.map(country => {
          const countryStats = stats[country.code] || { total: 0, hasVisa: 0, needsVisa: 0, noVisa: 0, underProcess: 0 }

          return (
            <div key={country.code} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{country.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{country.name}</h3>
                  <p className="text-sm text-gray-500">Total: {countryStats.total}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Has Visa:</span>
                  <span className="font-medium">{countryStats.hasVisa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Needs Visa:</span>
                  <span className="font-medium">{countryStats.needsVisa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">No Visa:</span>
                  <span className="font-medium">{countryStats.noVisa}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

        <>
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'current'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Current Visas
              </button>
              <button
                onClick={() => setActiveTab('previous')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'previous'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Previous Visas
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or visa number..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country/Region
                </label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.icon} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visa Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  {visaStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setSearchTerm(''); setFilterCountry(''); setFilterStatus('') }}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Visas List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {activeTab === 'current' ? 'Current' : 'Previous'} Visa Records ({filteredVisas.length})
              </h2>

              {filteredVisas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄✈️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No visa records found</h3>
                  <p className="text-gray-500 mb-4">Get started by adding a visa record for someone</p>
                  <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Visa Record
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Person
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Country/Region
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visa Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visa Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Application
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredVisas.map((visa) => (
                        <tr key={visa.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{visa.personName}</div>
                              <div className="text-sm text-gray-500">
                                {visa.personType} • {visa.personNationality}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{visa.countryIcon}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{visa.destinationCountry}</div>
                                <div className="text-xs text-gray-500">{visa.countryFullName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVisaStatusBadge(visa.visaStatus).color}`}>
                              {getVisaStatusBadge(visa.visaStatus).label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {visa.visaNumber ? (
                                <>
                                  <div>#{visa.visaNumber}</div>
                                  {visa.expiryDate && (
                                    <div className="text-xs text-gray-500">
                                      Expires: {new Date(visa.expiryDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-500">No visa details</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApplicationStatusBadge(visa.applicationStatus).color}`}>
                              {getApplicationStatusBadge(visa.applicationStatus).label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {activeTab === 'current' ? (
                              <>
                                <button
                                  onClick={() => handleEdit(visa)}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleShowTravelHistory(visa)}
                                  className="text-green-600 hover:text-green-900 mr-3"
                                >
                                  Travel
                                </button>
                                <button
                                  onClick={() => handleArchiveVisa(visa.id)}
                                  className="text-orange-600 hover:text-orange-900 mr-3"
                                >
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDelete(visa.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleShowTravelHistory(visa)}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  View Travel
                                </button>
                                <button
                                  onClick={() => handleDelete(visa.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </>
                            )}
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

      {/* Visa Dialog */}
      <VisaDialog
        isOpen={showVisaDialog}
        onClose={() => {
          setShowVisaDialog(false)
          setEditingVisa(null)
        }}
        onSuccess={handleVisaSuccess}
        visa={editingVisa}
      />

      {/* Travel History Modal */}
      {showTravelHistory && selectedVisaForTravel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Travel History - {selectedVisaForTravel.personName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedVisaForTravel.countryIcon} {selectedVisaForTravel.destinationCountry} Visa
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowTravelForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Add Travel Record
                  </button>
                  <button
                    onClick={() => setShowTravelHistory(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {travelHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✈️</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No travel records</h4>
                  <p className="text-gray-500 mb-4">Start tracking travel history for this visa</p>
                  <button
                    onClick={() => setShowTravelForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Travel Record
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {travelHistory.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {trip.tripPurpose || 'Travel'} - {trip.tripType || 'Unknown Type'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Status: <span className={`font-medium ${
                              trip.tripStatus === 'COMPLETED' ? 'text-green-600' :
                              trip.tripStatus === 'IN_PROGRESS' ? 'text-blue-600' :
                              trip.tripStatus === 'CANCELLED' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}>
                              {trip.tripStatus || 'PLANNED'}
                            </span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Departure:</span>
                          <br />
                          <span className="font-medium">
                            {trip.departureDate ? new Date(trip.departureDate).toLocaleDateString() : 'Not set'}
                          </span>
                          {trip.departureCity && (
                            <>
                              <br />
                              <span className="text-gray-600">{trip.departureCity}</span>
                            </>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Arrival:</span>
                          <br />
                          <span className="font-medium">
                            {trip.arrivalDate ? new Date(trip.arrivalDate).toLocaleDateString() : 'Not set'}
                          </span>
                          {trip.arrivalCity && (
                            <>
                              <br />
                              <span className="text-gray-600">{trip.arrivalCity}</span>
                            </>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Return:</span>
                          <br />
                          <span className="font-medium">
                            {trip.returnDate ? new Date(trip.returnDate).toLocaleDateString() : 'Not set'}
                          </span>
                        </div>
                      </div>

                      {(trip.accommodationName || trip.transportMode || trip.flightNumber) && (
                        <div className="mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {trip.accommodationName && (
                            <div>
                              <span className="text-gray-500">Accommodation:</span>
                              <br />
                              <span className="font-medium">{trip.accommodationName}</span>
                              {trip.accommodationType && (
                                <span className="text-gray-600"> ({trip.accommodationType})</span>
                              )}
                            </div>
                          )}
                          {(trip.transportMode || trip.flightNumber) && (
                            <div>
                              <span className="text-gray-500">Transport:</span>
                              <br />
                              {trip.transportMode && (
                                <span className="font-medium">{trip.transportMode}</span>
                              )}
                              {trip.flightNumber && (
                                <span className="text-gray-600"> - {trip.flightNumber}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {trip.tripNotes && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-gray-500 text-sm">Notes:</span>
                          <p className="text-sm text-gray-700 mt-1">{trip.tripNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Travel Form Modal */}
      {showTravelForm && selectedVisaForTravel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Travel Record
                </h3>
                <button
                  onClick={() => setShowTravelForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const travelData = {
                  visaId: selectedVisaForTravel.id,
                  tripPurpose: formData.get('tripPurpose'),
                  tripType: formData.get('tripType'),
                  departureDate: formData.get('departureDate') || null,
                  arrivalDate: formData.get('arrivalDate') || null,
                  returnDate: formData.get('returnDate') || null,
                  departureCity: formData.get('departureCity'),
                  arrivalCity: formData.get('arrivalCity'),
                  transportMode: formData.get('transportMode'),
                  flightNumber: formData.get('flightNumber'),
                  accommodationType: formData.get('accommodationType'),
                  accommodationName: formData.get('accommodationName'),
                  accommodationAddress: formData.get('accommodationAddress'),
                  tripStatus: formData.get('tripStatus') || 'PLANNED',
                  tripNotes: formData.get('tripNotes')
                }

                try {
                  const response = await fetch('/api/travel-history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(travelData)
                  })

                  if (response.ok) {
                    setShowTravelForm(false)
                    fetchTravelHistory(selectedVisaForTravel.id)
                  } else {
                    const error = await response.json()
                    alert(error.error || 'Failed to save travel record')
                  }
                } catch (error) {
                  console.error('Error saving travel record:', error)
                  alert('An error occurred while saving')
                }
              }}
              className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trip Purpose
                  </label>
                  <input
                    type="text"
                    name="tripPurpose"
                    placeholder="e.g., Business meeting, Conference, Tourism"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trip Type
                  </label>
                  <select
                    name="tripType"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="BUSINESS">Business</option>
                    <option value="LEISURE">Leisure</option>
                    <option value="EMERGENCY">Emergency</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="EDUCATION">Education</option>
                    <option value="FAMILY">Family Visit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure City
                  </label>
                  <input
                    type="text"
                    name="departureCity"
                    placeholder="e.g., London, New York"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival City
                  </label>
                  <input
                    type="text"
                    name="arrivalCity"
                    placeholder="e.g., Dubai, Paris"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transport Mode
                  </label>
                  <select
                    name="transportMode"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Transport</option>
                    <option value="FLIGHT">Flight</option>
                    <option value="TRAIN">Train</option>
                    <option value="CAR">Car</option>
                    <option value="BUS">Bus</option>
                    <option value="SHIP">Ship</option>
                    <option value="MULTIPLE">Multiple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flight Number (if applicable)
                  </label>
                  <input
                    type="text"
                    name="flightNumber"
                    placeholder="e.g., BA123, EK456"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accommodation Type
                  </label>
                  <select
                    name="accommodationType"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="HOTEL">Hotel</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="FAMILY">Family/Friends</option>
                    <option value="COMPANY">Company Housing</option>
                    <option value="HOSTEL">Hostel</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accommodation Name
                  </label>
                  <input
                    type="text"
                    name="accommodationName"
                    placeholder="e.g., Hilton Hotel, Family Home"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accommodation Address
                </label>
                <input
                  type="text"
                  name="accommodationAddress"
                  placeholder="Full address of accommodation"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Status
                </label>
                <select
                  name="tripStatus"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Notes
                </label>
                <textarea
                  name="tripNotes"
                  rows={3}
                  placeholder="Any additional notes about this trip..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowTravelForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Travel Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  )
}