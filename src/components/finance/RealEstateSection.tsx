'use client'

import { useState, useEffect } from 'react'
import { Building2, Plus, Edit, Trash2, MapPin, Home, X, LayoutDashboard, Layers, Eye, Users } from 'lucide-react'
import PropertyDashboard from './PropertyDashboard'
import PropertyPreview from './PropertyPreview'
import FlatUnitsManager from './FlatUnitsManager'

interface FlatType {
  id: number
  typeName: string
  description?: string
  bedrooms: number
  bathrooms: number
  totalArea?: number
  isFurnished: boolean
  includesUtilities: boolean
  facilityAccess?: string
  monthlyRate: number
  currency: string
  totalUnits?: number
  availableUnits?: number
}

interface RealEstate {
  id: number
  propertyName: string
  propertyType: string
  subType?: string
  address?: string
  city?: string
  country?: string
  currentValue?: number
  monthlyRent?: number
  status: string
  isRented: boolean
  tenantName?: string
  bedrooms?: number
  bathrooms?: number
  totalArea?: number
  totalFlats?: number
  currency: string
  flatTypes?: FlatType[]
}

interface Props {
  onRefresh: () => void
}

// Sub Type options based on Property Type
const subTypeOptions: Record<string, { value: string; label: string }[]> = {
  RESIDENTIAL: [
    { value: 'VILLA', label: 'Villa' },
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'BUILDING', label: 'Apartments Building' },
    { value: 'TOWNHOUSE', label: 'Townhouse' },
    { value: 'PENTHOUSE', label: 'Penthouse' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'DUPLEX', label: 'Duplex' },
    { value: 'COMPOUND', label: 'Compound' }
  ],
  COMMERCIAL: [
    { value: 'OFFICE', label: 'Office' },
    { value: 'OFFICE_BUILDING', label: 'Office Building' },
    { value: 'SHOP', label: 'Shop' },
    { value: 'RETAIL', label: 'Retail Space' },
    { value: 'MALL', label: 'Shopping Mall' },
    { value: 'WAREHOUSE', label: 'Warehouse' },
    { value: 'SHOWROOM', label: 'Showroom' }
  ],
  LAND: [
    { value: 'RESIDENTIAL_PLOT', label: 'Residential Plot' },
    { value: 'COMMERCIAL_PLOT', label: 'Commercial Plot' },
    { value: 'AGRICULTURAL', label: 'Agricultural Land' },
    { value: 'INDUSTRIAL_PLOT', label: 'Industrial Plot' }
  ],
  INDUSTRIAL: [
    { value: 'FACTORY', label: 'Factory' },
    { value: 'WAREHOUSE', label: 'Warehouse' },
    { value: 'WORKSHOP', label: 'Workshop' },
    { value: 'LABOR_CAMP', label: 'Labor Camp' }
  ],
  MIXED_USE: [
    { value: 'MIXED_BUILDING', label: 'Mixed Use Building' },
    { value: 'COMMERCIAL_RESIDENTIAL', label: 'Commercial & Residential' }
  ]
}

// Building sub types that require flat type management
const buildingSubTypes = ['BUILDING', 'OFFICE_BUILDING', 'MIXED_BUILDING', 'COMPOUND', 'LABOR_CAMP']

