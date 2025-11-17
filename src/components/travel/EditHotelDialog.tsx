'use client'

import { useState } from 'react'
import { X, Save, Hotel, DoorOpen, Plus, Trash2 } from 'lucide-react'
import { TripHotel, TripHotelRoom } from '@/types/travel'

interface RoomFormData {
  id?: number
  unitCategory: string
  roomNumber: string
  bathrooms: number | null
  hasPantry: boolean
  guestNumbers: number | null
  bedType: string
  connectedToRoom: string
  pricePerNight: number | null
}

interface EditHotelDialogProps {
  hotel: TripHotel
  onClose: () => void
  onSuccess: () => void
}

export function EditHotelDialog({
  hotel,
  onClose,
  onSuccess,
}: EditHotelDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hotelName: hotel.hotelName,
    address: hotel.address || '',
    city: hotel.city || '',
    country: hotel.country || '',
    phone: hotel.phone || '',
    email: hotel.email || '',
    checkInDate: hotel.checkInDate
      ? new Date(hotel.checkInDate).toISOString().split('T')[0]
      : '',
    checkOutDate: hotel.checkOutDate
      ? new Date(hotel.checkOutDate).toISOString().split('T')[0]
      : '',
    confirmationNumber: hotel.confirmationNumber || '',
    status: hotel.status,
    notes: hotel.notes || '',
  })

  const [rooms, setRooms] = useState<RoomFormData[]>(
    hotel.rooms?.map((r) => ({
      id: r.id,
      unitCategory: r.unitCategory,
      roomNumber: r.roomNumber || '',
      bathrooms: r.bathrooms,
      hasPantry: r.hasPantry,
      guestNumbers: r.guestNumbers,
      bedType: r.bedType || '',
      connectedToRoom: r.connectedToRoom || '',
      pricePerNight: r.pricePerNight,
    })) || []
  )

  const [deletedRoomIds, setDeletedRoomIds] = useState<number[]>([])

  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        unitCategory: 'Room',
        roomNumber: '',
        bathrooms: null,
        hasPantry: false,
        guestNumbers: null,
        bedType: '',
        connectedToRoom: '',
        pricePerNight: null,
      },
    ])
  }

  const removeRoom = (index: number) => {
    const room = rooms[index]
    if (room.id) {
      setDeletedRoomIds([...deletedRoomIds, room.id])
    }
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const updateRoom = (index: number, field: keyof RoomFormData, value: any) => {
    const updatedRooms = [...rooms]
    updatedRooms[index] = { ...updatedRooms[index], [field]: value }
    setRooms(updatedRooms)
  }

  const handleSubmit = async () => {
    if (!formData.hotelName || !formData.city || !formData.country) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Update hotel details
      const hotelResponse = await fetch(`/api/travel/hotels/${hotel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkInDate: formData.checkInDate ? new Date(formData.checkInDate) : null,
          checkOutDate: formData.checkOutDate ? new Date(formData.checkOutDate) : null,
        }),
      })

      const hotelResult = await hotelResponse.json()

      if (!hotelResult.success) {
        alert(`Failed to update hotel: ${hotelResult.error}`)
        setLoading(false)
        return
      }

      // Delete removed rooms
      for (const roomId of deletedRoomIds) {
        await fetch(`/api/travel/hotels/${hotel.id}/rooms/${roomId}`, {
          method: 'DELETE',
        })
      }

      // Update or create rooms
      for (const room of rooms) {
        if (room.id) {
          // Update existing room
          await fetch(`/api/travel/hotels/${hotel.id}/rooms/${room.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(room),
          })
        } else {
          // Create new room
          await fetch(`/api/travel/hotels/${hotel.id}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(room),
          })
        }
      }

      onSuccess()
      onClose()
    } catch (error) {
      alert('Error updating hotel. Please try again.')
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
              <Hotel className="w-6 h-6 text-blue-600" />
              Edit Hotel
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update hotel accommodation details
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
          {/* Hotel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.hotelName}
              onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
              placeholder="e.g., Marriott Marquis"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 1535 Broadway"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., New York"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g., United States"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., +1 212 123 4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., reservations@hotel.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Check-in & Check-out Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Date
              </label>
              <input
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Date
              </label>
              <input
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmation Number
              </label>
              <input
                type="text"
                value={formData.confirmationNumber}
                onChange={(e) =>
                  setFormData({ ...formData, confirmationNumber: e.target.value })
                }
                placeholder="e.g., CONF123456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="CHECKED_OUT">Checked Out</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this hotel booking..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Rooms Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DoorOpen className="w-5 h-5 text-blue-600" />
                  Rooms
                </h3>
                <p className="text-sm text-gray-500 mt-1">Manage room details</p>
              </div>
              <button
                type="button"
                onClick={addRoom}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Room</span>
              </button>
            </div>

            {rooms.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <DoorOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No rooms added yet</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Room" to add room details</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Room {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeRoom(index)}
                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Unit Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Category
                        </label>
                        <select
                          value={room.unitCategory}
                          onChange={(e) => updateRoom(index, 'unitCategory', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Room">Room</option>
                          <option value="Suite">Suite</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Penthouse">Penthouse</option>
                          <option value="Studio">Studio</option>
                          <option value="Villa">Villa</option>
                        </select>
                      </div>

                      {/* Room Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Room Number
                        </label>
                        <input
                          type="text"
                          value={room.roomNumber}
                          onChange={(e) => updateRoom(index, 'roomNumber', e.target.value)}
                          placeholder="e.g., 405"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Bathrooms */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={room.bathrooms || ''}
                          onChange={(e) =>
                            updateRoom(
                              index,
                              'bathrooms',
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          placeholder="e.g., 2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Guest Numbers */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Guest Numbers
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={room.guestNumbers || ''}
                          onChange={(e) =>
                            updateRoom(
                              index,
                              'guestNumbers',
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          placeholder="e.g., 2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Bed Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bed Type
                        </label>
                        <select
                          value={room.bedType}
                          onChange={(e) => updateRoom(index, 'bedType', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Bed Type</option>
                          <option value="Twin bed">Twin Bed</option>
                          <option value="King bed">King Bed</option>
                          <option value="Queen bed">Queen Bed</option>
                          <option value="Double bed">Double Bed</option>
                          <option value="Single bed">Single Bed</option>
                        </select>
                      </div>

                      {/* Price Per Night */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Per Night
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={room.pricePerNight || ''}
                          onChange={(e) =>
                            updateRoom(
                              index,
                              'pricePerNight',
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                          placeholder="e.g., 150.00"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Has Pantry */}
                      <div className="flex items-center gap-2 pt-8">
                        <input
                          type="checkbox"
                          id={`pantry-${index}`}
                          checked={room.hasPantry}
                          onChange={(e) => updateRoom(index, 'hasPantry', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`pantry-${index}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          Has Pantry
                        </label>
                      </div>

                      {/* Connected to Another Room */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Connected to Room/Suite
                        </label>
                        <input
                          type="text"
                          value={room.connectedToRoom}
                          onChange={(e) => updateRoom(index, 'connectedToRoom', e.target.value)}
                          placeholder="e.g., Room 406"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
            disabled={loading || !formData.hotelName || !formData.city || !formData.country}
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
