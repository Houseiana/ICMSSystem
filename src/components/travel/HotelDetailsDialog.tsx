'use client'

import { useState } from 'react'
import { X, Hotel, DoorOpen, Edit, Trash2 } from 'lucide-react'
import { TripHotel } from '@/types/travel'

interface HotelDetailsDialogProps {
  hotel: TripHotel
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function HotelDetailsDialog({
  hotel,
  onClose,
  onEdit,
  onDelete,
}: HotelDetailsDialogProps) {
  return (
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
          {hotel.rooms && hotel.rooms.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <DoorOpen className="w-5 h-5 text-blue-600" />
                Rooms ({hotel.rooms.length})
              </h3>
              <div className="space-y-4">
                {hotel.rooms.map((room, index) => (
                  <div
                    key={room.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-900 mb-3">
                      Room {index + 1}
                      {room.roomNumber && ` - #${room.roomNumber}`}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Unit Category:</span>
                        <span className="ml-2 text-gray-900">{room.unitCategory}</span>
                      </div>
                      {room.bathrooms && (
                        <div>
                          <span className="text-gray-500">Bathrooms:</span>
                          <span className="ml-2 text-gray-900">{room.bathrooms}</span>
                        </div>
                      )}
                      {room.guestNumbers && (
                        <div>
                          <span className="text-gray-500">Guests:</span>
                          <span className="ml-2 text-gray-900">{room.guestNumbers}</span>
                        </div>
                      )}
                      {room.bedType && (
                        <div>
                          <span className="text-gray-500">Bed Type:</span>
                          <span className="ml-2 text-gray-900">{room.bedType}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Pantry:</span>
                        <span className="ml-2 text-gray-900">
                          {room.hasPantry ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Breakfast:</span>
                        <span className="ml-2 text-gray-900">
                          {room.includesBreakfast ? 'Included' : 'Not Included'}
                        </span>
                      </div>
                      {room.pricePerNight && (
                        <div>
                          <span className="text-gray-500">Price/Night:</span>
                          <span className="ml-2 text-gray-900">
                            ${room.pricePerNight.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {room.connectedToRoom && (
                        <div className="md:col-span-3">
                          <span className="text-gray-500">Connected to:</span>
                          <span className="ml-2 text-gray-900">{room.connectedToRoom}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
  )
}