export default function RealEstateSection({ onRefresh }: Props) {
  const [properties, setProperties] = useState<RealEstate[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<RealEstate | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add')
  const [showDashboard, setShowDashboard] = useState(false)
  const [dashboardProperty, setDashboardProperty] = useState<RealEstate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewProperty, setPreviewProperty] = useState<RealEstate | null>(null)
  const [showFlatUnits, setShowFlatUnits] = useState(false)
  const [selectedFlatType, setSelectedFlatType] = useState<FlatType | null>(null)
  const [flatUnitsPropertyId, setFlatUnitsPropertyId] = useState<number | null>(null)

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finance/real-estate')
      const result = await response.json()
      if (result.success) {
        setProperties(result.data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await fetch(`/api/finance/real-estate/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        fetchProperties()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const formatCurrency = (amount: number | undefined | null, currency = 'USD') => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const isBuilding = (subType?: string) => subType && buildingSubTypes.includes(subType)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Real Estate Portfolio</h2>
          <p className="text-sm text-gray-500">{properties.length} properties</p>
        </div>
        <button
          onClick={() => {
            setSelectedProperty(null)
            setFormMode('add')
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Property Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No properties added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Property" to add your first property</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isBuilding(property.subType) ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {isBuilding(property.subType) ? (
                      <Building2 className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Home className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{property.propertyName}</h3>
                    <p className="text-xs text-gray-500">{property.subType || property.propertyType}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    property.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : property.status === 'SOLD'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {property.status}
                </span>
              </div>

              {(property.city || property.country) && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  {[property.city, property.country].filter(Boolean).join(', ')}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Value</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(property.currentValue, property.currency)}
                  </p>
                </div>
                {property.isRented && (
                  <div>
                    <p className="text-gray-500">Monthly Rent</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(property.monthlyRent, property.currency)}
                    </p>
                  </div>
                )}
                {isBuilding(property.subType) && property.totalFlats && (
                  <div>
                    <p className="text-gray-500">Total Flats</p>
                    <p className="font-semibold text-purple-600">{property.totalFlats}</p>
                  </div>
                )}
                {isBuilding(property.subType) && property.flatTypes && property.flatTypes.length > 0 && (
                  <div>
                    <p className="text-gray-500">Flat Types</p>
                    <p className="font-semibold text-purple-600">{property.flatTypes.length}</p>
                  </div>
                )}
                {!isBuilding(property.subType) && property.bedrooms && (
                  <div>
                    <p className="text-gray-500">Beds/Baths</p>
                    <p className="font-semibold text-gray-900">
                      {property.bedrooms} / {property.bathrooms || 0}
                    </p>
                  </div>
                )}
                {property.totalArea && (
                  <div>
                    <p className="text-gray-500">Area</p>
                    <p className="font-semibold text-gray-900">{property.totalArea} sqm</p>
                  </div>
                )}
              </div>

              {property.isRented && property.tenantName && (
                <p className="text-xs text-gray-500 mb-3">
                  Tenant: <span className="font-medium">{property.tenantName}</span>
                </p>
              )}

              <div className="flex items-center gap-2 pt-3 border-t">
                <button
                  onClick={() => {
                    setPreviewProperty(property)
                    setShowPreview(true)
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                  title="Preview & Print"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => {
                    setDashboardProperty(property)
                    setShowDashboard(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setSelectedProperty(property)
                    setFormMode('edit')
                    setShowForm(true)
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Property"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <RealEstateForm
          property={selectedProperty}
          mode={formMode}
          onClose={() => {
            setShowForm(false)
            setSelectedProperty(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedProperty(null)
            fetchProperties()
            onRefresh()
          }}
        />
      )}

      {/* Property Dashboard Modal */}
      {showDashboard && dashboardProperty && (
        <PropertyDashboard
          property={dashboardProperty}
          onClose={() => {
            setShowDashboard(false)
            setDashboardProperty(null)
          }}
          onRefresh={() => {
            fetchProperties()
            onRefresh()
          }}
        />
      )}

      {/* Property Preview Modal */}
      {showPreview && previewProperty && (
        <PropertyPreview
          property={previewProperty}
          onClose={() => {
            setShowPreview(false)
            setPreviewProperty(null)
          }}
        />
      )}

      {/* Flat Units Manager Modal */}
      {showFlatUnits && selectedFlatType && flatUnitsPropertyId && (
        <FlatUnitsManager
          propertyId={flatUnitsPropertyId}
          flatType={selectedFlatType}
          onClose={() => {
            setShowFlatUnits(false)
            setSelectedFlatType(null)
            setFlatUnitsPropertyId(null)
          }}
        />
      )}
    </div>
  )
}

interface FormProps {
  property: RealEstate | null
  mode: 'add' | 'edit' | 'view'
  onClose: () => void
  onSuccess: () => void
}

function RealEstateForm({ property, mode, onClose, onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    propertyName: property?.propertyName || '',
    propertyType: property?.propertyType || 'RESIDENTIAL',
    subType: property?.subType || '',
    address: property?.address || '',
    city: property?.city || '',
    country: property?.country || '',
    currentValue: property?.currentValue || '',
    monthlyRent: property?.monthlyRent || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    totalArea: property?.totalArea || '',
    totalFlats: property?.totalFlats || '',
    isRented: property?.isRented || false,
    tenantName: property?.tenantName || '',
    status: property?.status || 'ACTIVE',
    currency: property?.currency || 'USD'
  })
  const [saving, setSaving] = useState(false)
  const [flatTypes, setFlatTypes] = useState<FlatType[]>(property?.flatTypes || [])
  const [showFlatTypeForm, setShowFlatTypeForm] = useState(false)
  const [editingFlatType, setEditingFlatType] = useState<FlatType | null>(null)
  const [showUnitsManager, setShowUnitsManager] = useState(false)
  const [selectedFlatTypeForUnits, setSelectedFlatTypeForUnits] = useState<FlatType | null>(null)

  const isBuilding = buildingSubTypes.includes(formData.subType)
  const currentSubTypes = subTypeOptions[formData.propertyType] || []

  // Fetch flat types when editing an existing property
  useEffect(() => {
    if (property?.id && isBuilding) {
      fetchFlatTypes()
    }
  }, [property?.id])

  const fetchFlatTypes = async () => {
    if (!property?.id) return
    try {
      const response = await fetch(`/api/finance/real-estate/${property.id}/flat-types`)
      const result = await response.json()
      if (result.success) {
        setFlatTypes(result.data)
      }
    } catch (error) {
      console.error('Error fetching flat types:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') return

    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/finance/real-estate/${property?.id}` : '/api/finance/real-estate'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentValue: formData.currentValue ? parseFloat(String(formData.currentValue)) : null,
          monthlyRent: formData.monthlyRent ? parseFloat(String(formData.monthlyRent)) : null,
          bedrooms: formData.bedrooms ? parseInt(String(formData.bedrooms)) : null,
          bathrooms: formData.bathrooms ? parseInt(String(formData.bathrooms)) : null,
          totalArea: formData.totalArea ? parseFloat(String(formData.totalArea)) : null,
          totalFlats: formData.totalFlats ? parseInt(String(formData.totalFlats)) : null
        })
      })

      const result = await response.json()
      if (result.success) {
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving property:', error)
      alert('Error saving property')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteFlatType = async (flatTypeId: number) => {
    if (!confirm('Are you sure you want to delete this flat type?')) return
    try {
      const response = await fetch(`/api/finance/real-estate/${property?.id}/flat-types/${flatTypeId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchFlatTypes()
      }
    } catch (error) {
      console.error('Error deleting flat type:', error)
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Property' : mode === 'edit' ? 'Edit Property' : 'Property Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
              <select
                required
                disabled={isReadOnly}
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value, subType: '' })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="LAND">Land</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="MIXED_USE">Mixed Use</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Type</label>
              <select
                disabled={isReadOnly}
                value={formData.subType}
                onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Sub Type</option>
                {currentSubTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                disabled={isReadOnly}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="QAR">QAR</option>
              </select>
            </div>

            {/* Building-specific fields */}
            {isBuilding && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Flats</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={formData.totalFlats}
                  onChange={(e) => setFormData({ ...formData, totalFlats: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Number of flats in building"
                />
              </div>
            )}

            {/* Non-building fields */}
            {!isBuilding && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    disabled={isReadOnly}
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    disabled={isReadOnly}
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Area (sqm)</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formData.totalArea}
                onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                disabled={isReadOnly}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="SOLD">Sold</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="UNDER_RENOVATION">Under Renovation</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={isReadOnly}
                  checked={formData.isRented}
                  onChange={(e) => setFormData({ ...formData, isRented: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Property is Rented</span>
              </label>
            </div>

            {formData.isRented && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                  <input
                    type="number"
                    disabled={isReadOnly}
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </>
            )}
          </div>

          {/* Flat Types Section - Only for buildings in edit mode */}
          {isBuilding && mode === 'edit' && property?.id && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Flat Types
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingFlatType(null)
                    setShowFlatTypeForm(true)
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Flat Type
                </button>
              </div>

              {flatTypes.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed">
                  <Layers className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No flat types defined</p>
                  <p className="text-xs text-gray-400 mt-1">Add flat types to describe different unit configurations</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {flatTypes.map((ft) => {
                    const facilities = ft.facilityAccess ? JSON.parse(ft.facilityAccess) : []
                    return (
                      <div key={ft.id} className="bg-gray-50 rounded-lg p-4 border hover:border-purple-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{ft.typeName}</h4>
                            <p className="text-sm text-gray-500">
                              {ft.bedrooms} bed • {ft.bathrooms} bath
                              {ft.totalArea && ` • ${ft.totalArea} sqm`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-purple-600">
                              {ft.currency} {ft.monthlyRate.toLocaleString()}/mo
                            </p>
                            {ft.totalUnits !== null && ft.totalUnits !== undefined && (
                              <p className="text-xs text-gray-500">
                                {ft.availableUnits || 0}/{ft.totalUnits} available
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {ft.isFurnished && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Furnished</span>
                          )}
                          {ft.includesUtilities && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Utilities Included</span>
                          )}
                          {facilities.map((f: string) => (
                            <span key={f} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">{f}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFlatTypeForUnits(ft)
                              setShowUnitsManager(true)
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Users className="w-4 h-4" />
                            Manage Units ({ft.totalUnits || 0})
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFlatType(ft)
                                setShowFlatTypeForm(true)
                              }}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFlatType(ft.id)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {!isReadOnly && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : mode === 'edit' ? 'Update Property' : 'Add Property'}
              </button>
            </div>
          )}
        </form>

        {/* Flat Type Form Modal */}
        {showFlatTypeForm && property?.id && (
          <FlatTypeForm
            propertyId={property.id}
            flatType={editingFlatType}
            onClose={() => {
              setShowFlatTypeForm(false)
              setEditingFlatType(null)
            }}
            onSuccess={() => {
              setShowFlatTypeForm(false)
              setEditingFlatType(null)
              fetchFlatTypes()
            }}
          />
        )}

        {/* Flat Units Manager Modal */}
        {showUnitsManager && selectedFlatTypeForUnits && property?.id && (
          <FlatUnitsManager
            propertyId={property.id}
            flatType={selectedFlatTypeForUnits}
            onClose={() => {
              setShowUnitsManager(false)
              setSelectedFlatTypeForUnits(null)
              fetchFlatTypes() // Refresh to update counts
            }}
          />
        )}
      </div>
    </div>
  )
}

interface FlatTypeFormProps {
  propertyId: number
  flatType: FlatType | null
  onClose: () => void
  onSuccess: () => void
}

function FlatTypeForm({ propertyId, flatType, onClose, onSuccess }: FlatTypeFormProps) {
  const facilityOptions = [
    { value: 'POOL', label: 'Pool' },
    { value: 'GYM', label: 'Gym' },
    { value: 'PARKING', label: 'Parking' },
    { value: 'GARDEN', label: 'Garden' },
    { value: 'SECURITY', label: '24/7 Security' },
    { value: 'PLAYGROUND', label: 'Playground' },
    { value: 'LAUNDRY', label: 'Laundry Room' },
    { value: 'STORAGE', label: 'Storage' },
    { value: 'BALCONY', label: 'Balcony' },
    { value: 'TERRACE', label: 'Terrace' }
  ]

  const existingFacilities = flatType?.facilityAccess ? JSON.parse(flatType.facilityAccess) : []

  const [formData, setFormData] = useState({
    typeName: flatType?.typeName || '',
    description: flatType?.description || '',
    bedrooms: flatType?.bedrooms || 1,
    bathrooms: flatType?.bathrooms || 1,
    totalArea: flatType?.totalArea || '',
    isFurnished: flatType?.isFurnished || false,
    includesUtilities: flatType?.includesUtilities || false,
    facilityAccess: existingFacilities as string[],
    monthlyRate: flatType?.monthlyRate || '',
    currency: flatType?.currency || 'QAR',
    totalUnits: flatType?.totalUnits || '',
    availableUnits: flatType?.availableUnits || ''
  })
  const [saving, setSaving] = useState(false)

  const handleFacilityChange = (facility: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, facilityAccess: [...formData.facilityAccess, facility] })
    } else {
      setFormData({ ...formData, facilityAccess: formData.facilityAccess.filter(f => f !== facility) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = flatType
        ? `/api/finance/real-estate/${propertyId}/flat-types/${flatType.id}`
        : `/api/finance/real-estate/${propertyId}/flat-types`
      const method = flatType ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalArea: formData.totalArea ? parseFloat(String(formData.totalArea)) : null,
          monthlyRate: parseFloat(String(formData.monthlyRate)),
          totalUnits: formData.totalUnits ? parseInt(String(formData.totalUnits)) : null,
          availableUnits: formData.availableUnits ? parseInt(String(formData.availableUnits)) : null
        })
      })

      if (response.ok) {
        onSuccess()
      } else {
        const result = await response.json()
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving flat type:', error)
      alert('Error saving flat type')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {flatType ? 'Edit Flat Type' : 'Add Flat Type'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type Name *</label>
            <input
              type="text"
              required
              value={formData.typeName}
              onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
              placeholder="e.g., 1BR Standard, 2BR Deluxe, Studio"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Area (sqm)</label>
            <input
              type="number"
              value={formData.totalArea}
              onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate *</label>
              <input
                type="number"
                required
                value={formData.monthlyRate}
                onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="QAR">QAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
              <input
                type="number"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                placeholder="How many of this type"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Units</label>
              <input
                type="number"
                value={formData.availableUnits}
                onChange={(e) => setFormData({ ...formData, availableUnits: e.target.value })}
                placeholder="Currently available"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFurnished}
                onChange={(e) => setFormData({ ...formData, isFurnished: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Furnished</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.includesUtilities}
                onChange={(e) => setFormData({ ...formData, includesUtilities: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Includes Utilities (Water, Electricity)</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facility Access</label>
            <div className="grid grid-cols-2 gap-2">
              {facilityOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.facilityAccess.includes(opt.value)}
                    onChange={(e) => handleFacilityChange(opt.value, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : flatType ? 'Update Flat Type' : 'Add Flat Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
