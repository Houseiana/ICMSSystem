'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Video, Clock, Users, FileText } from 'lucide-react'

interface Meeting {
  id?: number
  title: string
  description?: string
  date: string
  startTime: string
  endTime?: string
  location?: string
  locationType: string
  meetingLink?: string
  purpose?: string
  category: string
  organizer?: string
  participants?: string[]
  status: string
  notes?: string
  outcome?: string
}

interface MeetingFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  meeting?: Meeting | null
  selectedDate: Date
}

export default function MeetingForm({
  isOpen,
  onClose,
  onSuccess,
  meeting,
  selectedDate
}: MeetingFormProps) {
  const [formData, setFormData] = useState<Meeting>({
    title: '',
    description: '',
    date: selectedDate.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '',
    location: '',
    locationType: 'IN_PERSON',
    meetingLink: '',
    purpose: '',
    category: 'GENERAL',
    organizer: '',
    participants: [],
    status: 'SCHEDULED',
    notes: '',
    outcome: ''
  })

  const [participantInput, setParticipantInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (meeting) {
      setFormData({
        ...meeting,
        date: new Date(meeting.date).toISOString().split('T')[0],
        participants: meeting.participants
          ? (typeof meeting.participants === 'string'
              ? JSON.parse(meeting.participants)
              : meeting.participants)
          : []
      })
    } else {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }))
    }
  }, [meeting, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = meeting?.id
        ? `/api/meetings/${meeting.id}`
        : '/api/meetings'

      const method = meeting?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save meeting')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addParticipant = () => {
    if (participantInput.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...(prev.participants || []), participantInput.trim()]
      }))
      setParticipantInput('')
    }
  }

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            {meeting?.id ? 'Edit Meeting' : 'New Meeting'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter meeting title"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime || ''}
                onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location Type and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Type
              </label>
              <select
                value={formData.locationType}
                onChange={e => setFormData(prev => ({ ...prev, locationType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="IN_PERSON">In Person</option>
                <option value="ONLINE">Online</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.locationType === 'ONLINE' ? 'Meeting Link' : 'Location'}
              </label>
              {formData.locationType === 'ONLINE' ? (
                <input
                  type="url"
                  value={formData.meetingLink || ''}
                  onChange={e => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://zoom.us/..."
                />
              ) : (
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Conference Room A"
                />
              )}
            </div>
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="GENERAL">General</option>
                <option value="CLIENT">Client Meeting</option>
                <option value="INTERNAL">Internal Meeting</option>
                <option value="INTERVIEW">Interview</option>
                <option value="REVIEW">Review</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="POSTPONED">Postponed</option>
              </select>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose / Agenda
            </label>
            <textarea
              value={formData.purpose || ''}
              onChange={e => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="What is this meeting about?"
            />
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organizer
            </label>
            <input
              type="text"
              value={formData.organizer || ''}
              onChange={e => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Who organized this meeting?"
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participants
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={participantInput}
                onChange={e => setParticipantInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add participant name or email"
              />
              <button
                type="button"
                onClick={addParticipant}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.participants && formData.participants.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.participants.map((participant, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {participant}
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          {/* Outcome (only for editing) */}
          {meeting?.id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outcome / Results
              </label>
              <textarea
                value={formData.outcome || ''}
                onChange={e => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="What was decided or achieved?"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : meeting?.id ? 'Update Meeting' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
