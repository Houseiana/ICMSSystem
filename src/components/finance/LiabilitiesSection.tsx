'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Plus, Edit, Trash2, Eye, X, Building, Car, GraduationCap, Briefcase } from 'lucide-react'

interface Liability {
  id: number
  liabilityName: string
  liabilityType: string
  creditorName: string
  originalAmount: number
  currentBalance: number
  interestRate?: number
  currency: string
  status: string
  nextPaymentDate?: string
  regularPayment?: number
}

interface Props {
  onRefresh: () => void
}

const liabilityIcons: Record<string, any> = {
  MORTGAGE: Building,
  CAR_LOAN: Car,
  STUDENT_LOAN: GraduationCap,
  BUSINESS_LOAN: Briefcase,
  default: CreditCard
}

export default function LiabilitiesSection({ onRefresh }: Props) {
  const [liabilities, setLiabilities] = useState<Liability[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add')

  const fetchLiabilities = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finance/liabilities')
      const result = await response.json()
      if (result.success) {
        setLiabilities(result.data)
      }
    } catch (error) {
      console.error('Error fetching liabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiabilities()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this liability?')) return

    try {
      const response = await fetch(`/api/finance/liabilities/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        fetchLiabilities()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting liability:', error)
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

  const getLiabilityIcon = (type: string) => {
    return liabilityIcons[type] || liabilityIcons.default
  }

  const getProgressPercentage = (original: number, current: number) => {
    if (!original) return 0
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Liabilities</h2>
          <p className="text-sm text-gray-500">{liabilities.length} records</p>
        </div>
        <button
          onClick={() => {
            setSelectedLiability(null)
            setFormMode('add')
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Liability
        </button>
      </div>

      {/* Liabilities Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading liabilities...</p>
        </div>
      ) : liabilities.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No liabilities recorded</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Liability" to add one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liabilities.map((liability) => {
            const Icon = getLiabilityIcon(liability.liabilityType)
            const progress = getProgressPercentage(liability.originalAmount, liability.currentBalance)

            return (
              <div
                key={liability.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{liability.liabilityName}</h3>
                      <p className="text-xs text-gray-500">{liability.creditorName}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      liability.status === 'ACTIVE'
                        ? 'bg-yellow-100 text-yellow-700'
                        : liability.status === 'PAID_OFF'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {liability.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{progress}% paid</span>
                    <span>{formatCurrency(liability.currentBalance, liability.currency)} remaining</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Original Amount</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(liability.originalAmount, liability.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Balance</p>
                    <p className="font-semibold text-red-600">
                      {formatCurrency(liability.currentBalance, liability.currency)}
                    </p>
                  </div>
                  {liability.interestRate && (
                    <div>
                      <p className="text-gray-500">Interest Rate</p>
                      <p className="font-semibold text-gray-900">{liability.interestRate}%</p>
                    </div>
                  )}
                  {liability.regularPayment && (
                    <div>
                      <p className="text-gray-500">Monthly Payment</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(liability.regularPayment, liability.currency)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  <button
                    onClick={() => {
                      setSelectedLiability(liability)
                      setFormMode('view')
                      setShowForm(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLiability(liability)
                      setFormMode('edit')
                      setShowForm(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(liability.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <LiabilityForm
          liability={selectedLiability}
          mode={formMode}
          onClose={() => {
            setShowForm(false)
            setSelectedLiability(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedLiability(null)
            fetchLiabilities()
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

interface FormProps {
  liability: Liability | null
  mode: 'add' | 'edit' | 'view'
  onClose: () => void
  onSuccess: () => void
}

function LiabilityForm({ liability, mode, onClose, onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    liabilityName: liability?.liabilityName || '',
    liabilityType: liability?.liabilityType || 'LOAN',
    creditorName: liability?.creditorName || '',
    originalAmount: liability?.originalAmount || '',
    currentBalance: liability?.currentBalance || '',
    interestRate: liability?.interestRate || '',
    regularPayment: liability?.regularPayment || '',
    currency: liability?.currency || 'USD',
    status: liability?.status || 'ACTIVE',
    startDate: new Date().toISOString().split('T')[0]
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') return

    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/finance/liabilities/${liability?.id}` : '/api/finance/liabilities'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          originalAmount: parseFloat(String(formData.originalAmount)),
          currentBalance: formData.currentBalance
            ? parseFloat(String(formData.currentBalance))
            : parseFloat(String(formData.originalAmount)),
          interestRate: formData.interestRate ? parseFloat(String(formData.interestRate)) : null,
          regularPayment: formData.regularPayment ? parseFloat(String(formData.regularPayment)) : null
        })
      })

      const result = await response.json()
      if (result.success) {
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving liability:', error)
      alert('Error saving liability')
    } finally {
      setSaving(false)
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Liability' : mode === 'edit' ? 'Edit Liability' : 'Liability Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Liability Name *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.liabilityName}
                onChange={(e) => setFormData({ ...formData, liabilityName: e.target.value })}
                placeholder="e.g., Home Mortgage, Car Loan"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                required
                disabled={isReadOnly}
                value={formData.liabilityType}
                onChange={(e) => setFormData({ ...formData, liabilityType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              >
                <option value="LOAN">Loan</option>
                <option value="MORTGAGE">Mortgage</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="LINE_OF_CREDIT">Line of Credit</option>
                <option value="PERSONAL_LOAN">Personal Loan</option>
                <option value="CAR_LOAN">Car Loan</option>
                <option value="STUDENT_LOAN">Student Loan</option>
                <option value="BUSINESS_LOAN">Business Loan</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Creditor Name *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.creditorName}
                onChange={(e) => setFormData({ ...formData, creditorName: e.target.value })}
                placeholder="e.g., Bank of America"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Amount *</label>
              <input
                type="number"
                required
                disabled={isReadOnly}
                value={formData.originalAmount}
                onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                placeholder="Same as original if not specified"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                disabled={isReadOnly}
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formData.regularPayment}
                onChange={(e) => setFormData({ ...formData, regularPayment: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                disabled={isReadOnly}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="QAR">QAR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                disabled={isReadOnly}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="PAID_OFF">Paid Off</option>
                <option value="DEFAULTED">Defaulted</option>
                <option value="RESTRUCTURED">Restructured</option>
              </select>
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : mode === 'edit' ? 'Update Liability' : 'Add Liability'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
