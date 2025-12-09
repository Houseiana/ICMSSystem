'use client'

import { useState, useEffect } from 'react'
import { Wallet, Plus, Edit, Trash2, Eye, X, User } from 'lucide-react'

interface Salary {
  id: number
  personType: string
  personId: number
  personName: string
  position?: string
  department?: string
  baseSalary: number
  grossSalary?: number
  netSalary?: number
  currency: string
  status: string
  paymentFrequency: string
}

interface Props {
  onRefresh: () => void
}

export default function SalariesSection({ onRefresh }: Props) {
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add')

  const fetchSalaries = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finance/salaries')
      const result = await response.json()
      if (result.success) {
        setSalaries(result.data)
      }
    } catch (error) {
      console.error('Error fetching salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalaries()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this salary record?')) return

    try {
      const response = await fetch(`/api/finance/salaries/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        fetchSalaries()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting salary:', error)
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Salary Records</h2>
          <p className="text-sm text-gray-500">{salaries.length} records</p>
        </div>
        <button
          onClick={() => {
            setSelectedSalary(null)
            setFormMode('add')
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Salary Record
        </button>
      </div>

      {/* Salary Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading salaries...</p>
        </div>
      ) : salaries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No salary records yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Salary Record" to create one</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Person</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Position</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Base Salary</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Net Salary</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary) => (
                <tr key={salary.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{salary.personName}</p>
                        <p className="text-xs text-gray-500">{salary.personType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-900">{salary.position || '-'}</p>
                    <p className="text-xs text-gray-500">{salary.department || ''}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(salary.baseSalary, salary.currency)}
                    </p>
                    <p className="text-xs text-gray-500">{salary.paymentFrequency}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(salary.netSalary, salary.currency)}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        salary.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : salary.status === 'SUSPENDED'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {salary.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedSalary(salary)
                          setFormMode('view')
                          setShowForm(true)
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSalary(salary)
                          setFormMode('edit')
                          setShowForm(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(salary.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
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
        <SalaryForm
          salary={selectedSalary}
          mode={formMode}
          onClose={() => {
            setShowForm(false)
            setSelectedSalary(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedSalary(null)
            fetchSalaries()
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

interface FormProps {
  salary: Salary | null
  mode: 'add' | 'edit' | 'view'
  onClose: () => void
  onSuccess: () => void
}

function SalaryForm({ salary, mode, onClose, onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    personType: salary?.personType || 'EMPLOYEE',
    personId: salary?.personId || '',
    personName: salary?.personName || '',
    position: salary?.position || '',
    department: salary?.department || '',
    baseSalary: salary?.baseSalary || '',
    currency: salary?.currency || 'USD',
    paymentFrequency: salary?.paymentFrequency || 'MONTHLY',
    housingAllowance: '',
    transportAllowance: '',
    taxDeduction: '',
    status: salary?.status || 'ACTIVE',
    effectiveDate: new Date().toISOString().split('T')[0]
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') return

    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/finance/salaries/${salary?.id}` : '/api/finance/salaries'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          personId: parseInt(String(formData.personId)),
          baseSalary: parseFloat(String(formData.baseSalary)),
          housingAllowance: formData.housingAllowance ? parseFloat(String(formData.housingAllowance)) : null,
          transportAllowance: formData.transportAllowance ? parseFloat(String(formData.transportAllowance)) : null,
          taxDeduction: formData.taxDeduction ? parseFloat(String(formData.taxDeduction)) : null
        })
      })

      const result = await response.json()
      if (result.success) {
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving salary:', error)
      alert('Error saving salary')
    } finally {
      setSaving(false)
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Add Salary Record' : mode === 'edit' ? 'Edit Salary' : 'Salary Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Person Type *</label>
              <select
                required
                disabled={isReadOnly}
                value={formData.personType}
                onChange={(e) => setFormData({ ...formData, personType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="TASK_HELPER">Task Helper</option>
                <option value="CONTRACTOR">Contractor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Person ID *</label>
              <input
                type="number"
                required
                disabled={isReadOnly}
                value={formData.personId}
                onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Person Name *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary *</label>
              <input
                type="number"
                required
                disabled={isReadOnly}
                value={formData.baseSalary}
                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                disabled={isReadOnly}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="QAR">QAR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Frequency</label>
              <select
                disabled={isReadOnly}
                value={formData.paymentFrequency}
                onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              >
                <option value="WEEKLY">Weekly</option>
                <option value="BI_WEEKLY">Bi-Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                disabled={isReadOnly}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
              <input
                type="date"
                required
                disabled={isReadOnly}
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : mode === 'edit' ? 'Update Salary' : 'Add Salary'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
