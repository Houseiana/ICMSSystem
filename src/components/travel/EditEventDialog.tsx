'use client'

import { useState, useEffect } from 'react'
import { X, Save, Calendar, MapPin, Clock, DollarSign, User, Phone, Mail, Globe, Shirt, FileText, Printer, Edit, Eye } from 'lucide-react'
import { EventType } from '@/types/travel'

interface TripEvent {
  id: number
  eventType: string
  eventName: string
  description?: string | null
  location?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  eventDate?: string | null
  startTime?: string | null
  endTime?: string | null
  durationHours?: number | null
  pricePerPerson?: number | null
  totalPrice?: number | null
  currency?: string | null
  bookingReference?: string | null
  contactPerson?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  websiteUrl?: string | null
  dressCode?: string | null
  specialInstructions?: string | null
  status: string
  notes?: string | null
}

interface EditEventDialogProps {
  event: TripEvent
  mode: 'preview' | 'edit'
  onClose: () => void
  onSuccess: () => void
}

export function EditEventDialog({
  event,
  mode: initialMode,
  onClose,
  onSuccess,
}: EditEventDialogProps) {
  const [mode, setMode] = useState(initialMode)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    eventType: event.eventType as EventType,
    eventName: event.eventName || '',
    description: event.description || '',
    location: event.location || '',
    address: event.address || '',
    city: event.city || '',
    country: event.country || '',
    eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    durationHours: event.durationHours?.toString() || '',
    pricePerPerson: event.pricePerPerson?.toString() || '',
    totalPrice: event.totalPrice?.toString() || '',
    currency: event.currency || 'USD',
    bookingReference: event.bookingReference || '',
    contactPerson: event.contactPerson || '',
    contactPhone: event.contactPhone || '',
    contactEmail: event.contactEmail || '',
    websiteUrl: event.websiteUrl || '',
    dressCode: event.dressCode || '',
    specialInstructions: event.specialInstructions || '',
    status: event.status || 'PENDING',
    notes: event.notes || '',
  })

  const handleSubmit = async () => {
    if (!formData.eventName || !formData.eventType) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/travel/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventDate: formData.eventDate ? new Date(formData.eventDate) : null,
          durationHours: formData.durationHours ? parseFloat(formData.durationHours) : null,
          pricePerPerson: formData.pricePerPerson ? parseFloat(formData.pricePerPerson) : null,
          totalPrice: formData.totalPrice ? parseFloat(formData.totalPrice) : null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(`Failed to update event: ${result.error}`)
      }
    } catch (error) {
      alert('Error updating event. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const formatDate = (date: string | null | undefined) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatCurrency = (amount: number | null | undefined, currency: string) => {
      if (!amount) return '-'
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD'
      }).format(amount)
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${event.eventName} - Event Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #1e40af; margin: 0 0 10px 0; font-size: 28px; }
            .header .type { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 600; }
            .section { margin-bottom: 25px; }
            .section h2 { color: #374151; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .field { margin-bottom: 10px; }
            .field-label { font-size: 12px; color: #6b7280; margin-bottom: 2px; text-transform: uppercase; }
            .field-value { font-size: 14px; font-weight: 500; }
            .description { background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-confirmed { background: #d1fae5; color: #065f46; }
            .status-cancelled { background: #fee2e2; color: #991b1b; }
            .status-completed { background: #dbeafe; color: #1e40af; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${event.eventName}</h1>
            <span class="type">${event.eventType}</span>
            <span class="status status-${event.status.toLowerCase()}" style="margin-left: 10px;">${event.status}</span>
          </div>

          <div class="section">
            <h2>Date & Time</h2>
            <div class="grid">
              <div class="field">
                <div class="field-label">Date</div>
                <div class="field-value">${formatDate(event.eventDate)}</div>
              </div>
              <div class="field">
                <div class="field-label">Time</div>
                <div class="field-value">${event.startTime || '-'}${event.endTime ? ' - ' + event.endTime : ''}</div>
              </div>
              <div class="field">
                <div class="field-label">Duration</div>
                <div class="field-value">${event.durationHours ? event.durationHours + ' hours' : '-'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Location</h2>
            <div class="grid">
              <div class="field">
                <div class="field-label">Venue</div>
                <div class="field-value">${event.location || '-'}</div>
              </div>
              <div class="field">
                <div class="field-label">Address</div>
                <div class="field-value">${event.address || '-'}</div>
              </div>
              <div class="field">
                <div class="field-label">City</div>
                <div class="field-value">${event.city || '-'}</div>
              </div>
              <div class="field">
                <div class="field-label">Country</div>
                <div class="field-value">${event.country || '-'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Pricing</h2>
            <div class="grid">
              <div class="field">
                <div class="field-label">Price Per Person</div>
                <div class="field-value">${formatCurrency(event.pricePerPerson, event.currency || 'USD')}</div>
              </div>
              <div class="field">
                <div class="field-label">Total Price</div>
                <div class="field-value">${formatCurrency(event.totalPrice, event.currency || 'USD')}</div>
              </div>
              <div class="field">
                <div class="field-label">Booking Reference</div>
                <div class="field-value">${event.bookingReference || '-'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Contact Information</h2>
            <div class="grid">
              <div class="field">
                <div class="field-label">Contact Person</div>
                <div class="field-value">${event.contactPerson || '-'}</div>
              </div>
              <div class="field">
                <div class="field-label">Phone</div>
                <div class="field-value">${event.contactPhone || '-'}</div>
              </div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">${event.contactEmail || '-'}</div>
              </div>
              <div class="field">
                <div class="field-label">Website</div>
                <div class="field-value">${event.websiteUrl || '-'}</div>
              </div>
            </div>
          </div>

          ${event.dressCode || event.specialInstructions ? `
          <div class="section">
            <h2>Additional Details</h2>
            <div class="grid">
              ${event.dressCode ? `
              <div class="field">
                <div class="field-label">Dress Code</div>
                <div class="field-value">${event.dressCode}</div>
              </div>
              ` : ''}
              ${event.specialInstructions ? `
              <div class="field">
                <div class="field-label">Special Instructions</div>
                <div class="field-value">${event.specialInstructions}</div>
              </div>
              ` : ''}
            </div>
          </div>
          ` : ''}

          ${event.description || event.notes ? `
          <div class="description">
            ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
            ${event.notes ? `<p><strong>Notes:</strong> ${event.notes}</p>` : ''}
          </div>
          ` : ''}

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const formatCurrency = (amount: number | null | undefined, currency: string) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Preview Mode
  if (mode === 'preview') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">{event.eventName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded">{event.eventType}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    event.status === 'CONFIRMED' ? 'bg-green-400 text-green-900' :
                    event.status === 'CANCELLED' ? 'bg-red-400 text-red-900' :
                    event.status === 'COMPLETED' ? 'bg-blue-400 text-blue-900' :
                    'bg-yellow-400 text-yellow-900'
                  }`}>{event.status}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => setMode('edit')}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Date & Time */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Date & Time
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(event.eventDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Start Time</p>
                  <p className="font-medium">{event.startTime || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">End Time</p>
                  <p className="font-medium">{event.endTime || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{event.durationHours ? `${event.durationHours} hrs` : '-'}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Venue</p>
                  <p className="font-medium">{event.location || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium">{event.address || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="font-medium">{event.city || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="font-medium">{event.country || '-'}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Pricing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Price/Person</p>
                  <p className="font-medium">{formatCurrency(event.pricePerPerson, event.currency || 'USD')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Price</p>
                  <p className="font-medium text-green-700">{formatCurrency(event.totalPrice, event.currency || 'USD')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Currency</p>
                  <p className="font-medium">{event.currency || 'USD'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Booking Ref</p>
                  <p className="font-medium">{event.bookingReference || '-'}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Contact Person</p>
                  <p className="font-medium">{event.contactPerson || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{event.contactPhone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{event.contactEmail || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Website</p>
                  <p className="font-medium truncate">{event.websiteUrl ? (
                    <a href={event.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {event.websiteUrl}
                    </a>
                  ) : '-'}</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {(event.dressCode || event.specialInstructions) && (
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <Shirt className="w-4 h-4" />
                  Additional Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {event.dressCode && (
                    <div>
                      <p className="text-xs text-gray-500">Dress Code</p>
                      <p className="font-medium">{event.dressCode}</p>
                    </div>
                  )}
                  {event.specialInstructions && (
                    <div>
                      <p className="text-xs text-gray-500">Special Instructions</p>
                      <p className="font-medium">{event.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description & Notes */}
            {(event.description || event.notes) && (
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description & Notes
                </h3>
                {event.description && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                )}
                {event.notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700">{event.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setMode('edit')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit Event
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Edit Mode
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Edit Event</h2>
              <p className="text-blue-100 text-sm">{event.eventName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('preview')}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Event Type & Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MEETING">Meeting</option>
                <option value="CONFERENCE">Conference</option>
                <option value="TOUR">Tour</option>
                <option value="ACTIVITY">Activity</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="DINING">Dining</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hrs)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.durationHours}
                onChange={(e) => setFormData({ ...formData, durationHours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price/Person
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerPerson}
                onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalPrice}
                onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="QAR">QAR</option>
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Reference
              </label>
              <input
                type="text"
                value={formData.bookingReference}
                onChange={(e) => setFormData({ ...formData, bookingReference: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dress Code
              </label>
              <input
                type="text"
                value={formData.dressCode}
                onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Website & Special Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <input
                type="text"
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.eventName || !formData.eventType}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
