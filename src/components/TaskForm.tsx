'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight, Clock, Flag, Folder } from 'lucide-react'

interface DailyTask {
  id?: number
  title: string
  description?: string
  date: string
  priority: string
  category: string
  status: string
  notes?: string
  actionTaken?: string
  nextStep?: string
  assignedTo?: string
  dueTime?: string
  transferredTo?: string
  transferReason?: string
}

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  task?: DailyTask | null
  selectedDate: Date
  mode?: 'create' | 'edit' | 'transfer'
}

export default function TaskForm({
  isOpen,
  onClose,
  onSuccess,
  task,
  selectedDate,
  mode = 'create'
}: TaskFormProps) {
  const [formData, setFormData] = useState<DailyTask>({
    title: '',
    description: '',
    date: selectedDate.toISOString().split('T')[0],
    priority: 'MEDIUM',
    category: 'GENERAL',
    status: 'PENDING',
    notes: '',
    actionTaken: '',
    nextStep: '',
    assignedTo: '',
    dueTime: '',
    transferredTo: '',
    transferReason: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        date: new Date(task.date).toISOString().split('T')[0],
        transferredTo: mode === 'transfer'
          ? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
          : ''
      })
    } else {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }))
    }
  }, [task, selectedDate, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let url = '/api/daily-tasks'
      let method = 'POST'
      let body: any = { ...formData }

      if (task?.id && mode === 'edit') {
        url = `/api/daily-tasks/${task.id}`
        method = 'PUT'
      } else if (task?.id && mode === 'transfer') {
        url = `/api/daily-tasks/${task.id}`
        method = 'PUT'
        body = {
          transferredTo: formData.transferredTo,
          transferReason: formData.transferReason
        }
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save task')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-50 border-red-200'
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'transfer'
              ? 'Transfer Task'
              : task?.id
                ? 'Edit Task'
                : 'New Task'}
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

          {/* Transfer Mode - Show transfer options */}
          {mode === 'transfer' ? (
            <>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Transferring Task:</h3>
                <p className="text-blue-700">{task?.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer to Date *
                </label>
                <input
                  type="date"
                  value={formData.transferredTo || ''}
                  onChange={e => setFormData(prev => ({ ...prev, transferredTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Transfer
                </label>
                <textarea
                  value={formData.transferReason || ''}
                  onChange={e => setFormData(prev => ({ ...prev, transferReason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Why is this task being transferred?"
                />
              </div>
            </>
          ) : (
            <>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Describe the task..."
                />
              </div>

              {/* Date and Due Time */}
              <div className="grid grid-cols-2 gap-4">
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
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={formData.dueTime || ''}
                    onChange={e => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Priority and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Flag className="w-4 h-4 inline mr-1" />
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getPriorityColor(formData.priority)}`}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Folder className="w-4 h-4 inline mr-1" />
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="GENERAL">General</option>
                    <option value="ADMIN">Admin</option>
                    <option value="HR">HR</option>
                    <option value="FINANCE">Finance</option>
                    <option value="LEGAL">Legal</option>
                    <option value="IT">IT</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Status (only for editing) */}
              {task?.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              )}

              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={formData.assignedTo || ''}
                  onChange={e => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Who is responsible for this task?"
                />
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

              {/* Action Taken and Next Step (only for editing) */}
              {task?.id && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action Taken
                    </label>
                    <textarea
                      value={formData.actionTaken || ''}
                      onChange={e => setFormData(prev => ({ ...prev, actionTaken: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="What action was taken for this task?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Step
                    </label>
                    <textarea
                      value={formData.nextStep || ''}
                      onChange={e => setFormData(prev => ({ ...prev, nextStep: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="What is the next step after this action?"
                    />
                  </div>
                </>
              )}
            </>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                'Saving...'
              ) : mode === 'transfer' ? (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Transfer Task
                </>
              ) : task?.id ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
