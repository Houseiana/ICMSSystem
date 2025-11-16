'use client'

interface PassportTableProps {
  passports: any[]
  loading: boolean
  onView: (passport: any) => void
  onEdit: (passport: any) => void
  onDelete: (passport: any) => void
}

export default function PassportTable({ passports, loading, onView, onEdit, onDelete }: PassportTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading passports...</span>
          </div>
        </div>
      </div>
    )
  }

  if (passports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📘</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No passports found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first passport record.</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>
    }

    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
      case 'EXPIRED':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>
      case 'LOST':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Lost</span>
      case 'STOLEN':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Stolen</span>
      case 'CANCELLED':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Cancelled</span>
      case 'DAMAGED':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Damaged</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>
    }
  }

  const getLocationBadge = (location: string) => {
    const locationMap: { [key: string]: { label: string; color: string } } = {
      'WITH_OWNER': { label: 'With Owner', color: 'bg-green-100 text-green-800' },
      'AT_OFFICE': { label: 'At Office', color: 'bg-blue-100 text-blue-800' },
      'AT_HOME': { label: 'At Home', color: 'bg-purple-100 text-purple-800' },
      'WITH_MAIN_REPRESENTATIVE': { label: 'Main Rep.', color: 'bg-orange-100 text-orange-800' },
      'WITH_MINOR_REPRESENTATIVE': { label: 'Minor Rep.', color: 'bg-yellow-100 text-yellow-800' },
      'AT_EMBASSY': { label: 'Embassy', color: 'bg-red-100 text-red-800' },
      'IN_TRANSIT': { label: 'In Transit', color: 'bg-gray-100 text-gray-800' },
      'LOST': { label: 'Lost', color: 'bg-red-100 text-red-800' },
      'UNKNOWN': { label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
    }

    const locationInfo = locationMap[location] || { label: location, color: 'bg-gray-100 text-gray-800' }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${locationInfo.color}`}>
        {locationInfo.label}
      </span>
    )
  }

  const getOwnerTypeIcon = (ownerType: string) => {
    switch (ownerType) {
      case 'EMPLOYEE':
        return '👥'
      case 'EMPLOYER':
        return '🏢'
      case 'STAKEHOLDER':
        return '🤝'
      default:
        return '👤'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    return expiry <= sixMonthsFromNow
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Passport Records</h3>
        <p className="text-sm text-gray-500 mt-1">{passports.length} passport(s) found</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Passport Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {passports.map((passport) => (
              <tr key={passport.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">{getOwnerTypeIcon(passport.ownerType)}</span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{passport.ownerName}</div>
                      <div className="text-sm text-gray-500">{passport.ownerType.toLowerCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{passport.passportNumber}</div>
                  <div className="text-sm text-gray-500">
                    {passport.issuingCountry} • {passport.passportType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(passport.status, passport.isActive)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getLocationBadge(passport.currentLocation)}
                  {passport.locationDetails && (
                    <div className="text-xs text-gray-500 mt-1">{passport.locationDetails}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${isExpiringSoon(passport.expiryDate) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {formatDate(passport.expiryDate)}
                  </div>
                  {isExpiringSoon(passport.expiryDate) && (
                    <div className="text-xs text-red-500">Expires soon</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(passport)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View Details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(passport)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(passport)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}