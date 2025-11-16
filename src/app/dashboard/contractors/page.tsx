'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'

interface ContractorContact {
  id: number
  firstName: string
  lastName: string
  jobTitle?: string
  department?: string
  email?: string
  phone?: string
  mobile?: string
  whatsapp?: string
  preferredContact: string
  isPrimary: boolean
  emergencyContact: boolean
}

interface Contractor {
  id: number
  name: string
  type: string
  category?: string
  city?: string
  country?: string
  website?: string
  mainEmail?: string
  mainPhone?: string
  starRating?: number
  contractType?: string
  status: string
  emergency24h: boolean
  contacts: ContractorContact[]
}

const contractorTypes = [
  { value: 'HOTEL', label: '🏨 Hotel', icon: '🏨' },
  { value: 'AIRLINE', label: '✈️ Airlines', icon: '✈️' },
  { value: 'TRAVEL_AGENT', label: '🧳 Travel Agent', icon: '🧳' },
  { value: 'PRIVATE_JET', label: '🛩️ Private Jets', icon: '🛩️' },
  { value: 'CAR_RENTAL', label: '🚗 Car Rental', icon: '🚗' },
  { value: 'RESTAURANT', label: '🍽️ Restaurant', icon: '🍽️' },
  { value: 'SECURITY', label: '🔒 Security', icon: '🔒' },
  { value: 'CATERING', label: '🍱 Catering', icon: '🍱' },
  { value: 'TRANSPORTATION', label: '🚐 Transportation', icon: '🚐' },
  { value: 'EVENT_PLANNING', label: '🎉 Event Planning', icon: '🎉' },
  { value: 'ACCOMMODATION', label: '🏠 Accommodation', icon: '🏠' },
  { value: 'TOUR_OPERATOR', label: '🗺️ Tour Operator', icon: '🗺️' }
]

const countriesWithCities = {
  'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
  'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Las Vegas', 'San Francisco', 'Boston', 'Washington DC'],
  'UK': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh', 'Glasgow', 'Cardiff', 'Brighton'],
  'France': ['Paris', 'Nice', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Strasbourg'],
  'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund'],
  'Italy': ['Rome', 'Milan', 'Venice', 'Florence', 'Naples', 'Turin', 'Palermo', 'Genoa'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga', 'Zaragoza', 'Palma'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima', 'Yokohama', 'Kobe', 'Nagoya', 'Fukuoka'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Darwin'],
  'Singapore': ['Singapore'],
  'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne', 'St. Gallen'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk', 'Buraidah'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh', 'Hurghada', 'Luxor', 'Aswan'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'],
  'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Xian'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Konya'],
  'Thailand': ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi', 'Koh Samui', 'Hua Hin'],
  'Russia': ['Moscow', 'St. Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancún', 'Puebla', 'Tijuana', 'León'],
  'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan'],
  'Indonesia': ['Jakarta', 'Bali', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar'],
  'Malaysia': ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Malacca', 'Ipoh', 'Kota Kinabalu'],
  'Philippines': ['Manila', 'Cebu', 'Davao', 'Quezon City', 'Makati', 'Pasig', 'Taguig'],
  'Vietnam': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Nha Trang', 'Hue', 'Can Tho'],
  'Morocco': ['Casablanca', 'Marrakech', 'Rabat', 'Fez', 'Tangier', 'Agadir', 'Meknes'],
  'Jordan': ['Amman', 'Aqaba', 'Irbid', 'Zarqa', 'Petra', 'Jerash', 'Madaba'],
  'Lebanon': ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Zahle', 'Jounieh', 'Baalbek'],
  'Kuwait': ['Kuwait City', 'Hawalli', 'Salmiya', 'Ahmadi', 'Jahra', 'Farwaniya'],
  'Qatar': ['Doha', 'Al Rayyan', 'Al Wakrah', 'Umm Salal', 'Al Khor', 'Dukhan'],
  'Bahrain': ['Manama', 'Muharraq', 'Riffa', 'Hamad Town', 'Sitra', 'Isa Town'],
  'Oman': ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Rustaq', 'Buraimi'],
  'Other': ['Other City']
}

