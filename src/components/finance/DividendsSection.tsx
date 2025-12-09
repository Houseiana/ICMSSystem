'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Plus, Edit, Trash2, Eye, X, DollarSign } from 'lucide-react'

interface Dividend {
  id: number
  sourceType: string
  sourceName: string
  ticker?: string
  grossAmount: number
  taxWithheld?: number
  netAmount: number
  currency: string
  paymentDate: string
  dividendType: string
}

interface Props {
  onRefresh: () => void
}

export default function DividendsSection({ onRefresh }: Props) {
  const [dividends, setDividends] = useState<Dividend[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedDividend, setSelectedDividend] = useState<Dividend | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add')

  const fetchDividends = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finance/dividends')
      const result = await response.json()
      if (result.success) {
        setDividends(result.data)
      }
    } catch (error) {
      console.error('Error fetching dividends:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDividends()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this dividend?')) return

    try {
      const response = await fetch(`/api/finance/dividends/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        fetchDividends()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting dividend:', error)
    }
  }

  const formatCurrency = (amount: number | undefined | null, currency = 'USD') => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dividends</h2>
          <p className="text-sm text-gray-500">{dividends.length} records</p>
        </div>
        <button
          onClick={() => {
            setSelectedDividend(null)
            setFormMode('add')
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Dividend
        </button>
      </div>

      {/* Dividends Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading dividends...</p>
        </div>
      ) : dividends.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No dividends recorded yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Dividend" to record one</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Source</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Gross</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Tax</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Net</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dividends.map((dividend) => (
                <tr key={dividend.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{dividend.sourceName}</p>
                        {dividend.ticker && (
                          <p className="text-xs text-gray-500">{dividend.ticker}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                      {dividend.sourceType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {formatCurrency(dividend.grossAmount, dividend.currency)}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600">
                    -{formatCurrency(dividend.taxWithheld, dividend.currency)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    {formatCurrency(dividend.netAmount, dividend.currency)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatDate(dividend.paymentDate)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedDividend(dividend)
                          setFormMode('view')
                          setShowForm(true)
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDividend(dividend)
                          setFormMode('edit')
                          setShowForm(true)
                        }}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dividend.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <DividendForm
          dividend={selectedDividend}
          mode={formMode}
          onClose={() => {
            setShowForm(false)
            setSelectedDividend(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedDividend(null)
            fetchDividends()
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

interface FormProps {
  dividend: Dividend | null
  mode: 'add' | 'edit' | 'view'
  onClose: () => void
  onSuccess: () => void
}

function DividendForm({ dividend, mode, onClose, onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    sourceType: dividend?.sourceType || 'STOCK',
    sourceName: dividend?.sourceName || '',
    ticker: dividend?.ticker || '',
    grossAmount: dividend?.grossAmount || '',
    taxWithheld: dividend?.taxWithheld || '',
    netAmount: dividend?.netAmount || '',
    currency: dividend?.currency || 'USD',
    dividendType: dividend?.dividendType || 'CASH',
    paymentDate: dividend?.paymentDate
      ? new Date(dividend.paymentDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  })
  const [saving, setSaving] = useState(false)

  // Auto-calculate net amount
  useEffect(() => {
    const gross = parseFloat(String(formData.grossAmount)) || 0
    const tax = parseFloat(String(formData.taxWithheld)) || 0
    setFormData((prev) => ({ ...prev, netAmount: String(gross - tax) }))
  }, [formData.grossAmount, formData.taxWithheld])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') return

    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/finance/dividends/${dividend?.id}` : '/api/finance/dividends'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          grossAmount: parseFloat(String(formData.grossAmount)),
          taxWithheld: formData.taxWithheld ? parseFloat(String(formData.taxWithheld)) : null,
          netAmount: parseFloat(String(formData.netAmount))
        })
      })

      const result = await response.json()
      if (result.success) {
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving dividend:', error)
      alert('Error saving dividend')
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
            {mode === 'add' ? 'Add Dividend' : mode === 'edit' ? 'Edit Dividend' : 'Dividend Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Type *</label>
              <select
                required
                disabled={isReadOnly}
                value={formData.sourceType}
                onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              >
                <option value="STOCK">Stock</option>
                <option value="BOND">Bond</option>
                <option value="MUTUAL_FUND">Mutual Fund</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="BUSINESS">Business</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticker Symbol</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                placeholder="e.g., AAPL"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Name *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.sourceName}
                onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                placeholder="e.g., Apple Inc."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gross Amount *</label>
              <input
                type="number"
                step="0.01"
                required
                disabled={isReadOnly}
                value={formData.grossAmount}
                onChange={(e) => setFormData({ ...formData, grossAmount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Withheld</label>
              <input
                type="number"
                step="0.01"
                disabled={isReadOnly}
                value={formData.taxWithheld}
                onChange={(e) => setFormData({ ...formData, taxWithheld: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Amount</label>
              <input
                type="number"
                step="0.01"
                disabled
                value={formData.netAmount}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-green-600 font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                disabled={isReadOnly}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="QAR">QAR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dividend Type</label>
              <select
                disabled={isReadOnly}
                value={formData.dividendType}
                onChange={(e) => setFormData({ ...formData, dividendType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              >
                <option value="CASH">Cash</option>
                <option value="STOCK">Stock</option>
                <option value="REINVESTED">Reinvested</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
              <input
                type="date"
                required
                disabled={isReadOnly}
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
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
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : mode === 'edit' ? 'Update Dividend' : 'Add Dividend'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
