'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Hotel, Trash2, DoorOpen } from 'lucide-react'
import { CountryCitySelector } from '@/components/common/CountryCitySelector'
// HotelStatus type removed - using string instead

interface GuestAssignment {
  passengerId: number
  passengerName: string
}

interface RoomFormData {
  unitCategory: string
  roomNumber: string
  bathrooms: number | null
  hasPantry: boolean
  guestNumbers: number | null
  bedType: string
  connectedToRoom: string
  pricePerNight: number | null
  includesBreakfast: boolean
  guests: GuestAssignment[]
}

interface AddHotelDialogProps {
  travelRequestId: number
  passengers?: any[]
  onClose: () => void
  onSuccess: () => void
}

export function AddHotelDialog({
  travelRequestId,
  passengers = [],
  onClose,
  onSuccess,
}: AddHotelDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hotelName: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    confirmationNumber: '',
    status: 'PENDING',
    notes: '',
  })

  const [rooms, setRooms] = useState<RoomFormData[]>([])

  useEffect(() => {
    console.log('Rooms state changed:', rooms.length, rooms)
  }, [rooms])

  const addRoom = () => {
    const newRoom: RoomFormData = {
      unitCategory: 'Room',
      roomNumber: '',
      bathrooms: null,
      hasPantry: false,
      guestNumbers: null,
      bedType: '',
      connectedToRoom: '',
      pricePerNight: null,
      includesBreakfast: false,
      guests: [],
    }
    const updatedRooms = [...rooms, newRoom]
    console.log('Adding room. New rooms array:', updatedRooms)
    setRooms(updatedRooms)
  }

  const addGuestToRoom = (roomIndex: number, passengerId: number, passengerName: string) => {
    const updatedRooms = [...rooms]
    updatedRooms[roomIndex].guests.push({ passengerId, passengerName })
    setRooms(updatedRooms)
  }

  const removeGuestFromRoom = (roomIndex: number, guestIndex: number) => {
    const updatedRooms = [...rooms]
    updatedRooms[roomIndex].guests = updatedRooms[roomIndex].guests.filter((_, idx) => idx !== guestIndex)
    setRooms(updatedRooms)
  }

  const removeRoom = (index: number) => {
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
      const payload = {
        travelRequestId,
        ...formData,
        checkInDate: formData.checkInDate ? new Date(formData.checkInDate) : null,
        checkOutDate: formData.checkOutDate ? new Date(formData.checkOutDate) : null,
        rooms: rooms.length > 0 ? rooms.map(room => ({
          unitCategory: room.unitCategory,
          roomNumber: room.roomNumber,
          bathrooms: room.bathrooms,
          hasPantry: room.hasPantry,
          guestNumbers: room.guestNumbers,
          bedType: room.bedType,
          connectedToRoom: room.connectedToRoom,
          pricePerNight: room.pricePerNight,
          includesBreakfast: room.includesBreakfast,
          assignments: room.guests.map(guest => ({
            personType: 'PASSENGER',
            personId: guest.passengerId
          }))
        })) : undefined,
      }

      console.log('Submitting hotel with rooms:', {
        hotelName: payload.hotelName,
        roomsCount: payload.rooms?.length || 0,
        rooms: payload.rooms
      })

      const response = await fetch('/api/travel/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      console.log('API response:', result)

      if (result.success) {
        alert(`Hotel added successfully with ${result.data?.rooms?.length || 0} room(s)!`)
        onSuccess()
        onClose()
      } else {
        alert(`Failed to add hotel: ${result.error}`)
      }
    } catch (error) {
      alert('Error adding hotel. Please try again.')
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
              Add Hotel
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add hotel accommodation to this travel request
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 1535 Broadway"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* City & Country */}
          <CountryCitySelector
            country={formData.country}
            city={formData.city}
            onCountryChange={(country) => setFormData({ ...formData, country })}
            onCityChange={(city) => setFormData({ ...formData, city })}
            required={true}
          />

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., +1 212 123 4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
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
                onChange={(e) => setFormData({ ...formData, confirmationNumber: e.target.value })}
                placeholder="e.g., CONF123456"
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
                <option value="CHECKED_IN">Checked In</option>
                <option value="CHECKED_OUT">Checked Out</option>
              </select>
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
                <p className="text-sm text-gray-500 mt-1">
                  Add room details for this hotel booking
                </p>
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
                          onChange={(e) => updateRoom(index, 'bathrooms', e.target.value ? parseInt(e.target.value) : null)}
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
                          onChange={(e) => updateRoom(index, 'guestNumbers', e.target.value ? parseInt(e.target.value) : null)}
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
                          onChange={(e) => updateRoom(index, 'pricePerNight', e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="e.g., 150.00"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
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

                    {/* Guest Assignments */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Assigned Guests
                        </label>
                        {passengers.length > 0 && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                const passenger = passengers.find(p => p.id === parseInt(e.target.value))
                                if (passenger) {
                                  addGuestToRoom(index, passenger.id, passenger.personDetails?.fullName || 'Unknown')
                                  e.target.value = ''
                                }
                              }
                            }}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">+ Add Guest</option>
                            {passengers
                              .filter(p => !room.guests.some(g => g.passengerId === p.id))
                              .map(passenger => (
                                <option key={passenger.id} value={passenger.id}>
                                  {passenger.personDetails?.fullName || 'Unknown'}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>

                      {room.guests.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No guests assigned yet</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {room.guests.map((guest, guestIdx) => (
                            <span
                              key={guestIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              <span>{guest.passengerName}</span>
                              <button
                                type="button"
                                onClick={() => removeGuestFromRoom(index, guestIdx)}
                                className="hover:text-blue-900"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
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
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Hotel</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
