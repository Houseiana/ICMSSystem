'use client'

import { useState, useRef } from 'react'
import { X, FileDown, Mail, Eye, Download } from 'lucide-react'
import { ItineraryTemplate } from './ItineraryTemplate'
import { useReactToPrint } from 'react-to-print'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface GenerateItineraryDialogProps {
  travelRequest: any
  onClose: () => void
}

export function GenerateItineraryDialog({
  travelRequest,
  onClose,
}: GenerateItineraryDialogProps) {
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [sendToPassengers, setSendToPassengers] = useState(false)
  const itineraryRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: itineraryRef,
    documentTitle: `Itinerary-${travelRequest.requestNumber}`,
  })

  const handleDownloadPDF = async () => {
    if (!itineraryRef.current) return

    setLoading(true)
    try {
      // Get the element to print
      const element = itineraryRef.current

      // Create canvas from element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      // Calculate PDF dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      // Add first page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      )
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        )
        heightLeft -= pageHeight
      }

      // Save PDF
      pdf.save(`Itinerary-${travelRequest.requestNumber}.pdf`)

      alert('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailToPassengers = async () => {
    if (!sendToPassengers) {
      alert('Please check the box to confirm sending to passengers')
      return
    }

    if (!travelRequest.passengers || travelRequest.passengers.length === 0) {
      alert('No passengers found for this travel request')
      return
    }

    setLoading(true)
    try {
      const passengerIds = travelRequest.passengers.map((p: any) => p.id)

      const response = await fetch('/api/travel/passengers/send-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelRequestId: travelRequest.id,
          passengerIds,
          contentTypes: ['FULL_ITINERARY'],
          communicationType: 'EMAIL',
          customMessage: 'Please find your complete travel itinerary attached.'
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(`Itinerary sent successfully to ${passengerIds.length} passenger(s)!`)
        onClose()
      } else {
        alert(`Failed to send itinerary: ${result.error}`)
      }
    } catch (error) {
      alert('Error sending itinerary. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileDown className="w-6 h-6" />
              Generate Itinerary
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Preview, download, or email the complete travel itinerary
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Preview Toggle */}
          <div className="mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Itinerary Preview</span>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="mb-6 border-2 border-gray-200 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
              <ItineraryTemplate ref={itineraryRef} travelRequest={travelRequest} />
            </div>
          )}

          {/* Hidden print element */}
          {!showPreview && (
            <div style={{ position: 'absolute', left: '-9999px' }}>
              <ItineraryTemplate ref={itineraryRef} travelRequest={travelRequest} />
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            {/* Download Options */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Download & Print</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Email Option */}
            {travelRequest.passengers && travelRequest.passengers.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">Email to Passengers</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Send this itinerary to all {travelRequest.passengers.length} passenger(s) via email
                </p>
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendToPassengers}
                    onChange={(e) => setSendToPassengers(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm sending the itinerary to all passengers
                  </span>
                </label>
                <button
                  onClick={handleEmailToPassengers}
                  disabled={loading || !sendToPassengers}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Email to All Passengers</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
