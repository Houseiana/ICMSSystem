# Frontend Implementation Guide - Travel Management System

## 🎯 Overview

This guide provides the complete roadmap and code structure to build the Travel Management System frontend UI.

---

## 📁 Project Structure

```
src/
├── app/
│   └── travel/
│       ├── page.tsx                    # Travel requests list
│       ├── new/
│       │   └── page.tsx                # Create new request
│       └── [id]/
│           └── page.tsx                # Request detail with tabs
├── components/
│   └── travel/
│       ├── TravelRequestCard.tsx       # Request card
│       ├── TravelRequestForm.tsx       # Create/edit form
│       ├── PassengersTab.tsx           # Passengers management
│       ├── FlightsTab.tsx              # Flights management
│       ├── HotelsTab.tsx               # Hotels management
│       ├── EventsTab.tsx               # Events management
│       ├── SendDetailsDialog.tsx       # Send details dialog ⭐
│       ├── StatusBadge.tsx             # Status badge
│       ├── PersonSearch.tsx            # Person search/select
│       └── CommunicationHistory.tsx    # Communication log
├── hooks/
│   └── travel/
│       ├── useTravelRequests.ts        # Fetch requests
│       ├── useTravelRequest.ts         # Fetch single request
│       ├── usePassengers.ts            # Manage passengers
│       └── useSendDetails.ts           # Send details hook
└── types/
    └── travel.ts                        # ✅ Already created
```

---

## 🚀 Quick Start Implementation Order

### Phase 1: Core Infrastructure (1-2 hours)
1. ✅ Status Badge Component
2. ✅ Person Search Component
3. ✅ Custom hooks for API calls

### Phase 2: List & Create (2-3 hours)
4. ✅ Travel Requests List Page
5. ✅ Travel Request Form
6. ✅ Create New Request Page

### Phase 3: Detail View (3-4 hours)
7. ✅ Travel Request Detail Page
8. ✅ Tab Navigation
9. ✅ Passengers Tab
10. ✅ Flights Tab
11. ✅ Hotels Tab
12. ✅ Events Tab

### Phase 4: Star Feature (1-2 hours)
13. ✅ Send Details Dialog ⭐

### Phase 5: Additional Features (2-3 hours)
14. ✅ Communication History
15. ✅ Status Timeline
16. ✅ Dashboard (optional)

---

## 📦 Required Dependencies

All dependencies are already installed:
- ✅ Next.js 14
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Lucide React (icons)

---

## 🎨 UI Components Library

Since you have `lucide-react` installed, we'll use that for icons. For UI components, we'll build them with Tailwind CSS.

### Color Scheme
```css
/* Status Colors */
REQUEST: bg-blue-100 text-blue-800
PLANNING: bg-purple-100 text-purple-800
CONFIRMING: bg-yellow-100 text-yellow-800
EXECUTING: bg-orange-100 text-orange-800
COMPLETED: bg-green-100 text-green-800
CANCELLED: bg-red-100 text-red-800
```

---

## 📝 Component Templates

### 1. Status Badge Component
**File**: `src/components/travel/StatusBadge.tsx`

```tsx
import { TravelRequestStatus } from '@/types/travel'

interface StatusBadgeProps {
  status: TravelRequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    REQUEST: 'bg-blue-100 text-blue-800',
    PLANNING: 'bg-purple-100 text-purple-800',
    CONFIRMING: 'bg-yellow-100 text-yellow-800',
    EXECUTING: 'bg-orange-100 text-orange-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}
```

### 2. Custom Hook for Travel Requests
**File**: `src/hooks/travel/useTravelRequests.ts`

```tsx
import { useState, useEffect } from 'react'
import { TravelRequest, ApiResponse } from '@/types/travel'

export function useTravelRequests(filters?: {
  status?: string
  startDate?: string
  endDate?: string
}) {
  const [data, setData] = useState<TravelRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (filters?.status) params.set('status', filters.status)
        if (filters?.startDate) params.set('startDate', filters.startDate)
        if (filters?.endDate) params.set('endDate', filters.endDate)

        const response = await fetch(`/api/travel/requests?${params}`)
        const result: ApiResponse<TravelRequest[]> = await response.json()

        if (result.success && result.data) {
          setData(result.data)
        } else {
          setError(result.error || 'Failed to fetch requests')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [filters?.status, filters?.startDate, filters?.endDate])

  return { data, loading, error, refetch: () => {} }
}
```

