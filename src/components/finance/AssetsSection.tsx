'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Edit, Trash2, Eye, X, Car, Laptop, Watch, TrendingUp, Gem } from 'lucide-react'

interface Asset {
  id: number
  assetName: string
  assetType: string
  category?: string
  purchasePrice?: number
  currentValue?: number
  currency: string
  status: string
  location?: string
}

interface Props {
  onRefresh: () => void
}

const assetIcons: Record<string, any> = {
  VEHICLE: Car,
  ELECTRONICS: Laptop,
  JEWELRY: Watch,
  INVESTMENT: TrendingUp,
  STOCKS: TrendingUp,
  default: Package
}

export default function AssetsSection({ onRefresh }: Props) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add')

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finance/assets')
      const result = await response.json()
      if (result.success) {
        setAssets(result.data)
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return

    try {
      const response = await fetch(`/api/finance/assets/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        fetchAssets()
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting asset:', error)
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

  const getAssetIcon = (type: string) => {
    const Icon = assetIcons[type] || assetIcons.default
    return Icon
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Assets</h2>
          <p className="text-sm text-gray-500">{assets.length} assets</p>
        </div>
        <button
          onClick={() => {
            setSelectedAsset(null)
            setFormMode('add')
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Asset Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No assets added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Asset" to add your first asset</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const Icon = getAssetIcon(asset.assetType)
            return (
              <div
                key={asset.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{asset.assetName}</h3>
                      <p className="text-xs text-gray-500">{asset.assetType}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      asset.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : asset.status === 'SOLD'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Purchase Price</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(asset.purchasePrice, asset.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Value</p>
                    <p className="font-semibold text-purple-600">
                      {formatCurrency(asset.currentValue, asset.currency)}
                    </p>
                  </div>
                </div>

                {asset.location && (
                  <p className="text-xs text-gray-500 mb-3">
                    Location: <span className="font-medium">{asset.location}</span>
                  </p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t">
                  <button
                    onClick={() => {
                      setSelectedAsset(asset)
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
                      setSelectedAsset(asset)
                      setFormMode('edit')
                      setShowForm(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
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
        <AssetForm
          asset={selectedAsset}
          mode={formMode}
          onClose={() => {
            setShowForm(false)
            setSelectedAsset(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setSelectedAsset(null)
            fetchAssets()
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

interface FormProps {
  asset: Asset | null
  mode: 'add' | 'edit' | 'view'
  onClose: () => void
  onSuccess: () => void
}

function AssetForm({ asset, mode, onClose, onSuccess }: FormProps) {
  const [formData, setFormData] = useState({
    assetName: asset?.assetName || '',
    assetType: asset?.assetType || 'VEHICLE',
    category: asset?.category || '',
    purchasePrice: asset?.purchasePrice || '',
    currentValue: asset?.currentValue || '',
    currency: asset?.currency || 'USD',
    location: asset?.location || '',
    status: asset?.status || 'ACTIVE'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'view') return

    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/finance/assets/${asset?.id}` : '/api/finance/assets'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          purchasePrice: formData.purchasePrice ? parseFloat(String(formData.purchasePrice)) : null,
          currentValue: formData.currentValue ? parseFloat(String(formData.currentValue)) : null
        })
      })

      const result = await response.json()
      if (result.success) {
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving asset:', error)
      alert('Error saving asset')
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
            {mode === 'add' ? 'Add Asset' : mode === 'edit' ? 'Edit Asset' : 'Asset Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                value={formData.assetName}
                onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type *</label>
              <select
                required
                disabled={isReadOnly}
                value={formData.assetType}
                onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              >
                <option value="VEHICLE">Vehicle</option>
                <option value="EQUIPMENT">Equipment</option>
                <option value="FURNITURE">Furniture</option>
                <option value="ELECTRONICS">Electronics</option>
                <option value="JEWELRY">Jewelry</option>
                <option value="ART">Art</option>
                <option value="INVESTMENT">Investment</option>
                <option value="STOCKS">Stocks</option>
                <option value="BONDS">Bonds</option>
                <option value="CRYPTO">Crypto</option>
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
                placeholder="e.g., Sedan, Laptop, Gold"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                disabled={isReadOnly}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="QAR">QAR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                disabled={isReadOnly}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="SOLD">Sold</option>
                <option value="DISPOSED">Disposed</option>
                <option value="LOST">Lost</option>
                <option value="DAMAGED">Damaged</option>
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : mode === 'edit' ? 'Update Asset' : 'Add Asset'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
