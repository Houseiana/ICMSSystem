'use client'

import { useState, useEffect } from 'react'
import { CalendarCheck, Plus, Edit, Trash2, Eye, X, Zap, Wifi, Home, Phone, Tv, CreditCard } from 'lucide-react'

interface MonthlyPayment {
  id: number
  paymentName: string
  paymentType: string
  category?: string
  vendorName?: string
  amount: number
  currency: string
  status: string
  frequency: string
  isAutoPay: boolean
  dueDay?: number
  nextDueDate?: string
}

interface Props {
  onRefresh: () => void
}

const paymentIcons: Record<string, any> = {
  UTILITY: Zap,
  SUBSCRIPTION: Tv,
  INSURANCE: Home,
  RENT: Home,
  SERVICE: Phone,
  default: CreditCard
}

export default function MonthlyPaymentsSection({ onRefresh }: Props) {
  const [payments, setPayments] = useState<MonthlyPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<MonthlyPayment | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add')

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finance/monthly-payments')
      const result = await response.json()
      if (result.success) {
        setPayments(result.data)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment?')) return

    try {
      const response = await fetch(`/api/finance/monthly-payments/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        fetchPayments()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting payment:', error)
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

  const getPaymentIcon = (type: string) => {
    return paymentIcons[type] || paymentIcons.default
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Monthly Payments</h2>
          <p className="text-sm text-gray-500">{payments.length} recurring payments</p>
        </div>
        <button
          onClick={() => {
            setSelectedPayment(null)
            setFormMode('add')
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Payment
        </button>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <CalendarCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No recurring payments set up</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Payment" to track recurring expenses</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Payment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Frequency</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Auto-Pay</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const Icon = getPaymentIcon(payment.paymentType)
                return (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.paymentName}</p>
                          {payment.vendorName && (
                            <p className="text-xs text-gray-500">{payment.vendorName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                        {payment.paymentType}
                      </span>
                      {payment.category && (
                        <p className="text-xs text-gray-500 mt-1">{payment.category}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                      {payment.frequency}
                      {payment.dueDay && (
                        <p className="text-xs text-gray-400">Due: Day {payment.dueDay}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {payment.isAutoPay ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Auto
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : payment.status === 'PAUSED'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment)
                            setFormMode('view')
                            setShowForm(true)
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayment(payment)
                            setFormMode('edit')
                            setShowForm(true)
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <MonthlyPaymentForm
          payment={selectedPayment}
          mode={formMode}
          onClose={() => {
            setShowForm(false)
            setSelectedPayment(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedPayment(null)
            fetchPayments()
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

interface FormProps {
  payment: MonthlyPayment | null
  mode: 'add' | 'edit' | 'view'
  onClose: () => void
  onSuccess: () => void
}

function MonthlyPaymentForm({ payment, mode, onClose, onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    paymentName: payment?.paymentName || '',
    paymentType: payment?.paymentType || 'UTILITY',
    category: payment?.category || '',
    vendorName: payment?.vendorName || '',
    amount: payment?.amount || '',
    currency: payment?.currency || 'USD',
    frequency: payment?.frequency || 'MONTHLY',
    dueDay: payment?.dueDay || '',
    isAutoPay: payment?.isAutoPay || false,
    status: payment?.status || 'ACTIVE'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') return

    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/finance/monthly-payments/${payment?.id}` : '/api/finance/monthly-payments'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(String(formData.amount)),
          dueDay: formData.dueDay ? parseInt(String(formData.dueDay)) : null
        })
      })

      const result = await response.json()
      if (result.success) {
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving payment:', error)
      alert('Error saving payment')
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
            {mode === 'add' ? 'Add Payment' : mode === 'edit' ? 'Edit Payment' : 'Payment Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Name *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.paymentName}
                onChange={(e) => setFormData({ ...formData, paymentName: e.target.value })}
                placeholder="e.g., Netflix, Electricity Bill"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                required
                disabled={isReadOnly}
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="UTILITY">Utility</option>
                <option value="SUBSCRIPTION">Subscription</option>
                <option value="INSURANCE">Insurance</option>
                <option value="RENT">Rent</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="SERVICE">Service</option>
                <option value="MEMBERSHIP">Membership</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Electricity, Internet"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                placeholder="e.g., Netflix, Kahramaa"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input
                type="number"
                required
                disabled={isReadOnly}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                disabled={isReadOnly}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="QAR">QAR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                disabled={isReadOnly}
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="WEEKLY">Weekly</option>
                <option value="BI_WEEKLY">Bi-Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUAL">Annual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Day (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                disabled={isReadOnly}
                value={formData.dueDay}
                onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                placeholder="Day of month"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                disabled={isReadOnly}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={isReadOnly}
                  checked={formData.isAutoPay}
                  onChange={(e) => setFormData({ ...formData, isAutoPay: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Auto-Pay Enabled</span>
              </label>
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : mode === 'edit' ? 'Update Payment' : 'Add Payment'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
