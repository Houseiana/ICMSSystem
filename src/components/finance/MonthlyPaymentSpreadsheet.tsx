'use client'

import { useState, useEffect } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Printer,
  Download,
  User,
  Home,
  Wrench,
  Gift,
  DollarSign,
  CreditCard,
  Banknote,
  Building2,
  Calendar,
  Check
} from 'lucide-react'

interface FlatUnit {
  id: number
  unitNumber: string
  tenantName: string | null
  tenantPhone: string | null
  tenantQID: string | null
  monthlyRent: number | null
  currency: string
}

interface MonthlyRecord {
  id: number | null
  flatUnitId: number
  year: number
  month: number
  status: string
  rentAmount: number | null
  paymentMethod: string | null
  chequeNumber: string | null
  bankName: string | null
  paymentDate: string | null
  isPaid: boolean
  notes: string | null
}

interface MonthlyPaymentSpreadsheetProps {
  propertyId: number
  flatTypeId: number
  unit: FlatUnit
  onClose: () => void
  onUpdate: () => void
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const STATUS_OPTIONS = [
  { value: 'OCCUPIED', label: 'Occupied', icon: User, color: 'bg-green-100 text-green-700' },
  { value: 'VACANT', label: 'Vacant', icon: Home, color: 'bg-amber-100 text-amber-700' },
  { value: 'UNDER_RENOVATION', label: 'Under Renovation', icon: Wrench, color: 'bg-blue-100 text-blue-700' },
  { value: 'FREE_MONTH', label: 'Free Month', icon: Gift, color: 'bg-purple-100 text-purple-700' }
]

const PAYMENT_METHODS = [
  { value: 'CHEQUE', label: 'Cheque', icon: CreditCard },
  { value: 'CASH', label: 'Cash', icon: Banknote },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Building2 },
  { value: 'FREE', label: 'Free', icon: Gift }
]

