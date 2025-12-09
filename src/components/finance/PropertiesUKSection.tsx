'use client'

import { useState, useEffect } from 'react'
import { Building2, Plus, Edit, Trash2, MapPin, X, Home, Users, LayoutDashboard } from 'lucide-react'
import PropertyUKDashboard from './PropertyUKDashboard'

interface PropertyUKData {
  id: number
  propertyName: string
  propertyType: string
  subType?: string
  address?: string
  city?: string
  postcode?: string
  ownershipType: string
  purchasePrice?: number
  currentValue?: number
  currency: string
  bedrooms?: number
  bathrooms?: number
  monthlyRent?: number
  hasMortgage: boolean
  mortgageBalance?: number
  monthlyPayment?: number
  isRented: boolean
  tenantName?: string
  epcRating?: string
  councilTaxBand?: string
  status: string
  tenants?: Array<{
    id: number
    tenantName: string
    rentAmount: number
    contractEndDate: string
    status: string
  }>
}

interface Props {
  onRefresh: () => void
}

export default function PropertiesUKSection({ onRefresh }: Props) {
  const [properties, setProperties] = useState<PropertyUKData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyUKData | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
  const [showDashboard, setShowDashboard] = useState(false)
  const [dashboardProperty, setDashboardProperty] = useState<PropertyUKData | null>(null)

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finance/properties-uk')
      const result = await response.json()
      if (result.success) {
        setProperties(result.data)
      }
    } catch (error) {
      console.error('Error fetching UK properties:', error)
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
      const response = await fetch(`/api/finance/properties-uk?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchProperties()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting UK property:', error)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'SOLD': return 'bg-gray-100 text-gray-800'
      case 'VACANT': return 'bg-yellow-100 text-yellow-800'
      case 'UNDER_RENOVATION': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL': return '🏠'
      case 'COMMERCIAL': return '🏢'
      case 'LAND': return '🌳'
      default: return '🏘️'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading UK properties...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Properties in UK</h2>
          <p className="text-sm text-gray-500">Manage your UK property portfolio</p>
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
          Add UK Property
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Total Properties</p>
          <p className="text-2xl font-bold text-gray-800">{properties.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(
              properties.reduce((sum, p) => sum + (p.currentValue || p.purchasePrice || 0), 0),
              'GBP'
            )}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Rented Out</p>
          <p className="text-2xl font-bold text-green-600">
            {properties.filter(p => p.isRented).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Monthly Rental Income</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(
              properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0),
              'GBP'
            )}
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No UK properties added yet</p>
          <button
            onClick={() => {
              setSelectedProperty(null)
              setFormMode('add')
              setShowForm(true)
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Add your first UK property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getPropertyIcon(property.propertyType)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{property.propertyName}</h3>
                      <p className="text-sm text-gray-500">{property.subType || property.propertyType}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {(property.address || property.postcode) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{property.address || property.city}, {property.postcode}</span>
                    </div>
                  )}

                  {(property.bedrooms || property.bathrooms) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Home className="w-4 h-4" />
                      <span>
                        {property.bedrooms && `${property.bedrooms} bed`}
                        {property.bedrooms && property.bathrooms && ' • '}
                        {property.bathrooms && `${property.bathrooms} bath`}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {property.ownershipType}
                    </span>
                    {property.epcRating && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        EPC: {property.epcRating}
                      </span>
                    )}
                    {property.councilTaxBand && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Band {property.councilTaxBand}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Current Value</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatCurrency(property.currentValue || property.purchasePrice || 0, property.currency)}
                      </p>
                    </div>
                    {property.isRented && property.monthlyRent && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Monthly Rent</p>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(property.monthlyRent, property.currency)}
                        </p>
                      </div>
                    )}
                  </div>
                  {property.hasMortgage && property.mortgageBalance && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Mortgage Balance</p>
                      <p className="text-sm font-medium text-orange-600">
                        {formatCurrency(property.mortgageBalance, property.currency)}
                      </p>
                    </div>
                  )}
                </div>

                {property.isRented && property.tenantName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-3 pt-3 border-t">
                    <Users className="w-4 h-4" />
                    <span>Tenant: {property.tenantName}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t mt-3">
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
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <PropertyUKForm
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
        <PropertyUKDashboard
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
    </div>
  )
}

interface FormProps {
  property: PropertyUKData | null
  mode: 'add' | 'edit'
  onClose: () => void
  onSuccess: () => void
}

function PropertyUKForm({ property, mode, onClose, onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    propertyName: property?.propertyName || '',
    propertyType: property?.propertyType || 'RESIDENTIAL',
    subType: property?.subType || '',
    address: property?.address || '',
    city: property?.city || 'London',
    postcode: property?.postcode || '',
    ownershipType: property?.ownershipType || 'FREEHOLD',
    purchasePrice: property?.purchasePrice || '',
    currentValue: property?.currentValue || '',
    currency: property?.currency || 'GBP',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    monthlyRent: property?.monthlyRent || '',
    hasMortgage: property?.hasMortgage || false,
    mortgageBalance: property?.mortgageBalance || '',
    monthlyPayment: property?.monthlyPayment || '',
    isRented: property?.isRented || false,
    tenantName: property?.tenantName || '',
    epcRating: property?.epcRating || '',
    councilTaxBand: property?.councilTaxBand || '',
    status: property?.status || 'ACTIVE'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = '/api/finance/properties-uk'
      const method = mode === 'add' ? 'POST' : 'PUT'
      const body = mode === 'add' ? formData : { id: property?.id, ...formData }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error saving UK property:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">
            {mode === 'add' ? 'Add New UK Property' : 'Edit UK Property'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Kensington Apartment"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="LAND">Land</option>
                <option value="MIXED_USE">Mixed Use</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Type</label>
              <select
                value={formData.subType}
                onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select...</option>
                <option value="FLAT">Flat</option>
                <option value="HOUSE">House</option>
                <option value="TERRACED">Terraced</option>
                <option value="SEMI_DETACHED">Semi-Detached</option>
                <option value="DETACHED">Detached</option>
                <option value="BUNGALOW">Bungalow</option>
                <option value="MAISONETTE">Maisonette</option>
                <option value="STUDIO">Studio</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                placeholder="SW1A 1AA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Type</label>
              <select
                value={formData.ownershipType}
                onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="FREEHOLD">Freehold</option>
                <option value="LEASEHOLD">Leasehold</option>
                <option value="SHARE_OF_FREEHOLD">Share of Freehold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EPC Rating</label>
              <select
                value={formData.epcRating}
                onChange={(e) => setFormData({ ...formData, epcRating: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select...</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Council Tax Band</label>
              <select
                value={formData.councilTaxBand}
                onChange={(e) => setFormData({ ...formData, councilTaxBand: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select...</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (GBP)</label>
              <input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Value (GBP)</label>
              <input
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasMortgage}
                  onChange={(e) => setFormData({ ...formData, hasMortgage: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Has Mortgage</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isRented}
                  onChange={(e) => setFormData({ ...formData, isRented: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Is Rented (Buy-to-Let)</span>
              </label>
            </div>

            {formData.hasMortgage && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage Balance</label>
                  <input
                    type="number"
                    value={formData.mortgageBalance}
                    onChange={(e) => setFormData({ ...formData, mortgageBalance: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment</label>
                  <input
                    type="number"
                    value={formData.monthlyPayment}
                    onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {formData.isRented && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
                  <input
                    type="text"
                    value={formData.tenantName}
                    onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="SOLD">Sold</option>
                <option value="VACANT">Vacant</option>
                <option value="UNDER_RENOVATION">Under Renovation</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : mode === 'add' ? 'Add Property' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
