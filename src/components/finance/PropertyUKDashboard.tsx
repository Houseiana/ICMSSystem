'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Edit, Trash2, Users, Calendar, Phone, Mail, AlertTriangle, CheckCircle } from 'lucide-react'

interface PropertyUK {
  id: number
  propertyName: string
  propertyType: string
  address?: string
  city?: string
  postcode?: string
  currentValue?: number
  monthlyRent?: number
  currency: string
}

interface Tenant {
  id: number
  tenantName: string
  tenantPhone?: string
  tenantEmail?: string
  nationalInsuranceNo?: string
  rentAmount: number
  currency: string
  contractStartDate: string
  contractEndDate: string
  securityDeposit?: number
  depositScheme?: string
  paymentStatus: string
  rightToRentChecked: boolean
  referencingCompleted: boolean
  guarantorRequired: boolean
  guarantorName?: string
  status: string
}

interface Props {
  property: PropertyUK
  onClose: () => void
  onRefresh: () => void
}

export default function PropertyUKDashboard({ property, onClose, onRefresh }: Props) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showTenantForm, setShowTenantForm] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')

  const fetchTenants = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/finance/properties-uk/${property.id}/tenants`)
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
    if (!confirm('Are you sure you want to delete this tenant?')) return
    try {
      const response = await fetch(`/api/finance/properties-uk/${property.id}/tenants/${tenantId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTenants()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting tenant:', error)
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

  const getContractStatus = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: 'Expired', color: 'bg-red-100 text-red-800' }
    if (diffDays <= 60) return { label: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Active', color: 'bg-green-100 text-green-800' }
  }

  const activeTenants = tenants.filter(t => t.status === 'ACTIVE')
  const totalRent = activeTenants.reduce((sum, t) => sum + t.rentAmount, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{property.propertyName}</h2>
            <p className="text-sm text-gray-500">
              {property.address && `${property.address}, `}{property.city} {property.postcode}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-600">Property Value</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(property.currentValue || 0, property.currency)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-green-600">Active Tenants</p>
              <p className="text-2xl font-bold text-green-700">{activeTenants.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="text-sm text-purple-600">Total Monthly Rent</p>
              <p className="text-2xl font-bold text-purple-700">
                {formatCurrency(totalRent, property.currency)}
              </p>
            </div>
          </div>

          {/* Tenants Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Tenants
              </h3>
              <button
                onClick={() => {
                  setSelectedTenant(null)
                  setFormMode('add')
                  setShowTenantForm(true)
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Tenant
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading tenants...</div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border">
                <Users className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No tenants yet</p>
                <button
                  onClick={() => {
                    setSelectedTenant(null)
                    setFormMode('add')
                    setShowTenantForm(true)
                  }}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  Add your first tenant
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tenants.map(tenant => {
                  const contractStatus = getContractStatus(tenant.contractEndDate)
                  return (
                    <div key={tenant.id} className="bg-gray-50 rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-800">{tenant.tenantName}</h4>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${contractStatus.color}`}>
                              {contractStatus.label}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            {tenant.tenantPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{tenant.tenantPhone}</span>
                              </div>
                            )}
                            {tenant.tenantEmail && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span>{tenant.tenantEmail}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                {new Date(tenant.contractStartDate).toLocaleDateString('en-GB')} - {new Date(tenant.contractEndDate).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                          </div>

                          {/* Compliance Badges */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {tenant.rightToRentChecked ? (
                              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Right to Rent
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                <AlertTriangle className="w-3 h-3" />
                                RTR Missing
                              </span>
                            )}
                            {tenant.referencingCompleted && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Referenced
                              </span>
                            )}
                            {tenant.depositScheme && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                {tenant.depositScheme}
                              </span>
                            )}
                            {tenant.guarantorRequired && tenant.guarantorName && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                Guarantor: {tenant.guarantorName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <p className="text-lg font-semibold text-gray-800">
                            {formatCurrency(tenant.rentAmount, tenant.currency)}
                          </p>
                          <p className="text-xs text-gray-500">per month</p>

                          <div className="flex items-center gap-1 mt-2">
                            <button
                              onClick={() => {
                                setSelectedTenant(tenant)
                                setFormMode('edit')
                                setShowTenantForm(true)
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTenant(tenant.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
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
  mode: 'add' | 'edit'
  onClose: () => void
  onSuccess: () => void
}

function TenantForm({ propertyId, tenant, mode, onClose, onSuccess }: TenantFormProps) {
  const [formData, setFormData] = useState({
    tenantName: tenant?.tenantName || '',
    tenantPhone: tenant?.tenantPhone || '',
    tenantEmail: tenant?.tenantEmail || '',
    nationalInsuranceNo: tenant?.nationalInsuranceNo || '',
    rentAmount: tenant?.rentAmount || '',
    contractStartDate: tenant?.contractStartDate ? tenant.contractStartDate.split('T')[0] : '',
    contractEndDate: tenant?.contractEndDate ? tenant.contractEndDate.split('T')[0] : '',
    securityDeposit: tenant?.securityDeposit || '',
    depositScheme: tenant?.depositScheme || '',
    rightToRentChecked: tenant?.rightToRentChecked || false,
    referencingCompleted: tenant?.referencingCompleted || false,
    guarantorRequired: tenant?.guarantorRequired || false,
    guarantorName: tenant?.guarantorName || '',
    status: tenant?.status || 'ACTIVE'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = mode === 'add'
        ? `/api/finance/properties-uk/${propertyId}/tenants`
        : `/api/finance/properties-uk/${propertyId}/tenants/${tenant?.id}`
      const method = mode === 'add' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error saving tenant:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">
            {mode === 'add' ? 'Add New Tenant' : 'Edit Tenant'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name *</label>
            <input
              type="text"
              value={formData.tenantName}
              onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.tenantPhone}
                onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.tenantEmail}
                onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">National Insurance No</label>
            <input
              type="text"
              value={formData.nationalInsuranceNo}
              onChange={(e) => setFormData({ ...formData, nationalInsuranceNo: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
              placeholder="AB123456C"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (GBP) *</label>
            <input
              type="number"
              value={formData.rentAmount}
              onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Start *</label>
              <input
                type="date"
                value={formData.contractStartDate}
                onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract End *</label>
              <input
                type="date"
                value={formData.contractEndDate}
                onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
              <input
                type="number"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Scheme</label>
              <select
                value={formData.depositScheme}
                onChange={(e) => setFormData({ ...formData, depositScheme: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select...</option>
                <option value="DPS">DPS</option>
                <option value="TDS">TDS</option>
                <option value="MyDeposits">MyDeposits</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.rightToRentChecked}
                onChange={(e) => setFormData({ ...formData, rightToRentChecked: e.target.checked })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Right to Rent Check Completed</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.referencingCompleted}
                onChange={(e) => setFormData({ ...formData, referencingCompleted: e.target.checked })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Referencing Completed</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.guarantorRequired}
                onChange={(e) => setFormData({ ...formData, guarantorRequired: e.target.checked })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Guarantor Required</span>
            </label>
          </div>

          {formData.guarantorRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guarantor Name</label>
              <input
                type="text"
                value={formData.guarantorName}
                onChange={(e) => setFormData({ ...formData, guarantorName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="TERMINATED">Terminated</option>
            </select>
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
              {saving ? 'Saving...' : mode === 'add' ? 'Add Tenant' : 'Update Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