### 3. Travel Requests List Page
**File**: `src/app/travel/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useTravelRequests } from '@/hooks/travel/useTravelRequests'
import { StatusBadge } from '@/components/travel/StatusBadge'
import { Plane, Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function TravelRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const { data, loading, error } = useTravelRequests({ status: statusFilter })

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Plane className="w-8 h-8" />
            Travel Requests
          </h1>
          <p className="text-gray-600 mt-2">Manage all travel requests and itineraries</p>
        </div>
        <Link
          href="/travel/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="REQUEST">Request</option>
          <option value="PLANNING">Planning</option>
          <option value="CONFIRMING">Confirming</option>
          <option value="EXECUTING">Executing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((request) => (
          <Link
            key={request.id}
            href={`/travel/${request.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{request.requestNumber}</h3>
                <p className="text-sm text-gray-500">
                  {request.tripStartDate && new Date(request.tripStartDate).toLocaleDateString()}
                  {' - '}
                  {request.tripEndDate && new Date(request.tripEndDate).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            {request.destinations && request.destinations.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700">Destinations:</p>
                <p className="text-sm text-gray-600">
                  {request.destinations.map(d => `${d.city}, ${d.country}`).join(' • ')}
                </p>
              </div>
            )}

            <div className="flex gap-4 text-sm text-gray-500 mt-4 pt-4 border-t">
              <span>✈️ {request.flights?.length || 0} Flights</span>
              <span>🏨 {request.hotels?.length || 0} Hotels</span>
              <span>🎭 {request.events?.length || 0} Events</span>
            </div>
          </Link>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Plane className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>No travel requests found</p>
        </div>
      )}
    </div>
  )
}
```

### 4. Send Details Dialog ⭐
**File**: `src/components/travel/SendDetailsDialog.tsx`

```tsx
'use client'

import { useState } from 'react'
import { Send, X } from 'lucide-react'
import { ContentType, CommunicationType } from '@/types/travel'

interface SendDetailsDialogProps {
  travelRequestId: number
  passengers: any[]
  onClose: () => void
  onSuccess: () => void
}

export function SendDetailsDialog({
  travelRequestId,
  passengers,
  onClose,
  onSuccess
}: SendDetailsDialogProps) {
  const [selectedPassengers, setSelectedPassengers] = useState<number[]>([])
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [communicationType, setCommunicationType] = useState<CommunicationType>('EMAIL')
  const [customMessage, setCustomMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/travel/passengers/send-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelRequestId,
          passengerIds: selectedPassengers,
          contentTypes,
          communicationType,
          customMessage
        })
      })

      const result = await response.json()
      if (result.success) {
        alert(`Sent details to ${result.data.communicationsSent} recipient(s)`)
        onSuccess()
        onClose()
      } else {
        alert('Failed to send details: ' + result.error)
      }
    } catch (error) {
      alert('Error sending details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Send Travel Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Passengers */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Select Passengers</label>
          <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
            {passengers.map((passenger) => (
              <label key={passenger.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPassengers.includes(passenger.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPassengers([...selectedPassengers, passenger.id])
                    } else {
                      setSelectedPassengers(selectedPassengers.filter(id => id !== passenger.id))
                    }
                  }}
                  className="rounded"
                />
                <span>{passenger.personDetails?.fullName || 'Unknown'}</span>
                {passenger.isMainPassenger && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Main</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Content Types */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">What to Send</label>
          <div className="space-y-2">
            {[
              { value: 'FLIGHT_DETAILS', label: 'Flight Details' },
              { value: 'HOTEL_DETAILS', label: 'Hotel Details' },
              { value: 'EVENT_DETAILS', label: 'Events & Activities' },
              { value: 'FULL_ITINERARY', label: 'Full Itinerary' }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contentTypes.includes(option.value as ContentType)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setContentTypes([...contentTypes, option.value as ContentType])
                    } else {
                      setContentTypes(contentTypes.filter(t => t !== option.value))
                    }
                  }}
                  className="rounded"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Communication Type */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Send Via</label>
          <div className="flex gap-4">
            {[
              { value: 'EMAIL', label: 'Email' },
              { value: 'WHATSAPP', label: 'WhatsApp' },
              { value: 'BOTH', label: 'Both' }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="communicationType"
                  value={option.value}
                  checked={communicationType === option.value}
                  onChange={(e) => setCommunicationType(e.target.value as CommunicationType)}
                  className="rounded-full"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Custom Message (Optional)</label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
            placeholder="Add a personal message..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || selectedPassengers.length === 0 || contentTypes.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Sending...' : 'Send Details'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## 🔗 API Integration Pattern

All components should use this pattern:

```tsx
// Fetch data
const response = await fetch('/api/travel/requests')
const result: ApiResponse<TravelRequest[]> = await response.json()

if (result.success && result.data) {
  // Use data
} else {
  // Handle error
  console.error(result.error)
}
```

---

## 📱 Responsive Design

All components use Tailwind's responsive classes:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

---

## 🎯 Next Steps

1. Create the files in this guide
2. Test each component individually
3. Connect to the backend API
4. Add error handling and loading states
5. Implement remaining tabs (Flights, Hotels, Events)
6. Add form validation
7. Implement optimistic UI updates

---

## 📚 Additional Resources

- **API Documentation**: [TRAVEL_API_DOCUMENTATION.md](./TRAVEL_API_DOCUMENTATION.md)
- **Type Definitions**: [src/types/travel.ts](./src/types/travel.ts)
- **Backend Summary**: [TRAVEL_SYSTEM_IMPLEMENTATION_SUMMARY.md](./TRAVEL_SYSTEM_IMPLEMENTATION_SUMMARY.md)

---

**The backend is ready. Start building these components and you'll have a fully functional Travel Management System!** 🚀
