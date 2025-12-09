'use client'

import { useState, useEffect } from 'react'
import {
  X,
  Plus,
  Edit2,
  Trash2,
  User,
  Phone,
  Calendar,
  Home,
  Droplets,
  Zap,
  FileText,
  ChevronRight,
  Upload,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Wrench,
  Clock
} from 'lucide-react'
import MonthlyPaymentSpreadsheet from './MonthlyPaymentSpreadsheet'

interface FlatUnit {
  id: number
  unitNumber: string
  floor: number | null
  status: string
  tenantName: string | null
  tenantPhone: string | null
  tenantQID: string | null
  waterAccountNo: string | null
  electricityAccountNo: string | null
  contractStartDate: string | null
  contractEndDate: string | null
  monthlyRent: number | null
  currency: string
  guaranteeType: string | null
  guaranteeAmount: number | null
  guaranteeChequeNo: string | null
  guaranteeBank: string | null
  notes: string | null
}

interface FlatType {
  id: number
  typeName: string
  bedrooms: number
  bathrooms: number
  monthlyRate: number
  currency: string
  totalUnits?: number | null
  availableUnits?: number | null
}

interface FlatUnitsManagerProps {
  propertyId: number
  flatType: FlatType
  onClose: () => void
}

export default function FlatUnitsManager({ propertyId, flatType, onClose }: FlatUnitsManagerProps) {
  const [units, setUnits] = useState<FlatUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [editingUnit, setEditingUnit] = useState<FlatUnit | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<FlatUnit | null>(null)
  const [showSpreadsheet, setShowSpreadsheet] = useState(false)
  const [filter, setFilter] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [summary, setSummary] = useState({ total: 0, occupied: 0, vacant: 0, underRenovation: 0 })

  const fetchUnits = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/finance/real-estate/${propertyId}/flat-types/${flatType.id}/units`
      )
      const data = await response.json()
      if (data.success) {
        setUnits(data.data)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error fetching units:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [propertyId, flatType.id])

  const handleSaveUnit = async (unitData: Partial<FlatUnit>) => {
    try {
      const url = editingUnit
        ? `/api/finance/real-estate/${propertyId}/flat-types/${flatType.id}/units/${editingUnit.id}`
        : `/api/finance/real-estate/${propertyId}/flat-types/${flatType.id}/units`

      const response = await fetch(url, {
        method: editingUnit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unitData)
      })

      if (response.ok) {
        fetchUnits()
        setShowAddForm(false)
        setEditingUnit(null)
      }
    } catch (error) {
      console.error('Error saving unit:', error)
    }
  }

  const handleBulkCreate = async (count: number, startNumber: number, prefix: string) => {
    try {
      const response = await fetch(
        `/api/finance/real-estate/${propertyId}/flat-types/${flatType.id}/units?action=bulk-create`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count, startNumber, prefix })
        }
      )

      if (response.ok) {
        fetchUnits()
        setShowBulkAdd(false)
      }
    } catch (error) {
      console.error('Error bulk creating units:', error)
    }
  }

  const handleDeleteUnit = async (unitId: number) => {
    if (!confirm('Are you sure you want to delete this unit?')) return

    try {
      const response = await fetch(
        `/api/finance/real-estate/${propertyId}/flat-types/${flatType.id}/units/${unitId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        fetchUnits()
      }
    } catch (error) {
      console.error('Error deleting unit:', error)
    }
  }

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // For now, we'll parse CSV. In production, use xlsx library
    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

      const units = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',')
        const unit: any = {}
        headers.forEach((header, i) => {
          const value = values[i]?.trim()
          if (header === 'unitnumber' || header === 'unit') unit.unitNumber = value
          if (header === 'floor') unit.floor = parseInt(value) || null
          if (header === 'status') unit.status = value?.toUpperCase() || 'VACANT'
          if (header === 'tenantname' || header === 'tenant') unit.tenantName = value
          if (header === 'tenantphone' || header === 'phone') unit.tenantPhone = value
          if (header === 'tenantqid' || header === 'qid') unit.tenantQID = value
          if (header === 'water' || header === 'wateraccountno') unit.waterAccountNo = value
          if (header === 'electricity' || header === 'electricityaccountno') unit.electricityAccountNo = value
          if (header === 'rent' || header === 'monthlyrent') unit.monthlyRent = parseFloat(value) || null
        })
        return unit
      })

      // Import units
      const response = await fetch(
        `/api/finance/real-estate/${propertyId}/flat-types/${flatType.id}/units/import`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ units })
        }
      )

      if (response.ok) {
        const result = await response.json()
        alert(`Imported: ${result.data.imported} units (${result.data.created} new, ${result.data.updated} updated)`)
        fetchUnits()
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  const handleExportExcel = () => {
    const headers = ['Unit Number', 'Floor', 'Status', 'Tenant Name', 'Tenant Phone', 'Tenant QID', 'Water Account', 'Electricity Account', 'Monthly Rent', 'Contract Start', 'Contract End', 'Notes']
    const rows = units.map(u => [
      u.unitNumber,
      u.floor || '',
      u.status,
      u.tenantName || '',
      u.tenantPhone || '',
      u.tenantQID || '',
      u.waterAccountNo || '',
      u.electricityAccountNo || '',
      u.monthlyRent || '',
      u.contractStartDate ? new Date(u.contractStartDate).toLocaleDateString() : '',
      u.contractEndDate ? new Date(u.contractEndDate).toLocaleDateString() : '',
      u.notes || ''
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${flatType.typeName.replace(/\s+/g, '_')}_units.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OCCUPIED': return <User className="w-4 h-4 text-green-500" />
      case 'VACANT': return <Home className="w-4 h-4 text-amber-500" />
      case 'UNDER_RENOVATION': return <Wrench className="w-4 h-4 text-blue-500" />
      case 'RESERVED': return <Clock className="w-4 h-4 text-purple-500" />
      default: return <Home className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OCCUPIED': return 'bg-green-100 text-green-700 border-green-200'
      case 'VACANT': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'UNDER_RENOVATION': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'RESERVED': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const filteredUnits = units.filter(unit => {
    if (filter !== 'ALL' && unit.status !== filter) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        unit.unitNumber.toLowerCase().includes(search) ||
        unit.tenantName?.toLowerCase().includes(search) ||
        unit.tenantPhone?.includes(search) ||
        unit.tenantQID?.includes(search)
      )
    }
    return true
  })

  // If showing spreadsheet for a unit
  if (showSpreadsheet && selectedUnit) {
    return (
      <MonthlyPaymentSpreadsheet
        propertyId={propertyId}
        flatTypeId={flatType.id}
        unit={selectedUnit}
        onClose={() => {
          setShowSpreadsheet(false)
          setSelectedUnit(null)
        }}
        onUpdate={fetchUnits}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div>
            <h2 className="text-xl font-bold">{flatType.typeName}</h2>
            <p className="text-blue-100 text-sm">
              {flatType.bedrooms} bed • {flatType.bathrooms} bath • {flatType.currency} {flatType.monthlyRate.toLocaleString()}/mo
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Bar */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
            <p className="text-xs text-gray-500">Total Units</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{summary.occupied}</p>
            <p className="text-xs text-gray-500">Occupied</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{summary.vacant}</p>
            <p className="text-xs text-gray-500">Vacant</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.underRenovation}</p>
            <p className="text-xs text-gray-500">Under Renovation</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="VACANT">Vacant</option>
              <option value="UNDER_RENOVATION">Under Renovation</option>
              <option value="RESERVED">Reserved</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleImportExcel}
                className="hidden"
              />
            </label>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowBulkAdd(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              Bulk Add
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Unit
            </button>
          </div>
        </div>

        {/* Units List */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {units.length === 0 ? (
                <>
                  <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No units yet. Click "Add Unit" or "Bulk Add" to create units.</p>
                </>
              ) : (
                <p>No units match your filter criteria.</p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Unit Number & Status */}
                      <div className="flex flex-col items-center min-w-[80px]">
                        <span className="text-lg font-bold text-gray-800">{unit.unitNumber}</span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(unit.status)}`}>
                          {unit.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Tenant Info */}
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tenant</p>
                          {unit.tenantName ? (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-sm font-medium">{unit.tenantName}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No tenant</span>
                          )}
                          {unit.tenantPhone && (
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{unit.tenantPhone}</span>
                            </div>
                          )}
                          {unit.tenantQID && (
                            <p className="text-xs text-gray-500 mt-1">QID: {unit.tenantQID}</p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Utilities</p>
                          {unit.waterAccountNo && (
                            <div className="flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-blue-400" />
                              <span className="text-xs">{unit.waterAccountNo}</span>
                            </div>
                          )}
                          {unit.electricityAccountNo && (
                            <div className="flex items-center gap-1 mt-1">
                              <Zap className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs">{unit.electricityAccountNo}</span>
                            </div>
                          )}
                          {!unit.waterAccountNo && !unit.electricityAccountNo && (
                            <span className="text-xs text-gray-400">Not set</span>
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Contract</p>
                          {unit.contractStartDate ? (
                            <>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs">
                                  {new Date(unit.contractStartDate).toLocaleDateString()} -
                                  {unit.contractEndDate ? new Date(unit.contractEndDate).toLocaleDateString() : 'Ongoing'}
                                </span>
                              </div>
                              {unit.monthlyRent && (
                                <p className="text-sm font-medium text-emerald-600 mt-1">
                                  {unit.currency} {unit.monthlyRent.toLocaleString()}/mo
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">No contract</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedUnit(unit)
                          setShowSpreadsheet(true)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs"
                      >
                        <FileText className="w-3 h-3" />
                        Payments
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingUnit(unit)
                          setShowAddForm(true)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Unit Modal */}
        {showAddForm && (
          <UnitFormModal
            unit={editingUnit}
            defaultRent={flatType.monthlyRate}
            currency={flatType.currency}
            onSave={handleSaveUnit}
            onClose={() => {
              setShowAddForm(false)
              setEditingUnit(null)
            }}
          />
        )}

        {/* Bulk Add Modal */}
        {showBulkAdd && (
          <BulkAddModal
            onAdd={handleBulkCreate}
            onClose={() => setShowBulkAdd(false)}
          />
        )}
      </div>
    </div>
  )
}

// Unit Form Modal Component
function UnitFormModal({
  unit,
  defaultRent,
  currency,
  onSave,
  onClose
}: {
  unit: FlatUnit | null
  defaultRent: number
  currency: string
  onSave: (data: Partial<FlatUnit>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    unitNumber: unit?.unitNumber || '',
    floor: unit?.floor || '',
    status: unit?.status || 'VACANT',
    tenantName: unit?.tenantName || '',
    tenantPhone: unit?.tenantPhone || '',
    tenantQID: unit?.tenantQID || '',
    waterAccountNo: unit?.waterAccountNo || '',
    electricityAccountNo: unit?.electricityAccountNo || '',
    contractStartDate: unit?.contractStartDate ? unit.contractStartDate.split('T')[0] : '',
    contractEndDate: unit?.contractEndDate ? unit.contractEndDate.split('T')[0] : '',
    monthlyRent: unit?.monthlyRent || defaultRent,
    currency: unit?.currency || currency,
    guaranteeType: unit?.guaranteeType || '',
    guaranteeAmount: unit?.guaranteeAmount || '',
    guaranteeChequeNo: unit?.guaranteeChequeNo || '',
    guaranteeBank: unit?.guaranteeBank || '',
    notes: unit?.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      floor: formData.floor ? parseInt(formData.floor as string) : null,
      monthlyRent: formData.monthlyRent ? parseFloat(formData.monthlyRent as any) : null,
      guaranteeAmount: formData.guaranteeAmount ? parseFloat(formData.guaranteeAmount as any) : null
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{unit ? 'Edit Unit' : 'Add New Unit'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number *</label>
              <input
                type="text"
                required
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="VACANT">Vacant</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="UNDER_RENOVATION">Under Renovation</option>
                <option value="RESERVED">Reserved</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-800 mb-3">Tenant Information</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.tenantPhone}
                  onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">QID Number</label>
                <input
                  type="text"
                  value={formData.tenantQID}
                  onChange={(e) => setFormData({ ...formData, tenantQID: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-800 mb-3">Utility Accounts</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Account No</label>
                <input
                  type="text"
                  value={formData.waterAccountNo}
                  onChange={(e) => setFormData({ ...formData, waterAccountNo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Account No</label>
                <input
                  type="text"
                  value={formData.electricityAccountNo}
                  onChange={(e) => setFormData({ ...formData, electricityAccountNo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-800 mb-3">Contract Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Start</label>
                <input
                  type="date"
                  value={formData.contractStartDate}
                  onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract End</label>
                <input
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="QAR">QAR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-800 mb-3">Guarantee/Security</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guarantee Type</label>
                <select
                  value={formData.guaranteeType}
                  onChange={(e) => setFormData({ ...formData, guaranteeType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">None</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={formData.guaranteeAmount}
                  onChange={(e) => setFormData({ ...formData, guaranteeAmount: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              {formData.guaranteeType === 'CHEQUE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Number</label>
                    <input
                      type="text"
                      value={formData.guaranteeChequeNo}
                      onChange={(e) => setFormData({ ...formData, guaranteeChequeNo: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                    <input
                      type="text"
                      value={formData.guaranteeBank}
                      onChange={(e) => setFormData({ ...formData, guaranteeBank: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {unit ? 'Update Unit' : 'Add Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Bulk Add Modal Component
function BulkAddModal({
  onAdd,
  onClose
}: {
  onAdd: (count: number, startNumber: number, prefix: string) => void
  onClose: () => void
}) {
  const [count, setCount] = useState(5)
  const [startNumber, setStartNumber] = useState(1)
  const [prefix, setPrefix] = useState('')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Bulk Add Units</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Units</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Number</label>
            <input
              type="number"
              min="1"
              value={startNumber}
              onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prefix (optional)</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g., A-, Floor1-"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <p>This will create units:</p>
            <p className="font-medium">
              {prefix}{startNumber}, {prefix}{startNumber + 1}, ... {prefix}{startNumber + count - 1}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onAdd(count, startNumber, prefix)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create {count} Units
          </button>
        </div>
      </div>
    </div>
  )
}
