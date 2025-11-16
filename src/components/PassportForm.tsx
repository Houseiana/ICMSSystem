'use client'

import { useState, useEffect } from 'react'

interface PassportFormProps {
  isOpen: boolean
  onClose: () => void
  passport?: any
  mode: 'view' | 'edit' | 'create'
  onSave: (data: any) => void
  loading?: boolean
  entities: any[]
  entitiesLoading: boolean
}

export default function PassportForm({
  isOpen,
  onClose,
  passport,
  mode,
  onSave,
  loading,
  entities,
  entitiesLoading
}: PassportFormProps) {
  const [formData, setFormData] = useState({
    // Owner Information
    ownerType: '',
    ownerId: '',
    ownerName: '',
    ownerEmail: '',
    ownerNationality: '',

    // Passport Information
    passportNumber: '',
    issuingCountry: '',
    countryIcon: '',
    issuanceDate: '',
    expiryDate: '',
    issueLocation: '',
    passportType: 'REGULAR',

    // Personal Information (from passport)
    firstNameOnPassport: '',
    lastNameOnPassport: '',
    fullNameOnPassport: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    height: '',
    eyeColor: '',

    // Passport Status
    status: 'ACTIVE',
    isActive: true,

    // Physical Passport Location Tracking
    currentLocation: 'WITH_OWNER',
    locationDetails: '',
    locationNotes: '',

    // Location Change Tracking (for history)
    changeReason: '',
    receivedBy: '',
    handedBy: '',
    deliveryDate: '',
    deliveryTime: '',

    // Representative Information
    withMainRepresentative: false,
    mainRepresentativeName: '',
    mainRepresentativeContact: '',
    mainRepresentativeNotes: '',

    withMinorRepresentative: false,
    minorRepresentativeName: '',
    minorRepresentativeContact: '',
    minorRepresentativeNotes: '',

    // Security Features
    machineReadableZone: '',
    chipEnabled: false,
    biometricData: false,
    securityFeatures: '',

    // Visa Pages & Stamps
    totalPages: 32,
    usedPages: 0,
    availablePages: 32,
    lastStampDate: '',
    lastStampCountry: '',

    // Renewal Information
    renewalEligible: false,
    renewalBefore: '',
    renewalProcess: '',
    renewalLocation: '',
    renewalFee: '',
    renewalFeeCurrency: 'USD',

    // Emergency Information
    emergencyContact: '',
    bloodType: '',
    medicalConditions: '',
    emergencyNotes: '',

    // Internal Notes
    publicNotes: '',
    privateNotes: '',
    alerts: '',
    tags: ''
  })

  useEffect(() => {
    if (passport && mode !== 'create') {
      setFormData({
        ownerType: passport.ownerType || '',
        ownerId: passport.ownerId?.toString() || '',
        ownerName: passport.ownerName || '',
        ownerEmail: passport.ownerEmail || '',
        ownerNationality: passport.ownerNationality || '',

        passportNumber: passport.passportNumber || '',
        issuingCountry: passport.issuingCountry || '',
        countryIcon: passport.countryIcon || '',
        issuanceDate: passport.issuanceDate ? passport.issuanceDate.split('T')[0] : '',
        expiryDate: passport.expiryDate ? passport.expiryDate.split('T')[0] : '',
        issueLocation: passport.issueLocation || '',
        passportType: passport.passportType || 'REGULAR',

        firstNameOnPassport: passport.firstNameOnPassport || '',
        lastNameOnPassport: passport.lastNameOnPassport || '',
        fullNameOnPassport: passport.fullNameOnPassport || '',
        dateOfBirth: passport.dateOfBirth ? passport.dateOfBirth.split('T')[0] : '',
        placeOfBirth: passport.placeOfBirth || '',
        gender: passport.gender || '',
        height: passport.height || '',
        eyeColor: passport.eyeColor || '',

        status: passport.status || 'ACTIVE',
        isActive: passport.isActive !== undefined ? passport.isActive : true,

        currentLocation: passport.currentLocation || 'WITH_OWNER',
        locationDetails: passport.locationDetails || '',
        locationNotes: passport.locationNotes || '',

        // Location Change Tracking (for edit mode only)
        changeReason: '',
        receivedBy: '',
        handedBy: '',
        deliveryDate: '',
        deliveryTime: '',

        withMainRepresentative: passport.withMainRepresentative || false,
        mainRepresentativeName: passport.mainRepresentativeName || '',
        mainRepresentativeContact: passport.mainRepresentativeContact || '',
        mainRepresentativeNotes: passport.mainRepresentativeNotes || '',

        withMinorRepresentative: passport.withMinorRepresentative || false,
        minorRepresentativeName: passport.minorRepresentativeName || '',
        minorRepresentativeContact: passport.minorRepresentativeContact || '',
        minorRepresentativeNotes: passport.minorRepresentativeNotes || '',

        machineReadableZone: passport.machineReadableZone || '',
        chipEnabled: passport.chipEnabled || false,
        biometricData: passport.biometricData || false,
        securityFeatures: passport.securityFeatures || '',

        totalPages: passport.totalPages || 32,
        usedPages: passport.usedPages || 0,
        availablePages: passport.availablePages || 32,
        lastStampDate: passport.lastStampDate ? passport.lastStampDate.split('T')[0] : '',
        lastStampCountry: passport.lastStampCountry || '',

        renewalEligible: passport.renewalEligible || false,
        renewalBefore: passport.renewalBefore ? passport.renewalBefore.split('T')[0] : '',
        renewalProcess: passport.renewalProcess || '',
        renewalLocation: passport.renewalLocation || '',
        renewalFee: passport.renewalFee?.toString() || '',
        renewalFeeCurrency: passport.renewalFeeCurrency || 'USD',

        emergencyContact: passport.emergencyContact || '',
        bloodType: passport.bloodType || '',
        medicalConditions: passport.medicalConditions || '',
        emergencyNotes: passport.emergencyNotes || '',

        publicNotes: passport.publicNotes || '',
        privateNotes: passport.privateNotes || '',
        alerts: passport.alerts || '',
        tags: passport.tags || ''
      })
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        ownerType: '',
        ownerId: '',
        ownerName: '',
        ownerEmail: '',
        ownerNationality: '',

        passportNumber: '',
        issuingCountry: '',
        countryIcon: '',
        issuanceDate: '',
        expiryDate: '',
        issueLocation: '',
        passportType: 'REGULAR',

        firstNameOnPassport: '',
        lastNameOnPassport: '',
        fullNameOnPassport: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        height: '',
        eyeColor: '',

        status: 'ACTIVE',
        isActive: true,

        currentLocation: 'WITH_OWNER',
        locationDetails: '',
        locationNotes: '',

        // Location Change Tracking (reset)
        changeReason: '',
        receivedBy: '',
        handedBy: '',
        deliveryDate: '',
        deliveryTime: '',

        withMainRepresentative: false,
        mainRepresentativeName: '',
        mainRepresentativeContact: '',
        mainRepresentativeNotes: '',

        withMinorRepresentative: false,
        minorRepresentativeName: '',
        minorRepresentativeContact: '',
        minorRepresentativeNotes: '',

        machineReadableZone: '',
        chipEnabled: false,
        biometricData: false,
        securityFeatures: '',

        totalPages: 32,
        usedPages: 0,
        availablePages: 32,
        lastStampDate: '',
        lastStampCountry: '',

        renewalEligible: false,
        renewalBefore: '',
        renewalProcess: '',
        renewalLocation: '',
        renewalFee: '',
        renewalFeeCurrency: 'USD',

        emergencyContact: '',
        bloodType: '',
        medicalConditions: '',
        emergencyNotes: '',

        publicNotes: '',
        privateNotes: '',
        alerts: '',
        tags: ''
      })
    }
  }, [passport, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleEntitySelect = (entityId: string) => {
    const entity = entities.find(e => e.id.toString() === entityId)
    if (entity) {
      setFormData(prev => ({
        ...prev,
        ownerType: entity.type,
        ownerId: entity.id.toString(),
        ownerName: entity.name,
        ownerEmail: entity.email || '',
        ownerNationality: entity.nationality || ''
      }))
    }
  }

  if (!isOpen) return null

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Brazil', 'Bulgaria', 'Cambodia', 'Canada',
    'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Estonia',
    'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hungary', 'Iceland', 'India',
    'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia',
    'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Norway', 'Pakistan', 'Philippines', 'Poland',
    'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia',
    'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey',
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam'
  ]

  const locationOptions = [
    { value: 'WITH_OWNER', label: 'With Owner' },
    { value: 'AT_OFFICE', label: 'At Office' },
    { value: 'AT_HOME', label: 'At Home' },
    { value: 'WITH_MAIN_REPRESENTATIVE', label: 'With Main Representative' },
    { value: 'WITH_MINOR_REPRESENTATIVE', label: 'With Minor Representative' },
    { value: 'AT_EMBASSY', label: 'At Embassy' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'LOST', label: 'Lost' },
    { value: 'UNKNOWN', label: 'Unknown' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === 'view' && '👁️ Passport Details'}
            {mode === 'edit' && '✏️ Edit Passport'}
            {mode === 'create' && '📘 Add New Passport'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-160px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Entity Selection - Only for create mode */}
            {mode === 'create' && (
              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">👤</span> Select Entity
                </h3>
                {entitiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-blue-700">Loading entities...</span>
                  </div>
                ) : entities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-blue-700 font-medium">No entities available</p>
                    <p className="text-blue-600 text-sm mt-1">Please add employees, employers, or stakeholders first</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entities.map((entity) => (
                      <div
                        key={`${entity.type}-${entity.id}`}
                        onClick={() => handleEntitySelect(entity.id.toString())}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.ownerId === entity.id.toString()
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                            <span className="text-sm">
                              {entity.type === 'EMPLOYEE' && '👥'}
                              {entity.type === 'EMPLOYER' && '🏢'}
                              {entity.type === 'STAKEHOLDER' && '🤝'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{entity.name}</p>
                            <p className="text-xs text-gray-500">{entity.identifier}</p>
                            {entity.email && (
                              <p className="text-xs text-gray-500 truncate">{entity.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Owner Information - Display for edit/view modes */}
            {mode !== 'create' && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👤</span> Owner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Type</label>
                    <input
                      type="text"
                      value={formData.ownerType}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.ownerEmail}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Passport Information */}
            <div className="border-2 border-red-200 bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-4 flex items-center">
                <span className="mr-2">📘</span> Passport Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number *</label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="A12345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Country *</label>
                  <select
                    name="issuingCountry"
                    value={formData.issuingCountry}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passport Type</label>
                  <select
                    name="passportType"
                    value={formData.passportType}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="DIPLOMATIC">Diplomatic</option>
                    <option value="OFFICIAL">Official</option>
                    <option value="SERVICE">Service</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuance Date *</label>
                  <input
                    type="date"
                    name="issuanceDate"
                    value={formData.issuanceDate}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Location</label>
                  <input
                    type="text"
                    name="issueLocation"
                    value={formData.issueLocation}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information from Passport */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👤</span> Personal Information (from Passport)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name on Passport *</label>
                  <input
                    type="text"
                    name="firstNameOnPassport"
                    value={formData.firstNameOnPassport}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name on Passport *</label>
                  <input
                    type="text"
                    name="lastNameOnPassport"
                    value={formData.lastNameOnPassport}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="e.g., 175 cm"
                  />
                </div>
              </div>
            </div>

            {/* Location Tracking */}
            <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-orange-800 mb-4 flex items-center">
                <span className="mr-2">📍</span> Location Tracking
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Location *</label>
                  <select
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    {locationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Details</label>
                  <input
                    type="text"
                    name="locationDetails"
                    value={formData.locationDetails}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="Specific location details"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Notes</label>
                  <input
                    type="text"
                    name="locationNotes"
                    value={formData.locationNotes}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="Additional notes about location"
                  />
                </div>
              </div>

              {/* Location Change Tracking - Only show in edit mode */}
              {mode === 'edit' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-md font-medium text-yellow-800 mb-4 flex items-center">
                    <span className="mr-2">📋</span> Location Change Details (Optional)
                  </h4>
                  <p className="text-sm text-yellow-700 mb-4">
                    If you're changing the location, please provide delivery/receive details for tracking history.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Change Reason</label>
                      <input
                        type="text"
                        name="changeReason"
                        value={formData.changeReason}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Visa application, Travel, Office visit"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Received By</label>
                      <input
                        type="text"
                        name="receivedBy"
                        value={formData.receivedBy}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Person who received the passport"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Handed By</label>
                      <input
                        type="text"
                        name="handedBy"
                        value={formData.handedBy}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Person who handed over the passport"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                      <input
                        type="time"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location History - Only show in view mode */}
              {mode === 'view' && passport && passport.locationHistory && passport.locationHistory.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📜</span> Location History
                  </h4>
                  <div className="space-y-3">
                    {passport.locationHistory.map((history: any, index: number) => (
                      <div key={history.id} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {history.fromLocation ? `${history.fromLocation} → ` : ''}{history.toLocation}
                            </span>
                            {history.deliveryConfirmed && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                ✓ Confirmed
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(history.changeDate).toLocaleDateString()} {new Date(history.changeDate).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          {history.changeReason && (
                            <div><span className="font-medium">Reason:</span> {history.changeReason}</div>
                          )}
                          {history.handedBy && (
                            <div><span className="font-medium">Handed by:</span> {history.handedBy}</div>
                          )}
                          {history.receivedBy && (
                            <div><span className="font-medium">Received by:</span> {history.receivedBy}</div>
                          )}
                          {history.actualDelivery && (
                            <div><span className="font-medium">Delivered:</span> {new Date(history.actualDelivery).toLocaleDateString()} {new Date(history.actualDelivery).toLocaleTimeString()}</div>
                          )}
                          {history.changedBy && (
                            <div><span className="font-medium">Updated by:</span> {history.changedBy}</div>
                          )}
                        </div>

                        {history.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {history.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Representative Information */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="withMainRepresentative"
                      checked={formData.withMainRepresentative}
                      onChange={handleChange}
                      disabled={mode === 'view'}
                      className="mr-2"
                    />
                    With Main Representative
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="withMinorRepresentative"
                      checked={formData.withMinorRepresentative}
                      onChange={handleChange}
                      disabled={mode === 'view'}
                      className="mr-2"
                    />
                    With Minor Representative
                  </label>
                </div>

                {formData.withMainRepresentative && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded border">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Rep. Name</label>
                      <input
                        type="text"
                        name="mainRepresentativeName"
                        value={formData.mainRepresentativeName}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Rep. Contact</label>
                      <input
                        type="text"
                        name="mainRepresentativeContact"
                        value={formData.mainRepresentativeContact}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Rep. Notes</label>
                      <input
                        type="text"
                        name="mainRepresentativeNotes"
                        value={formData.mainRepresentativeNotes}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                )}

                {formData.withMinorRepresentative && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded border">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minor Rep. Name</label>
                      <input
                        type="text"
                        name="minorRepresentativeName"
                        value={formData.minorRepresentativeName}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minor Rep. Contact</label>
                      <input
                        type="text"
                        name="minorRepresentativeContact"
                        value={formData.minorRepresentativeContact}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minor Rep. Notes</label>
                      <input
                        type="text"
                        name="minorRepresentativeNotes"
                        value={formData.minorRepresentativeNotes}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Passport Status and Pages */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📊</span> Status & Pages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="LOST">Lost</option>
                    <option value="STOLEN">Stolen</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="DAMAGED">Damaged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Pages</label>
                  <input
                    type="number"
                    name="totalPages"
                    value={formData.totalPages}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Used Pages</label>
                  <input
                    type="number"
                    name="usedPages"
                    value={formData.usedPages}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Pages</label>
                  <input
                    type="number"
                    name="availablePages"
                    value={formData.totalPages - formData.usedPages}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📝</span> Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Public Notes</label>
                  <textarea
                    name="publicNotes"
                    value={formData.publicNotes}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="Notes visible to all staff"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Private Notes</label>
                  <textarea
                    name="privateNotes"
                    value={formData.privateNotes}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    placeholder="Private notes for management only"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode !== 'view' && (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || (mode === 'create' && !formData.ownerType)}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : mode === 'edit' ? 'Update Passport' : 'Create Passport'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}