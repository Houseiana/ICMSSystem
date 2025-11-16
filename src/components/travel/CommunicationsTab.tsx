'use client'

import { useState, useEffect } from 'react'
import { Mail, MessageCircle, CheckCircle, XCircle, Clock, RefreshCw, Eye } from 'lucide-react'

interface Communication {
  id: number
  recipientName: string
  recipientContact: string
  communicationType: string
  contentType: string | null
  subject: string | null
  message: string | null
  htmlContent: string | null
  sentAt: string
  status: string
  externalMessageId: string | null
  errorMessage: string | null
}

interface CommunicationsTabProps {
  travelRequestId: number
}

export function CommunicationsTab({ travelRequestId }: CommunicationsTabProps) {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'EMAIL' | 'WHATSAPP' | 'SENT' | 'FAILED'>('ALL')
  const [resending, setResending] = useState<number | null>(null)
  const [viewingMessage, setViewingMessage] = useState<Communication | null>(null)

  useEffect(() => {
    fetchCommunications()
  }, [travelRequestId])

  const fetchCommunications = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/travel/communications?travelRequestId=${travelRequestId}`)
      const result = await response.json()

      if (result.success) {
        setCommunications(result.data || [])
      } else {
        console.error('Failed to fetch communications:', result.error)
      }
    } catch (error) {
      console.error('Error fetching communications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async (commId: number) => {
    if (!confirm('Are you sure you want to resend this communication?')) {
      return
    }

    setResending(commId)
    try {
      const response = await fetch(`/api/travel/communications/${commId}/resend`, {
        method: 'POST'
      })

      const result = await response.json()

      if (result.success) {
        alert('Communication resent successfully!')
        fetchCommunications() // Refresh the list
      } else {
        alert(`Failed to resend: ${result.message || result.error}`)
      }
    } catch (error) {
      alert('Error resending communication. Please try again.')
      console.error(error)
    } finally {
      setResending(null)
    }
  }

  const filteredCommunications = communications.filter(comm => {
    if (filter === 'ALL') return true
    if (filter === 'EMAIL') return comm.communicationType === 'EMAIL'
    if (filter === 'WHATSAPP') return comm.communicationType === 'WHATSAPP'
    if (filter === 'SENT') return comm.status === 'SENT'
    if (filter === 'FAILED') return comm.status === 'FAILED'
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Sent</span>
      case 'FAILED':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Failed</span>
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'EMAIL' ? (
      <Mail className="w-5 h-5 text-blue-600" />
    ) : (
      <MessageCircle className="w-5 h-5 text-green-600" />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        {['ALL', 'EMAIL', 'WHATSAPP', 'SENT', 'FAILED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-500">
          {filteredCommunications.length} of {communications.length} communications
        </div>
      </div>

      {/* Communications List */}
      {filteredCommunications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No communications found</p>
          <p className="text-sm text-gray-500 mt-1">
            {filter !== 'ALL' ? 'Try adjusting your filters' : 'Send details to passengers to see communications here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCommunications.map((comm) => (
            <div
              key={comm.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(comm.communicationType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {comm.recipientName}
                      </h4>
                      <p className="text-sm text-gray-500">{comm.recipientContact}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(comm.status)}
                      {getStatusBadge(comm.status)}
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    {comm.subject && (
                      <p className="text-gray-700">
                        <span className="font-medium">Subject:</span> {comm.subject}
                      </p>
                    )}
                    {comm.contentType && (
                      <p className="text-gray-600">
                        <span className="font-medium">Content:</span> {comm.contentType}
                      </p>
                    )}
                    <p className="text-gray-500">
                      <span className="font-medium">Sent:</span>{' '}
                      {new Date(comm.sentAt).toLocaleString()}
                    </p>
                    {comm.externalMessageId && (
                      <p className="text-xs text-gray-400">
                        ID: {comm.externalMessageId}
                      </p>
                    )}
                    {comm.errorMessage && (
                      <p className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
                        <span className="font-medium">Error:</span> {comm.errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setViewingMessage(comm)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Message
                    </button>
                    <button
                      onClick={() => handleResend(comm.id)}
                      disabled={resending === comm.id}
                      className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {resending === comm.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          Resend
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Message Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Message Content</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Sent to {viewingMessage.recipientName} via {viewingMessage.communicationType}
                </p>
              </div>
              <button
                onClick={() => setViewingMessage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {viewingMessage.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <p className="text-gray-900">{viewingMessage.subject}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                {viewingMessage.htmlContent ? (
                  <div
                    className="prose max-w-none bg-gray-50 p-4 rounded border"
                    dangerouslySetInnerHTML={{ __html: viewingMessage.htmlContent }}
                  />
                ) : (
                  <pre className="text-sm text-gray-900 bg-gray-50 p-4 rounded border whitespace-pre-wrap font-sans">
                    {viewingMessage.message}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
