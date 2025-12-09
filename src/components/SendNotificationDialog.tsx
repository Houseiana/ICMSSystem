'use client'

import { useState } from 'react'
import { X, Mail, MessageCircle, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

type NotificationType = 'meeting-reminder' | 'task-assignment' | 'daily-tasks' | 'itinerary'

interface SendNotificationDialogProps {
  isOpen: boolean
  onClose: () => void
  type: NotificationType
  data: {
    id?: number | string
    title?: string
    recipientName?: string
    recipientEmail?: string
    recipientPhone?: string
    date?: string
    assignedBy?: string
  }
}

export default function SendNotificationDialog({
  isOpen,
  onClose,
  type,
  data
}: SendNotificationDialogProps) {
  const [sendEmail, setSendEmail] = useState(true)
  const [sendWhatsApp, setSendWhatsApp] = useState(true)
  const [recipientEmail, setRecipientEmail] = useState(data.recipientEmail || '')
  const [recipientPhone, setRecipientPhone] = useState(data.recipientPhone || '')
  const [recipientName, setRecipientName] = useState(data.recipientName || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  if (!isOpen) return null

  const getTypeLabel = () => {
    switch (type) {
      case 'meeting-reminder': return 'Meeting Reminder'
      case 'task-assignment': return 'Task Assignment'
      case 'daily-tasks': return 'Daily Tasks'
      case 'itinerary': return 'Travel Itinerary'
      default: return 'Notification'
    }
  }

  const getEndpoint = () => {
    switch (type) {
      case 'meeting-reminder': return '/api/notifications/send-meeting-reminder'
      case 'task-assignment': return '/api/notifications/send-task-assignment'
      case 'daily-tasks': return '/api/notifications/send-daily-tasks'
      case 'itinerary': return '/api/notifications/send-itinerary'
      default: return ''
    }
  }

  const getRequestBody = () => {
    const base = {
      sendEmail,
      sendWhatsApp,
      recipientEmail: sendEmail ? recipientEmail : undefined,
      recipientPhone: sendWhatsApp ? recipientPhone : undefined,
      recipientName
    }

    switch (type) {
      case 'meeting-reminder':
        return { ...base, meetingId: data.id }
      case 'task-assignment':
        return { ...base, taskId: data.id, assignedBy: data.assignedBy }
      case 'daily-tasks':
        return { ...base, date: data.date, assignedTo: data.recipientName }
      case 'itinerary':
        return { ...base, travelRequestId: data.id }
      default:
        return base
    }
  }

  const handleSend = async () => {
    if (!sendEmail && !sendWhatsApp) {
      setResult({ success: false, message: 'Please select at least one notification method' })
      return
    }

    if (sendEmail && !recipientEmail) {
      setResult({ success: false, message: 'Please enter an email address' })
      return
    }

    if (sendWhatsApp && !recipientPhone) {
      setResult({ success: false, message: 'Please enter a phone number' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(getEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getRequestBody())
      })

      const responseData = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: `${getTypeLabel()} sent successfully!`
        })

        // Auto close after 2 seconds on success
        setTimeout(() => {
          onClose()
          setResult(null)
        }, 2000)
      } else {
        setResult({
          success: false,
          message: responseData.error || 'Failed to send notification'
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Network error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            Send {getTypeLabel()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Info Box */}
          {data.title && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Sending:</strong> {data.title}
              </p>
            </div>
          )}

          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter recipient name"
            />
          </div>

          {/* Notification Methods */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Send via:</p>

            {/* Email Option */}
            <div className={`p-3 border rounded-lg transition-colors ${sendEmail ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmail}
                  onChange={e => setSendEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendEmail" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
              </div>
              {sendEmail && (
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter email address"
                />
              )}
            </div>

            {/* WhatsApp Option */}
            <div className={`p-3 border rounded-lg transition-colors ${sendWhatsApp ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendWhatsApp"
                  checked={sendWhatsApp}
                  onChange={e => setSendWhatsApp(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="sendWhatsApp" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </label>
              </div>
              {sendWhatsApp && (
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={e => setRecipientPhone(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  placeholder="+1234567890"
                />
              )}
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              result.success
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {result.success ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm">{result.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || (!sendEmail && !sendWhatsApp)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Notification
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
