'use client'

import { useState, useEffect } from 'react'
import { Car, Plus, Edit, Trash2, Calendar, MapPin, X, AlertTriangle, CheckCircle } from 'lucide-react'

interface CarUKData {
  id: number
  vehicleName: string
  make: string
  model: string
  year: number
  variant?: string
  licensePlate?: string
  color?: string
  vehicleType: string
  fuelType?: string
  mileage?: number
  mileageUnit: string
  purchasePrice?: number
  currentValue?: number
  currency: string
  motExpiry?: string
  taxExpiry?: string
  insuranceExpiry?: string
  isInsured: boolean
  isFinanced: boolean
  financeBalance?: number
  monthlyPayment?: number
  city?: string
  congestionZone: boolean
  ulezCompliant: boolean
  status: string
}

interface Props {
  onRefresh: () => void
}

export default function CarsUKSection({ onRefresh }: Props) {
  const [cars, setCars] = useState<CarUKData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCar, setSelectedCar] = useState<CarUKData | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')

  const fetchCars = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finance/cars-uk')
      const result = await response.json()
      if (result.success) {
        setCars(result.data)
      }
    } catch (error) {
      console.error('Error fetching UK cars:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this car?')) return
    try {
      const response = await fetch(`/api/finance/cars-uk?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchCars()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting UK car:', error)
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

  const isExpiringSoon = (dateStr?: string) => {
    if (!dateStr) return false
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = (dateStr?: string) => {
    if (!dateStr) return false
    return new Date(dateStr) < new Date()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'SOLD': return 'bg-gray-100 text-gray-800'
      case 'IN_SERVICE': return 'bg-yellow-100 text-yellow-800'
      case 'ACCIDENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading UK cars...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Cars in UK</h2>
          <p className="text-sm text-gray-500">Manage your UK vehicle fleet</p>
        </div>
        <button
          onClick={() => {
            setSelectedCar(null)
            setFormMode('add')
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add UK Car
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Total Cars</p>
          <p className="text-2xl font-bold text-gray-800">{cars.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(
              cars.reduce((sum, c) => sum + (c.currentValue || c.purchasePrice || 0), 0),
              'GBP'
            )}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">MOT Due Soon</p>
          <p className="text-2xl font-bold text-orange-600">
            {cars.filter(c => isExpiringSoon(c.motExpiry)).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">ULEZ Compliant</p>
          <p className="text-2xl font-bold text-green-600">
            {cars.filter(c => c.ulezCompliant).length}
          </p>
        </div>
      </div>

      {/* Cars Grid */}
      {cars.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No UK cars added yet</p>
          <button
            onClick={() => {
              setSelectedCar(null)
              setFormMode('add')
              setShowForm(true)
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Add your first UK car
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{car.vehicleName}</h3>
                    <p className="text-sm text-gray-500">{car.make} {car.model} {car.year}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(car.status)}`}>
                    {car.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {car.licensePlate && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono bg-yellow-100 px-2 py-1 rounded border border-yellow-300">
                        {car.licensePlate}
                      </span>
                    </div>
                  )}

                  {car.city && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{car.city}</span>
                    </div>
                  )}

                  {/* MOT Status */}
                  {car.motExpiry && (
                    <div className={`flex items-center gap-2 text-sm ${
                      isExpired(car.motExpiry) ? 'text-red-600' :
                      isExpiringSoon(car.motExpiry) ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {isExpired(car.motExpiry) ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Calendar className="w-4 h-4" />
                      )}
                      <span>MOT: {new Date(car.motExpiry).toLocaleDateString('en-GB')}</span>
                      {isExpired(car.motExpiry) && <span className="text-xs">(Expired)</span>}
                    </div>
                  )}

                  {/* Road Tax Status */}
                  {car.taxExpiry && (
                    <div className={`flex items-center gap-2 text-sm ${
                      isExpired(car.taxExpiry) ? 'text-red-600' :
                      isExpiringSoon(car.taxExpiry) ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      <span>Tax: {new Date(car.taxExpiry).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}

                  {/* Compliance Badges */}
                  <div className="flex gap-2 flex-wrap">
                    {car.ulezCompliant ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        ULEZ OK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        Not ULEZ
                      </span>
                    )}
                    {car.congestionZone && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Congestion Zone
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Current Value</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatCurrency(car.currentValue || car.purchasePrice || 0, car.currency)}
                      </p>
                    </div>
                    {car.mileage && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Mileage</p>
                        <p className="text-sm font-medium text-gray-600">
                          {car.mileage.toLocaleString()} miles
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t mt-3">
                  <button
                    onClick={() => {
                      setSelectedCar(car)
                      setFormMode('edit')
                      setShowForm(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
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
        <CarUKForm
          car={selectedCar}
          mode={formMode}
          onClose={() => {
            setShowForm(false)
            setSelectedCar(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedCar(null)
            fetchCars()
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

interface FormProps {
  car: CarUKData | null
  mode: 'add' | 'edit'
  onClose: () => void
  onSuccess: () => void
}

function CarUKForm({ car, mode, onClose, onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    vehicleName: car?.vehicleName || '',
    make: car?.make || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    variant: car?.variant || '',
    licensePlate: car?.licensePlate || '',
    color: car?.color || '',
    vehicleType: car?.vehicleType || 'SEDAN',
    fuelType: car?.fuelType || 'PETROL',
    mileage: car?.mileage || '',
    purchasePrice: car?.purchasePrice || '',
    currentValue: car?.currentValue || '',
    currency: car?.currency || 'GBP',
    city: car?.city || 'London',
    motExpiry: car?.motExpiry ? car.motExpiry.split('T')[0] : '',
    taxExpiry: car?.taxExpiry ? car.taxExpiry.split('T')[0] : '',
    isInsured: car?.isInsured || false,
    insuranceExpiry: car?.insuranceExpiry ? car.insuranceExpiry.split('T')[0] : '',
    isFinanced: car?.isFinanced || false,
    financeBalance: car?.financeBalance || '',
    monthlyPayment: car?.monthlyPayment || '',
    congestionZone: car?.congestionZone || false,
    ulezCompliant: car?.ulezCompliant !== false,
    status: car?.status || 'ACTIVE'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = '/api/finance/cars-uk'
      const method = mode === 'add' ? 'POST' : 'PUT'
      const body = mode === 'add' ? formData : { id: car?.id, ...formData }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error saving UK car:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">
            {mode === 'add' ? 'Add New UK Car' : 'Edit UK Car'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name *</label>
              <input
                type="text"
                value={formData.vehicleName}
                onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Range Rover Sport 2023"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={1900}
                max={2030}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                placeholder="AB12 CDE"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">MOT Expiry</label>
              <input
                type="date"
                value={formData.motExpiry}
                onChange={(e) => setFormData({ ...formData, motExpiry: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Road Tax Expiry</label>
              <input
                type="date"
                value={formData.taxExpiry}
                onChange={(e) => setFormData({ ...formData, taxExpiry: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (Miles)</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ELECTRIC">Electric</option>
              </select>
            </div>

            <div className="col-span-2 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.ulezCompliant}
                  onChange={(e) => setFormData({ ...formData, ulezCompliant: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">ULEZ Compliant</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.congestionZone}
                  onChange={(e) => setFormData({ ...formData, congestionZone: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">In Congestion Zone</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isInsured}
                  onChange={(e) => setFormData({ ...formData, isInsured: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Insured</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFinanced}
                  onChange={(e) => setFormData({ ...formData, isFinanced: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Financed</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="SOLD">Sold</option>
                <option value="IN_SERVICE">In Service</option>
                <option value="ACCIDENT">Accident</option>
                <option value="WRITTEN_OFF">Written Off</option>
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
              {saving ? 'Saving...' : mode === 'add' ? 'Add Car' : 'Update Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