export default function MonthlyPaymentSpreadsheet({
  propertyId,
  flatTypeId,
  unit,
  onClose,
  onUpdate
}: MonthlyPaymentSpreadsheetProps) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [records, setRecords] = useState<MonthlyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingMonth, setEditingMonth] = useState<number | null>(null)
  const [summary, setSummary] = useState({ paidMonths: 0, totalIncome: 0, occupiedMonths: 0, vacantMonths: 0 })

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/finance/real-estate/${propertyId}/flat-types/${flatTypeId}/units/${unit.id}/monthly-records?year=${year}`
      )
      const data = await response.json()
      if (data.success) {
        setRecords(data.data)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [year, unit.id])

  const handleUpdateRecord = async (month: number, updates: Partial<MonthlyRecord>) => {
    try {
      const response = await fetch(
        `/api/finance/real-estate/${propertyId}/flat-types/${flatTypeId}/units/${unit.id}/monthly-records`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ year, month, ...updates })
        }
      )

      if (response.ok) {
        fetchRecords()
        setEditingMonth(null)
      }
    } catch (error) {
      console.error('Error updating record:', error)
    }
  }

  const handleSaveAll = async () => {
    try {
      setSaving(true)
      const response = await fetch(
        `/api/finance/real-estate/${propertyId}/flat-types/${flatTypeId}/units/${unit.id}/monthly-records`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ records })
        }
      )

      if (response.ok) {
        fetchRecords()
        onUpdate()
      }
    } catch (error) {
      console.error('Error saving records:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const rows = records.map(r => `
      <tr>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${MONTHS[r.month - 1]}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${r.status}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">
          ${r.rentAmount ? `${unit.currency} ${r.rentAmount.toLocaleString()}` : '-'}
        </td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${r.paymentMethod || '-'}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${r.chequeNumber || '-'}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${r.bankName || '-'}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${r.isPaid ? 'Paid' : 'Pending'}</td>
      </tr>
    `).join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unit ${unit.unitNumber} - Payment Records ${year}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1f2937; margin-bottom: 5px; }
            .subtitle { color: #6b7280; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
            .summary { display: flex; gap: 20px; margin-bottom: 20px; }
            .summary-item { padding: 10px; background: #f3f4f6; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Unit ${unit.unitNumber} - Payment Records</h1>
          <p class="subtitle">Year: ${year} | Tenant: ${unit.tenantName || 'N/A'}</p>

          <div class="summary">
            <div class="summary-item">
              <strong>Total Income:</strong> ${unit.currency} ${summary.totalIncome.toLocaleString()}
            </div>
            <div class="summary-item">
              <strong>Paid Months:</strong> ${summary.paidMonths}
            </div>
            <div class="summary-item">
              <strong>Occupied:</strong> ${summary.occupiedMonths}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Status</th>
                <th>Rent</th>
                <th>Payment Method</th>
                <th>Cheque #</th>
                <th>Bank</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const handleExport = () => {
    const headers = ['Month', 'Status', 'Rent Amount', 'Payment Method', 'Cheque Number', 'Bank', 'Payment Date', 'Paid', 'Notes']
    const rows = records.map(r => [
      MONTHS[r.month - 1],
      r.status,
      r.rentAmount || '',
      r.paymentMethod || '',
      r.chequeNumber || '',
      r.bankName || '',
      r.paymentDate ? new Date(r.paymentDate).toLocaleDateString() : '',
      r.isPaid ? 'Yes' : 'No',
      r.notes || ''
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Unit_${unit.unitNumber}_${year}_payments.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusStyle = (status: string) => {
    const option = STATUS_OPTIONS.find(o => o.value === status)
    return option?.color || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div>
            <h2 className="text-xl font-bold">Unit {unit.unitNumber} - Payment Records</h2>
            <p className="text-emerald-100 text-sm">
              {unit.tenantName ? `Tenant: ${unit.tenantName}` : 'No tenant'}
              {unit.monthlyRent && ` • ${unit.currency} ${unit.monthlyRent.toLocaleString()}/mo`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Year Navigation */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <button
            onClick={() => setYear(year - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            {year - 1}
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-2xl font-bold text-gray-800">{year}</span>
          </div>
          <button
            onClick={() => setYear(year + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
          >
            {year + 1}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{unit.currency} {summary.totalIncome.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Income</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{summary.paidMonths}</p>
            <p className="text-xs text-gray-500">Paid Months</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.occupiedMonths}</p>
            <p className="text-xs text-gray-500">Occupied Months</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{summary.vacantMonths}</p>
            <p className="text-xs text-gray-500">Vacant Months</p>
          </div>
        </div>

        {/* Spreadsheet */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((record) => (
                <MonthCard
                  key={record.month}
                  record={record}
                  unit={unit}
                  isEditing={editingMonth === record.month}
                  onEdit={() => setEditingMonth(record.month)}
                  onSave={(updates) => handleUpdateRecord(record.month, updates)}
                  onCancel={() => setEditingMonth(null)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Close
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Month Card Component
function MonthCard({
  record,
  unit,
  isEditing,
  onEdit,
  onSave,
  onCancel
}: {
  record: MonthlyRecord
  unit: FlatUnit
  isEditing: boolean
  onEdit: () => void
  onSave: (updates: Partial<MonthlyRecord>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    status: record.status,
    rentAmount: record.rentAmount || unit.monthlyRent || 0,
    paymentMethod: record.paymentMethod || '',
    chequeNumber: record.chequeNumber || '',
    bankName: record.bankName || '',
    paymentDate: record.paymentDate ? record.paymentDate.split('T')[0] : '',
    isPaid: record.isPaid,
    notes: record.notes || ''
  })

  useEffect(() => {
    setFormData({
      status: record.status,
      rentAmount: record.rentAmount || unit.monthlyRent || 0,
      paymentMethod: record.paymentMethod || '',
      chequeNumber: record.chequeNumber || '',
      bankName: record.bankName || '',
      paymentDate: record.paymentDate ? record.paymentDate.split('T')[0] : '',
      isPaid: record.isPaid,
      notes: record.notes || ''
    })
  }, [record, unit.monthlyRent])

  const StatusIcon = STATUS_OPTIONS.find(o => o.value === record.status)?.icon || Home
  const statusColor = STATUS_OPTIONS.find(o => o.value === record.status)?.color || 'bg-gray-100 text-gray-700'

  if (isEditing) {
    return (
      <div className="border-2 border-emerald-500 rounded-lg p-4 bg-emerald-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">{MONTHS[record.month - 1]}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-2 py-1.5 border rounded text-sm"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {(formData.status === 'OCCUPIED' || formData.status === 'FREE_MONTH') && (
            <>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Rent Amount</label>
                <input
                  type="number"
                  value={formData.rentAmount}
                  onChange={(e) => setFormData({ ...formData, rentAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                >
                  <option value="">Select...</option>
                  {PAYMENT_METHODS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {formData.paymentMethod === 'CHEQUE' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Cheque Number</label>
                    <input
                      type="text"
                      value={formData.chequeNumber}
                      onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Bank</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs text-gray-600 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Paid</span>
              </label>
            </>
          )}

          <div>
            <label className="block text-xs text-gray-600 mb-1">Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-2 py-1.5 border rounded text-sm"
              placeholder="Optional notes..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-3 py-1.5 border rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="flex-1 px-3 py-1.5 bg-emerald-600 text-white rounded text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onEdit}
      className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${
        record.isPaid ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">{MONTHS[record.month - 1]}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
          {record.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Amount:</span>
          <span className="font-semibold">
            {record.rentAmount
              ? `${unit.currency} ${record.rentAmount.toLocaleString()}`
              : '-'}
          </span>
        </div>

        {record.paymentMethod && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Method:</span>
            <span className="text-sm">{record.paymentMethod}</span>
          </div>
        )}

        {record.chequeNumber && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Cheque:</span>
            <span className="text-sm">{record.chequeNumber}</span>
          </div>
        )}

        {record.bankName && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Bank:</span>
            <span className="text-sm">{record.bankName}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-gray-500">Status:</span>
          {record.isPaid ? (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <Check className="w-4 h-4" />
              Paid
            </span>
          ) : record.status === 'OCCUPIED' ? (
            <span className="text-amber-600 text-sm">Pending</span>
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </div>
      </div>

      {record.notes && (
        <p className="text-xs text-gray-500 mt-2 italic">{record.notes}</p>
      )}
    </div>
  )
}
