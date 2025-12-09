'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Phone,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Tenant {
  id: number
  tenantName: string
  tenantPhone?: string
  tenantEmail?: string
  qidNumber?: string
  rentAmount: number
  currency: string
  contractStartDate: string
  contractEndDate: string
  securityDeposit?: number
  paymentStatus: string
  unitNumber?: string
  status: string
  notes?: string
}

interface Property {
  id: number
  propertyName: string
  propertyType: string
  subType?: string
  address?: string
  city?: string
  country?: string
  currentValue?: number
  monthlyRent?: number
  currency: string
  status: string
  isRented: boolean
  bedrooms?: number
  bathrooms?: number
  totalArea?: number
  tenants?: Tenant[]
}

interface Props {
  property: Property
  onClose: () => void
  onRefresh: () => void
}

export default function PropertyDashboard({ property, onClose, onRefresh }: Props) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showTenantForm, setShowTenantForm] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add')

  const fetchTenants = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/finance/real-estate/${property.id}/tenants`)
      const result = await response.json()
      if (result.success) {
        setTenants(result.data)
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [property.id])

  const handleDeleteTenant = async (tenantId: number) => {
    if (!confirm('Are you sure you want to delete this tenant record?')) return

    try {
      const response = await fetch(`/api/finance/real-estate/${property.id}/tenants/${tenantId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        fetchTenants()
        onRefresh()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting tenant:', error)
      alert('Error deleting tenant')
    }
  }

  const formatCurrency = (amount: number | undefined | null, currency = 'QAR') => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getContractStatus = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return { label: 'Expired', color: 'red', icon: AlertCircle }
    if (daysUntilExpiry <= 30) return { label: 'Expiring Soon', color: 'yellow', icon: Clock }
    return { label: 'Active', color: 'green', icon: CheckCircle }
  }

  const activeTenants = tenants.filter(t => t.status === 'ACTIVE')
  const totalRent = activeTenants.reduce((sum, t) => sum + t.rentAmount, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{property.propertyName}</h2>
              <p className="text-sm text-gray-500">
                {property.propertyType} {property.subType ? `- ${property.subType}` : ''}
                {property.city && ` | ${property.city}`}
                {property.country && `, ${property.country}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Property Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Property Value</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(property.currentValue, property.currency)}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Active Tenants</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{activeTenants.length}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Total Monthly Rent</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRent, 'QAR')}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Property Details</span>
              </div>
              <p className="text-sm text-gray-900">
                {property.bedrooms && `${property.bedrooms} Beds`}
                {property.bathrooms && ` | ${property.bathrooms} Baths`}
                {property.totalArea && ` | ${property.totalArea} sqm`}
              </p>
            </div>
          </div>

          {/* Tenants Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Tenant Records
                </h3>
                <p className="text-sm text-gray-500">{tenants.length} tenant(s) registered</p>
              </div>
              <button
                onClick={() => {
                  setSelectedTenant(null)
                  setFormMode('add')
                  setShowTenantForm(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Tenant
              </button>
            </div>

            {/* Tenants List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading tenants...</p>
              </div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tenants registered</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Tenant" to register a tenant</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tenants.map((tenant) => {
                  const contractStatus = getContractStatus(tenant.contractEndDate)
                  const StatusIcon = contractStatus.icon

                  return (
                    <div
                      key={tenant.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Tenant Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">
                                {tenant.tenantName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{tenant.tenantName}</h4>
                              {tenant.unitNumber && (
                                <span className="text-xs text-gray-500">Unit: {tenant.unitNumber}</span>
                              )}
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                                contractStatus.color === 'green'
                                  ? 'bg-green-100 text-green-700'
                                  : contractStatus.color === 'yellow'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {contractStatus.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Phone
                              </p>
                              <p className="font-medium text-gray-900">{tenant.tenantPhone || '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> QID
                              </p>
                              <p className="font-medium text-gray-900">{tenant.qidNumber || '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> Rent Amount
                              </p>
                              <p className="font-semibold text-green-600">
                                {formatCurrency(tenant.rentAmount, tenant.currency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Contract Period
                              </p>
                              <p className="font-medium text-gray-900 text-xs">
                                {formatDate(tenant.contractStartDate)} - {formatDate(tenant.contractEndDate)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedTenant(tenant)
                              setFormMode('view')
                              setShowTenantForm(true)
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTenant(tenant)
                              setFormMode('edit')
                              setShowTenantForm(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTenant(tenant.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Tenant Form Modal */}
      {showTenantForm && (
        <TenantForm
          propertyId={property.id}
          tenant={selectedTenant}
          mode={formMode}
          onClose={() => {
            setShowTenantForm(false)
            setSelectedTenant(null)
          }}
          onSuccess={() => {
            setShowTenantForm(false)
            setSelectedTenant(null)
            fetchTenants()
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

interface TenantFormProps {
  propertyId: number
  tenant: Tenant | null
  mode: 'add' | 'edit' | 'view'
  onClose: () => void
  onSuccess: () => void
}

function TenantForm({ propertyId, tenant, mode, onClose, onSuccess }: TenantFormProps) {
  const [formData, setFormData] = useState({
    tenantName: tenant?.tenantName || '',
    tenantPhone: tenant?.tenantPhone || '',
    tenantEmail: tenant?.tenantEmail || '',
    qidNumber: tenant?.qidNumber || '',
    rentAmount: tenant?.rentAmount || '',
    currency: tenant?.currency || 'QAR',
    contractStartDate: tenant?.contractStartDate
      ? new Date(tenant.contractStartDate).toISOString().split('T')[0]
      : '',
    contractEndDate: tenant?.contractEndDate
      ? new Date(tenant.contractEndDate).toISOString().split('T')[0]
      : '',
    securityDeposit: tenant?.securityDeposit || '',
    unitNumber: tenant?.unitNumber || '',
    notes: tenant?.notes || '',
    status: tenant?.status || 'ACTIVE'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') return

    setSaving(true)
    try {
      const url = mode === 'edit'
        ? `/api/finance/real-estate/${propertyId}/tenants/${tenant?.id}`
        : `/api/finance/real-estate/${propertyId}/tenants`
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rentAmount: parseFloat(String(formData.rentAmount)),
          securityDeposit: formData.securityDeposit ? parseFloat(String(formData.securityDeposit)) : null
        })
      })

      const result = await response.json()
      if (result.success) {
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving tenant:', error)
      alert('Error saving tenant')
    } finally {
      setSaving(false)
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Tenant' : mode === 'edit' ? 'Edit Tenant' : 'Tenant Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.tenantName}
                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                disabled={isReadOnly}
                value={formData.tenantPhone}
                onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                placeholder="+974 XXXX XXXX"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QID Number</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.qidNumber}
                onChange={(e) => setFormData({ ...formData, qidNumber: e.target.value })}
                placeholder="Qatar ID Number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                disabled={isReadOnly}
                value={formData.tenantEmail}
                onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                placeholder="e.g., Apt 101, Shop 5"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount *</label>
              <input
                type="number"
                required
                disabled={isReadOnly}
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
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
                <option value="QAR">QAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Start Date *</label>
              <input
                type="date"
                required
                disabled={isReadOnly}
                value={formData.contractStartDate}
                onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract End Date *</label>
              <input
                type="date"
                required
                disabled={isReadOnly}
                value={formData.contractEndDate}
                onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
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
                <option value="EXPIRED">Expired</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                disabled={isReadOnly}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

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
                {saving ? 'Saving...' : mode === 'edit' ? 'Update Tenant' : 'Add Tenant'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
