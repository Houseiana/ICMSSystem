'use client'

import { useRef } from 'react'
import {
  X,
  Printer,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Users,
  Wrench,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface FlatType {
  id: number
  typeName: string
  description?: string
  bedrooms: number
  bathrooms: number
  totalArea?: number | null
  isFurnished: boolean
  includesUtilities: boolean
  facilityAccess?: string
  monthlyRate: number
  currency: string
  totalUnits?: number | null
  availableUnits?: number | null
}

interface Property {
  id: number
  propertyName: string
  propertyType: string
  subType?: string | null
  description?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null
  totalFlats?: number | null
  totalArea?: number | null
  currentValue?: number | null
  currency: string
  monthlyRent?: number | null
  status: string
  flatTypes?: FlatType[]
}

interface PropertyPreviewProps {
  property: Property
  onClose: () => void
}

export default function PropertyPreview({ property, onClose }: PropertyPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${property.propertyName} - Property Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              border-bottom: 2px solid #10b981;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #10b981;
              margin: 0 0 10px 0;
            }
            .section {
              margin-bottom: 20px;
            }
            .section h2 {
              color: #374151;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            .field {
              margin-bottom: 10px;
            }
            .field-label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 2px;
            }
            .field-value {
              font-size: 14px;
              font-weight: 500;
            }
            .flat-type {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 10px;
            }
            .flat-type-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .flat-type h3 {
              margin: 0;
              color: #374151;
            }
            .status {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
            .status-active { background: #d1fae5; color: #065f46; }
            .status-inactive { background: #fee2e2; color: #991b1b; }
            .feature {
              display: inline-block;
              background: #f3f4f6;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              margin-right: 5px;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const formatCurrency = (amount: number | null | undefined, currency: string) => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Calculate summary
  const flatTypes = property.flatTypes || []
  const totalUnits = flatTypes.reduce((sum, ft) => sum + (ft.totalUnits || 0), 0)
  const availableUnits = flatTypes.reduce((sum, ft) => sum + (ft.availableUnits || 0), 0)
  const occupiedUnits = totalUnits - availableUnits
  const totalMonthlyIncome = flatTypes.reduce((sum, ft) => {
    const occupied = (ft.totalUnits || 0) - (ft.availableUnits || 0)
    return sum + (occupied * ft.monthlyRate)
  }, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">{property.propertyName}</h2>
              <p className="text-emerald-100 text-sm">{property.propertyType} - {property.subType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6" ref={printRef}>
          <div className="header">
            <h1>{property.propertyName}</h1>
            <p>{property.propertyType} - {property.subType}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Home className="w-4 h-4" />
                <span className="text-sm">Total Units</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{totalUnits}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Occupied</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{occupiedUnits}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Available</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{availableUnits}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Monthly Income</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                {formatCurrency(totalMonthlyIncome, property.currency)}
              </p>
            </div>
          </div>

          {/* Property Details */}
          <div className="section mb-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="field">
                <p className="field-label text-xs text-gray-500">Address</p>
                <p className="field-value font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {property.address || '-'}
                </p>
              </div>
              <div className="field">
                <p className="field-label text-xs text-gray-500">City</p>
                <p className="field-value font-medium">{property.city || '-'}</p>
              </div>
              <div className="field">
                <p className="field-label text-xs text-gray-500">Country</p>
                <p className="field-value font-medium">{property.country || '-'}</p>
              </div>
              <div className="field">
                <p className="field-label text-xs text-gray-500">Total Flats</p>
                <p className="field-value font-medium">{property.totalFlats || '-'}</p>
              </div>
              <div className="field">
                <p className="field-label text-xs text-gray-500">Total Area</p>
                <p className="field-value font-medium">{property.totalArea ? `${property.totalArea} sqm` : '-'}</p>
              </div>
              <div className="field">
                <p className="field-label text-xs text-gray-500">Current Value</p>
                <p className="field-value font-medium">{formatCurrency(property.currentValue, property.currency)}</p>
              </div>
              <div className="field">
                <p className="field-label text-xs text-gray-500">Status</p>
                <span className={`status ${property.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                  {property.status}
                </span>
              </div>
            </div>
          </div>

          {/* Flat Types */}
          <div className="section">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Flat Types ({flatTypes.length})
            </h2>
            <div className="space-y-3">
              {flatTypes.map((flatType) => {
                const occupied = (flatType.totalUnits || 0) - (flatType.availableUnits || 0)
                return (
                  <div key={flatType.id} className="flat-type border rounded-lg p-4 bg-gray-50">
                    <div className="flat-type-header flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{flatType.typeName}</h3>
                        <p className="text-sm text-gray-500">
                          {flatType.bedrooms} bed • {flatType.bathrooms} bath
                          {flatType.totalArea && ` • ${flatType.totalArea} sqm`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          {formatCurrency(flatType.monthlyRate, flatType.currency)}/mo
                        </p>
                        <p className="text-sm text-gray-500">
                          {occupied}/{flatType.totalUnits || 0} occupied
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {flatType.isFurnished && (
                        <span className="feature bg-blue-100 text-blue-700">Furnished</span>
                      )}
                      {flatType.includesUtilities && (
                        <span className="feature bg-green-100 text-green-700">Utilities Included</span>
                      )}
                      <span className={`feature ${(flatType.availableUnits || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {flatType.availableUnits || 0} available
                      </span>
                    </div>
                  </div>
                )
              })}
              {flatTypes.length === 0 && (
                <p className="text-gray-500 text-center py-8">No flat types defined</p>
              )}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="section mt-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Description</h2>
              <p className="text-gray-600">{property.description}</p>
            </div>
          )}

          {/* Print Footer */}
          <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}
