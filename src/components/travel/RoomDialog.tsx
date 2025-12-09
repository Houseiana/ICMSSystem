'use client'

import { useState, useEffect } from 'react'
import { X, Save, Plus, DoorOpen, Users } from 'lucide-react'

interface PassengerData {
  id: number
  personType: string
  personId: number
  personDetails?: {
    fullName?: string
    firstName?: string
    lastName?: string
    companyName?: string
  }
}

interface RoomAssignment {
  id?: number
  personType: string
  personId: number
}

interface RoomData {
  id?: number
  tripHotelId: number
  unitCategory: string
  roomNumber?: string
  bathrooms?: number
  hasPantry: boolean
  guestNumbers?: number
  bedType?: string
  connectedToRoom?: string
  pricePerNight?: number
  includesBreakfast: boolean
  websiteUrl?: string
  assignments?: RoomAssignment[]
}

interface RoomDialogProps {
  hotelId: number
  room?: RoomData | null
  passengers: PassengerData[]
  existingRooms?: any[]
  onClose: () => void
  onSuccess: () => void
}

export function RoomDialog({
  hotelId,
  room,
  passengers,
  existingRooms = [],
  onClose,
  onSuccess,
}: RoomDialogProps) {
  const [loading, setLoading] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState<number[]>([])
  const isEditing = !!room?.id

  const [formData, setFormData] = useState({
    unitCategory: room?.unitCategory || 'Room',
    roomNumber: room?.roomNumber || '',
    bathrooms: room?.bathrooms?.toString() || '',
    hasPantry: room?.hasPantry || false,
    guestNumbers: room?.guestNumbers?.toString() || '',
    bedType: room?.bedType || '',
    connectedToRoom: room?.connectedToRoom || '',
    pricePerNight: room?.pricePerNight?.toString() || '',
    includesBreakfast: room?.includesBreakfast || false,
    websiteUrl: room?.websiteUrl || '',
  })

  // Initialize selected guests from existing room assignments
  useEffect(() => {
    if (room?.assignments && room.assignments.length > 0) {
      const guestIds = room.assignments.map((a) => {
        // Find the passenger that matches this assignment
        const passenger = passengers.find(
          (p) => p.personType === a.personType && p.personId === a.personId
        )
        return passenger?.id || 0
      }).filter((id) => id > 0)
      setSelectedGuests(guestIds)
    }
  }, [room, passengers])

  const toggleGuest = (passengerId: number) => {
    setSelectedGuests((prev) =>
      prev.includes(passengerId)
        ? prev.filter((id) => id !== passengerId)
        : [...prev, passengerId]
    )
  }

  const getPassengerName = (passenger: PassengerData): string => {
    const details = passenger.personDetails as any
    return (
      details?.fullName ||
      details?.companyName ||
      `${details?.firstName || ''} ${details?.lastName || ''}`.trim() ||
      `${passenger.personType} #${passenger.personId}`
    )
  }

  // Get other rooms for "connected to" dropdown (exclude current room)
  const otherRooms = existingRooms.filter((r) => r.id !== room?.id)

  const handleSubmit = async () => {
    if (!formData.unitCategory) {
      alert('Please select a room category')
      return
    }

    setLoading(true)
    try {
      // Build assignments from selected guests
      const assignments = selectedGuests.map((guestId) => {
        const passenger = passengers.find((p) => p.id === guestId)
        return {
          personType: passenger?.personType || '',
          personId: passenger?.personId || 0,
        }
      }).filter((a) => a.personType && a.personId)

      const url = isEditing
        ? `/api/travel/hotels/${hotelId}/rooms/${room.id}`
        : `/api/travel/hotels/${hotelId}/rooms`

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          guestNumbers: formData.guestNumbers ? parseInt(formData.guestNumbers) : null,
          pricePerNight: formData.pricePerNight ? parseFloat(formData.pricePerNight) : null,
          assignments,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(`Failed to ${isEditing ? 'update' : 'add'} room: ${result.error}`)
      }
    } catch (error) {
      alert(`Error ${isEditing ? 'updating' : 'adding'} room. Please try again.`)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DoorOpen className="w-6 h-6 text-blue-600" />
              {isEditing ? 'Edit Room' : 'Add Room'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing ? 'Update room details and guest assignments' : 'Add a new room to this hotel booking'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Room Category & Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unitCategory}
                onChange={(e) => setFormData({ ...formData, unitCategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Room">Room</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Presidential Suite">Presidential Suite</option>
                <option value="Family Room">Family Room</option>
                <option value="Connecting Room">Connecting Room</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g., 501, 12A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bed Type & Guest Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bed Type
              </label>
              <select
                value={formData.bedType}
                onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select bed type...</option>
                <option value="Single Bed">Single Bed</option>
                <option value="Twin Beds">Twin Beds</option>
                <option value="Double Bed">Double Bed</option>
                <option value="Queen Bed">Queen Bed</option>
                <option value="King Bed">King Bed</option>
                <option value="Super King Bed">Super King Bed</option>
                <option value="Two Double Beds">Two Double Beds</option>
                <option value="Sofa Bed">Sofa Bed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Capacity
              </label>
              <input
                type="number"
                min="1"
                value={formData.guestNumbers}
                onChange={(e) => setFormData({ ...formData, guestNumbers: e.target.value })}
                placeholder="e.g., 2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bathrooms & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="e.g., 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Night
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                placeholder="e.g., 250.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Connected Room */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connected To Room
            </label>
            {otherRooms.length > 0 ? (
              <select
                value={formData.connectedToRoom}
                onChange={(e) => setFormData({ ...formData, connectedToRoom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Not connected</option>
                {otherRooms.map((r) => (
                  <option key={r.id} value={r.roomNumber || `${r.unitCategory} ${r.id}`}>
                    {r.roomNumber ? `Room #${r.roomNumber}` : `${r.unitCategory} ${r.id}`} - {r.unitCategory}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.connectedToRoom}
                onChange={(e) => setFormData({ ...formData, connectedToRoom: e.target.value })}
                placeholder="e.g., Room 502"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Details URL
            </label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://hotel.com/room-details"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.hasPantry}
                onChange={(e) => setFormData({ ...formData, hasPantry: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-900">Has Pantry/Kitchen</p>
                <p className="text-xs text-gray-500">Room includes a pantry or kitchenette</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.includesBreakfast}
                onChange={(e) => setFormData({ ...formData, includesBreakfast: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-900">Includes Breakfast</p>
                <p className="text-xs text-gray-500">Breakfast is included with this room</p>
              </div>
            </label>
          </div>

          {/* Guest Assignments */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Room Guests</h3>
              <span className="text-sm text-gray-500">
                ({selectedGuests.length} assigned)
              </span>
            </div>

            {passengers.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {passengers.map((passenger) => {
                  const isSelected = selectedGuests.includes(passenger.id)
                  const passengerName = getPassengerName(passenger)

                  return (
                    <label
                      key={passenger.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleGuest(passenger.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {passengerName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{passengerName}</p>
                        <p className="text-xs text-gray-500">{passenger.personType}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No passengers available</p>
                <p className="text-xs text-gray-400">Add passengers to the travel request first</p>
              </div>
            )}
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
            disabled={loading || !formData.unitCategory}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEditing ? 'Saving...' : 'Adding...'}</span>
              </>
            ) : (
              <>
                {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Add Room'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