const formatPhoneNumber = (value: string) => {
  return value.replace(/\D/g, '')
}

const validatePhoneNumber = (value: string) => {
  const numbersOnly = value.replace(/\D/g, '')
  return numbersOnly.length >= 7 && numbersOnly.length <= 15
}

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null)
  const [availableCities, setAvailableCities] = useState<string[]>([])

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    description: '',
    address: '',
    city: '',
    country: '',
    selectedCountry: '',
    website: '',
    mainEmail: '',
    mainPhone: '',
    starRating: '',
    contractType: 'STANDARD',
    emergency24h: false,
    supportEmail: '',
    supportPhone: '',
    services: [] as string[],
    contacts: [
      {
        firstName: '',
        lastName: '',
        jobTitle: '',
        department: '',
        email: '',
        phone: '',
        mobile: '',
        whatsapp: '',
        preferredContact: 'EMAIL',
        isPrimary: true,
        emergencyContact: false
      }
    ]
  })

  const fetchContractors = async () => {
    try {
      const response = await fetch('/api/contractors')
      if (response.ok) {
        const data = await response.json()
        setContractors(data)
      }
    } catch (error) {
      console.error('Error fetching contractors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContractors()
  }, [])

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      category: '',
      description: '',
      address: '',
      city: '',
      country: '',
      selectedCountry: '',
      website: '',
      mainEmail: '',
      mainPhone: '',
      starRating: '',
      contractType: 'STANDARD',
      emergency24h: false,
      supportEmail: '',
      supportPhone: '',
      services: [],
      contacts: [
        {
          firstName: '',
          lastName: '',
          jobTitle: '',
          department: '',
          email: '',
          phone: '',
          mobile: '',
          whatsapp: '',
          preferredContact: 'EMAIL',
          isPrimary: true,
          emergencyContact: false
        }
      ]
    })
    setEditingContractor(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingContractor
        ? `/api/contractors/${editingContractor.id}`
        : '/api/contractors'

      const method = editingContractor ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchContractors()
        resetForm()
        alert(`Contractor ${editingContractor ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || `Failed to ${editingContractor ? 'update' : 'create'} contractor`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Network error occurred')
    }
  }

  const handleEdit = (contractor: Contractor) => {
    setFormData({
      name: contractor.name,
      type: contractor.type,
      category: contractor.category || '',
      description: '',
      address: '',
      city: contractor.city || '',
      country: contractor.country || '',
      selectedCountry: contractor.country || '',
      website: contractor.website || '',
      mainEmail: contractor.mainEmail || '',
      mainPhone: contractor.mainPhone || '',
      starRating: contractor.starRating?.toString() || '',
      contractType: contractor.contractType || 'STANDARD',
      emergency24h: contractor.emergency24h,
      supportEmail: '',
      supportPhone: '',
      services: [],
      contacts: contractor.contacts.length > 0 ? contractor.contacts.map(contact => ({
        firstName: contact.firstName,
        lastName: contact.lastName,
        jobTitle: contact.jobTitle || '',
        department: contact.department || '',
        email: contact.email || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        whatsapp: contact.whatsapp || '',
        preferredContact: contact.preferredContact,
        isPrimary: contact.isPrimary,
        emergencyContact: contact.emergencyContact
      })) : [{
        firstName: '',
        lastName: '',
        jobTitle: '',
        department: '',
        email: '',
        phone: '',
        mobile: '',
        whatsapp: '',
        preferredContact: 'EMAIL',
        isPrimary: true,
        emergencyContact: false
      }]
    })
    setEditingContractor(contractor)
    setShowForm(true)
  }

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          firstName: '',
          lastName: '',
          jobTitle: '',
          department: '',
          email: '',
          phone: '',
          mobile: '',
          whatsapp: '',
          preferredContact: 'EMAIL',
          isPrimary: false,
          emergencyContact: false
        }
      ]
    }))
  }

  const removeContact = (index: number) => {
    if (formData.contacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        contacts: prev.contacts.filter((_, i) => i !== index)
      }))
    }
  }

  const updateContact = (index: number, field: string, value: any) => {
    let processedValue = value

    if (['phone', 'mobile', 'whatsapp'].includes(field)) {
      processedValue = formatPhoneNumber(value)
    }

    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) =>
        i === index ? { ...contact, [field]: processedValue } : contact
      )
    }))
  }

  const handleCountryChange = (country: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCountry: country,
      country: country,
      city: ''
    }))
    setAvailableCities(countriesWithCities[country as keyof typeof countriesWithCities] || [])
  }

  const handlePhoneChange = (field: string, value: string) => {
    const formattedValue = formatPhoneNumber(value)
    setFormData(prev => ({ ...prev, [field]: formattedValue }))
  }

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contractor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contractor.country?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !selectedType || contractor.type === selectedType

    return matchesSearch && matchesType
  })

  const typeStats = contractorTypes.map(type => ({
    ...type,
    count: contractors.filter(c => c.type === type.value).length
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
            <h1 className="text-3xl font-bold text-gray-900">Contractor Management</h1>
            <p className="text-gray-600 mt-2">
              Manage service providers and business partners
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
          >
            <span className="mr-2">➕</span>
            Add Contractor
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {typeStats.slice(0, 6).map((type) => (
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
              placeholder="Search contractors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {contractorTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingContractor ? 'Edit Contractor' : 'Add New Contractor'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contractor Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contractor Type *
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        {contractorTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Luxury Hotel, Budget Airline"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Star Rating
                      </label>
                      <select
                        value={formData.starRating}
                        onChange={(e) => setFormData(prev => ({ ...prev, starRating: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">No Rating</option>
                        <option value="1">⭐ 1 Star</option>
                        <option value="2">⭐⭐ 2 Stars</option>
                        <option value="3">⭐⭐⭐ 3 Stars</option>
                        <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                      </select>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        required
                        value={formData.selectedCountry}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Country</option>
                        {Object.keys(countriesWithCities).map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      {availableCities.length > 0 || formData.selectedCountry === 'Other' ? (
                        formData.selectedCountry === 'Other' ? (
                          <input
                            type="text"
                            placeholder="Enter city name"
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <select
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!formData.selectedCountry}
                          >
                            <option value="">Select City</option>
                            {availableCities.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        )
                      ) : (
                        <input
                          type="text"
                          placeholder={formData.selectedCountry ? "Loading cities..." : "Select country first"}
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={!formData.selectedCountry}
                        />
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Email
                      </label>
                      <input
                        type="email"
                        value={formData.mainEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, mainEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Phone (Numbers only)
                      </label>
                      <input
                        type="tel"
                        value={formData.mainPhone}
                        onChange={(e) => handlePhoneChange('mainPhone', e.target.value)}
                        placeholder="e.g., 971501234567"
                        pattern="[0-9]{7,15}"
                        title="Please enter only numbers (7-15 digits)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Contract Type and Emergency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contract Type
                      </label>
                      <select
                        value={formData.contractType}
                        onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="PREFERRED">Preferred Partner</option>
                        <option value="STANDARD">Standard</option>
                        <option value="TRIAL">Trial Period</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emergency24h"
                        checked={formData.emergency24h}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergency24h: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emergency24h" className="ml-2 text-sm font-medium text-gray-700">
                        24/7 Emergency Support Available
                      </label>
                    </div>
                  </div>

                  {/* Contact Persons */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Contact Persons</h3>
                      <button
                        type="button"
                        onClick={addContact}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        ➕ Add Contact
                      </button>
                    </div>

                    {formData.contacts.map((contact, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Contact {index + 1}</h4>
                          {formData.contacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContact(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ❌ Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="First Name"
                            value={contact.firstName}
                            onChange={(e) => updateContact(index, 'firstName', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={contact.lastName}
                            onChange={(e) => updateContact(index, 'lastName', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={contact.jobTitle}
                            onChange={(e) => updateContact(index, 'jobTitle', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={contact.email}
                            onChange={(e) => updateContact(index, 'email', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="tel"
                            placeholder="Phone (numbers only)"
                            value={contact.phone}
                            onChange={(e) => updateContact(index, 'phone', e.target.value)}
                            pattern="[0-9]{7,15}"
                            title="Please enter only numbers (7-15 digits)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="tel"
                            placeholder="Mobile (numbers only)"
                            value={contact.mobile}
                            onChange={(e) => updateContact(index, 'mobile', e.target.value)}
                            pattern="[0-9]{7,15}"
                            title="Please enter only numbers (7-15 digits)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <input
                            type="tel"
                            placeholder="WhatsApp (numbers only)"
                            value={contact.whatsapp}
                            onChange={(e) => updateContact(index, 'whatsapp', e.target.value)}
                            pattern="[0-9]{7,15}"
                            title="Please enter only numbers (7-15 digits)"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <select
                            value={contact.preferredContact}
                            onChange={(e) => updateContact(index, 'preferredContact', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="EMAIL">📧 Email</option>
                            <option value="PHONE">📞 Phone Call</option>
                            <option value="WHATSAPP">📱 WhatsApp</option>
                          </select>

                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={contact.isPrimary}
                                onChange={(e) => updateContact(index, 'isPrimary', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm">Primary Contact</span>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={contact.emergencyContact}
                                onChange={(e) => updateContact(index, 'emergencyContact', e.target.checked)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm">Emergency</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      {editingContractor ? 'Update Contractor' : 'Create Contractor'}
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

        {/* Contractors List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Contractors ({filteredContractors.length})
            </h3>

            {filteredContractors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedType ? 'Try adjusting your search filters' : 'Add your first contractor to get started.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContractors.map((contractor) => {
                  const typeInfo = contractorTypes.find(t => t.value === contractor.type)
                  return (
                    <div key={contractor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{typeInfo?.icon || '🏢'}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{contractor.name}</h4>
                            <p className="text-sm text-gray-500">{contractor.category || contractor.type}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {contractor.emergency24h && (
                            <span className="text-red-500 text-lg" title="24/7 Emergency">🚨</span>
                          )}
                          {contractor.starRating && (
                            <div className="flex">
                              {Array.from({ length: contractor.starRating }, (_, i) => (
                                <span key={i} className="text-yellow-400">⭐</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {contractor.city && contractor.country && (
                          <p className="text-sm text-gray-600">📍 {contractor.city}, {contractor.country}</p>
                        )}
                        {contractor.website && (
                          <p className="text-sm text-gray-600">🌐 {contractor.website}</p>
                        )}
                        {contractor.mainPhone && (
                          <p className="text-sm text-gray-600">📞 {contractor.mainPhone}</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          contractor.contractType === 'PREFERRED' ? 'bg-green-100 text-green-800' :
                          contractor.contractType === 'TRIAL' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {contractor.contractType || 'STANDARD'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {contractor.contacts.length} contact{contractor.contacts.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {contractor.contacts.slice(0, 2).map((contact) => (
                          <div key={contact.id} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="font-medium">{contact.firstName} {contact.lastName}</span>
                              {contact.isPrimary && <span className="ml-1 text-blue-600">👑</span>}
                              {contact.emergencyContact && <span className="ml-1 text-red-600">🚨</span>}
                              {contact.jobTitle && <span className="text-gray-500 ml-1">({contact.jobTitle})</span>}
                            </div>
                            <div className="flex space-x-1">
                              {contact.email && <span>📧</span>}
                              {contact.phone && <span>📞</span>}
                              {contact.whatsapp && <span>📱</span>}
                            </div>
                          </div>
                        ))}
                        {contractor.contacts.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{contractor.contacts.length - 2} more contact{contractor.contacts.length - 2 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleEdit(contractor)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
                      >
                        ✏️ Edit Contractor
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