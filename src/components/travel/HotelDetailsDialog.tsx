'use client'

import { useState } from 'react'
import { X, Hotel, DoorOpen, Edit, Trash2, ExternalLink, Plus, Eye } from 'lucide-react'
import { TripHotel } from '@/types/travel'
import { RoomDialog } from './RoomDialog'

interface HotelDetailsDialogProps {
  hotel: TripHotel
  passengers?: any[]
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onRefresh: () => void
}

export function HotelDetailsDialog({
  hotel,
  passengers = [],
  onClose,
  onEdit,
  onDelete,
  onRefresh,
}: HotelDetailsDialogProps) {
  const [showRoomDialog, setShowRoomDialog] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
  const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null)

  const getPassengerName = (assignment: any) => {
    // Find passenger from the passengers list by matching personType and personId
    const passenger = passengers.find(
      (p) => p.personType === assignment.personType && p.personId === assignment.personId
    )
    if (passenger?.personDetails) {
      const details = passenger.personDetails as any
      return details.fullName || details.companyName || `${details.firstName || ''} ${details.lastName || ''}`.trim() || `Guest`
    }
    return `${assignment.personType} #${assignment.personId}`
  }

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return
    }

    setDeletingRoomId(roomId)
    try {
      const response = await fetch(`/api/travel/hotels/${hotel.id}/rooms/${roomId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        onRefresh()
      } else {
        alert(`Failed to delete room: ${result.error}`)
      }
    } catch (error) {
      alert('Error deleting room. Please try again.')
      console.error(error)
    } finally {
      setDeletingRoomId(null)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Hotel className="w-6 h-6 text-blue-600" />
                Hotel Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">{hotel.hotelName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Hotel Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Hotel Name</h3>
                <p className="text-gray-900">{hotel.hotelName}</p>
              </div>

              {hotel.address && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                  <p className="text-gray-900">{hotel.address}</p>
                </div>
              )}

              {hotel.city && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">City</h3>
                  <p className="text-gray-900">{hotel.city}</p>
                </div>
              )}

              {hotel.country && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Country</h3>
                  <p className="text-gray-900">{hotel.country}</p>
                </div>
              )}

              {hotel.phone && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                  <p className="text-gray-900">{hotel.phone}</p>
                </div>
              )}

              {hotel.email && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p className="text-gray-900">{hotel.email}</p>
                </div>
              )}

              {hotel.checkInDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Check-in Date</h3>
                  <p className="text-gray-900">
                    {new Date(hotel.checkInDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {hotel.checkOutDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Check-out Date</h3>
                  <p className="text-gray-900">
                    {new Date(hotel.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {hotel.confirmationNumber && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Confirmation Number
                  </h3>
                  <p className="text-gray-900">{hotel.confirmationNumber}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {hotel.status}
                </span>
              </div>
            </div>

            {hotel.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{hotel.notes}</p>
              </div>
            )}

            {/* Rooms Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DoorOpen className="w-5 h-5 text-blue-600" />
                  Rooms ({hotel.rooms?.length || 0})
                </h3>
                <button
                  onClick={() => {
                    setSelectedRoom(null)
                    setShowRoomDialog(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Room
                </button>
              </div>

              {hotel.rooms && hotel.rooms.length > 0 ? (
                <div className="space-y-4">
                  {hotel.rooms.map((room, index) => (
                    <div
                      key={room.id}
                      className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {room.unitCategory}
                          </h4>
                          {room.roomNumber && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              Room #{room.roomNumber}
                            </span>
                          )}
                          {room.connectedToRoom && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              Connected to {room.connectedToRoom}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedRoom(room)
                              setShowRoomDialog(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit room"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            disabled={deletingRoomId === room.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete room"
                          >
                            {deletingRoomId === room.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Room Category</p>
                          <p className="text-sm text-gray-900">{room.unitCategory}</p>
                        </div>

                        {room.pricePerNight !== null && room.pricePerNight !== undefined && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Price Per Night</p>
                            <p className="text-sm font-semibold text-blue-600">${room.pricePerNight.toFixed(2)}</p>
                          </div>
                        )}

                        {room.bedType && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Bed Type</p>
                            <p className="text-sm text-gray-900">{room.bedType}</p>
                          </div>
                        )}

                        {room.bathrooms !== null && room.bathrooms !== undefined && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Bathrooms</p>
                            <p className="text-sm text-gray-900">{room.bathrooms}</p>
                          </div>
                        )}

                        {room.guestNumbers !== null && room.guestNumbers !== undefined && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Guest Capacity</p>
                            <p className="text-sm text-gray-900">{room.guestNumbers} {room.guestNumbers === 1 ? 'guest' : 'guests'}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Amenities</p>
                          <div className="flex flex-wrap gap-1">
                            {room.hasPantry && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Pantry</span>
                            )}
                            {room.includesBreakfast && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Breakfast</span>
                            )}
                            {!room.hasPantry && !room.includesBreakfast && (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Room Website Link */}
                      {room.websiteUrl && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs font-medium text-gray-500 mb-2">Room Details</p>
                          <a
                            href={room.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Room Photos & Details
                          </a>
                        </div>
                      )}

                      {/* Guest Assignments */}
                      {room.assignments && room.assignments.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs font-medium text-gray-500 mb-2">Assigned Guests ({room.assignments.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {room.assignments.map((assignment: any, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                              >
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                  {getPassengerName(assignment).charAt(0)}
                                </div>
                                {getPassengerName(assignment)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No guests assigned */}
                      {(!room.assignments || room.assignments.length === 0) && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs font-medium text-gray-500 mb-2">Assigned Guests</p>
                          <p className="text-sm text-gray-400 italic">No guests assigned to this room</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <DoorOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No rooms added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add Room" to add rooms to this hotel</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-between">
            <button
              onClick={onDelete}
              className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Hotel
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onEdit}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Hotel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Room Dialog */}
      {showRoomDialog && (
        <RoomDialog
          hotelId={hotel.id}
          room={selectedRoom}
          passengers={passengers}
          existingRooms={hotel.rooms || []}
          onClose={() => {
            setShowRoomDialog(false)
            setSelectedRoom(null)
          }}
          onSuccess={() => {
            setShowRoomDialog(false)
            setSelectedRoom(null)
            onRefresh()
          }}
        />
      )}
    </>
  )
}
