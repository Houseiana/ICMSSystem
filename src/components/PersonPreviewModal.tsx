'use client'

import { useState } from 'react'
import { X, User, FileText, MapPin, Phone, Mail, Calendar, Globe, Heart, Briefcase, GraduationCap, DollarSign, FileCheck, Image as ImageIcon } from 'lucide-react'

export type PersonType = 'EMPLOYEE' | 'EMPLOYER' | 'STAKEHOLDER' | 'TASK_HELPER'

interface PersonData {
  // Basic Information
  id: number
  firstName?: string
  middleName?: string
  lastName?: string
  fullName?: string
  preferredName?: string
  empId?: string // For employees
  companyName?: string // For employers
  employerType?: string // For employers

  // Contact Information
  email?: string | null
  personalEmail?: string | null
  primaryEmail?: string | null
  phone?: string | null
  primaryPhone?: string | null
  alternatePhone?: string | null
  mobilePhone?: string | null
  whatsappNumber?: string | null

  // Personal Details
  dateOfBirth?: Date | string | null
  placeOfBirth?: string | null
  gender?: string | null
  maritalStatus?: string | null
  bloodGroup?: string | null
  nationality?: string | null
  religion?: string | null
  languages?: string | null // JSON array

  // Address
  currentAddress?: string | null
  permanentAddress?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null

  // Identification
  nationalId?: string | null
  passportNumber?: string | null
  passportExpiry?: Date | string | null
  passportIssuingCountry?: string | null
  drivingLicense?: string | null
  qidNumber?: string | null
  qidIssueDate?: Date | string | null
  qidExpiryDate?: Date | string | null
  qidLocation?: string | null

  // Document URLs
  photoUrl?: string | null
  qidDocumentUrl?: string | null
  passportDocumentUrl?: string | null

  // Professional Information
  position?: string | null
  department?: string | null
  occupation?: string | null
  jobTitle?: string | null
  employer?: string | null
  workType?: string | null
  degreeOfCooperation?: string | null

  // Employment Details (for employees)
  hireDate?: Date | string | null
  salary?: number | null
  currency?: string | null
  status?: string | null
  employeeType?: string | null

  // Education
  highestEducation?: string | null
  university?: string | null
  graduationYear?: number | null
  fieldOfStudy?: string | null
  certifications?: string | null // JSON array

  // Health
  medicalConditions?: string | null
  allergies?: string | null
  medications?: string | null

  // Visa Information
  visaStatus?: string | null
  visaType?: string | null
  visaNumber?: string | null
  visaValidFrom?: Date | string | null
  visaValidTo?: Date | string | null

  // Emergency Contacts
  emergencyContact1Name?: string | null
  emergencyContact1Relation?: string | null
  emergencyContact1Phone?: string | null
  emergencyContact2Name?: string | null
  emergencyContact2Relation?: string | null
  emergencyContact2Phone?: string | null

  // Financial (for task helpers)
  paymentType?: string | null
  hourlyRate?: number | null
  dailyRate?: number | null
  monthlyRate?: number | null

  // Ratings (for task helpers)
  overallRating?: number | null
  reliability?: number | null
  quality?: number | null

  // Notes
  notes?: string | null
  personalNotes?: string | null
}

interface PersonPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  personType: PersonType
  personData: PersonData | null
  loading?: boolean
}

export default function PersonPreviewModal({
  isOpen,
  onClose,
  personType,
  personData,
  loading = false
}: PersonPreviewModalProps) {
  const [activeTab, setActiveTab] = useState('personal')

  if (!isOpen) return null

  const getPersonTypeName = () => {
    switch (personType) {
      case 'EMPLOYEE': return 'Employee'
      case 'EMPLOYER': return 'Employer'
      case 'STAKEHOLDER': return 'Stakeholder'
      case 'TASK_HELPER': return 'Task Helper'
      default: return 'Person'
    }
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const parseJSON = (jsonString: string | null | undefined): string[] => {
    if (!jsonString) return []
    try {
      return JSON.parse(jsonString)
    } catch {
      return []
    }
  }

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) => {
    if (!value && value !== 0) return null
    return (
      <div className="flex items-start gap-3 py-2">
        {Icon && <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-base text-gray-900 break-words">{value}</p>
        </div>
      </div>
    )
  }

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{children}</h3>
  )

  const renderPersonalTab = () => (
    <div className="space-y-6">
      {/* Photo and Basic Info */}
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          {personData?.photoUrl ? (
            <img
              src={personData.photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <InfoRow label="First Name" value={personData?.firstName} icon={User} />
          {personData?.middleName && <InfoRow label="Middle Name" value={personData?.middleName} />}
          <InfoRow label="Last Name" value={personData?.lastName} />
          {personData?.preferredName && <InfoRow label="Preferred Name" value={personData?.preferredName} />}
          {personData?.empId && <InfoRow label="Employee ID" value={personData?.empId} />}
          {personData?.companyName && <InfoRow label="Company Name" value={personData?.companyName} icon={Briefcase} />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <SectionTitle>Personal Details</SectionTitle>
          <InfoRow label="Date of Birth" value={formatDate(personData?.dateOfBirth)} icon={Calendar} />
          <InfoRow label="Place of Birth" value={personData?.placeOfBirth} icon={MapPin} />
          <InfoRow label="Gender" value={personData?.gender} />
          <InfoRow label="Marital Status" value={personData?.maritalStatus} icon={Heart} />
          <InfoRow label="Blood Group" value={personData?.bloodGroup} />
          <InfoRow label="Nationality" value={personData?.nationality} icon={Globe} />
          <InfoRow label="Religion" value={personData?.religion} />
          {personData?.languages && (
            <InfoRow
              label="Languages"
              value={parseJSON(personData.languages).join(', ') || personData.languages}
            />
          )}
        </div>

        <div>
          <SectionTitle>Contact Information</SectionTitle>
          <InfoRow
            label="Email"
            value={personData?.email || personData?.primaryEmail || personData?.personalEmail}
            icon={Mail}
          />
          {personData?.personalEmail && personData?.email !== personData?.personalEmail && (
            <InfoRow label="Personal Email" value={personData?.personalEmail} icon={Mail} />
          )}
          <InfoRow
            label="Phone"
            value={personData?.phone || personData?.primaryPhone || personData?.mobilePhone}
            icon={Phone}
          />
          {personData?.alternatePhone && <InfoRow label="Alternate Phone" value={personData?.alternatePhone} icon={Phone} />}
          {personData?.whatsappNumber && <InfoRow label="WhatsApp" value={personData?.whatsappNumber} />}
        </div>
      </div>

      <div>
        <SectionTitle>Address</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Current Address" value={personData?.currentAddress || personData?.address} icon={MapPin} />
          {personData?.permanentAddress && personData?.permanentAddress !== personData?.currentAddress && (
            <InfoRow label="Permanent Address" value={personData?.permanentAddress} />
          )}
          <InfoRow label="City" value={personData?.city} />
          <InfoRow label="State/Province" value={personData?.state} />
          <InfoRow label="Country" value={personData?.country} />
          <InfoRow label="Postal Code" value={personData?.postalCode} />
        </div>
      </div>
    </div>
  )

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div>
        <SectionTitle>Identification Documents</SectionTitle>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Passport</h4>
            <InfoRow label="Passport Number" value={personData?.passportNumber} icon={FileText} />
            <InfoRow label="Issuing Country" value={personData?.passportIssuingCountry} />
            <InfoRow label="Expiry Date" value={formatDate(personData?.passportExpiry)} icon={Calendar} />
            {personData?.passportDocumentUrl && (
              <a
                href={personData.passportDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-2"
              >
                <ImageIcon className="w-4 h-4" />
                View Passport Document
              </a>
            )}
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">Qatar ID (QID)</h4>
            <InfoRow label="QID Number" value={personData?.qidNumber} icon={FileText} />
            <InfoRow label="Issue Date" value={formatDate(personData?.qidIssueDate)} />
            <InfoRow label="Expiry Date" value={formatDate(personData?.qidExpiryDate)} icon={Calendar} />
            <InfoRow label="Issue Location" value={personData?.qidLocation} icon={MapPin} />
            {personData?.qidDocumentUrl && (
              <a
                href={personData.qidDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-2"
              >
                <ImageIcon className="w-4 h-4" />
                View QID Document
              </a>
            )}
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Visa Information</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Visa Status" value={personData?.visaStatus} />
          <InfoRow label="Visa Type" value={personData?.visaType} />
          <InfoRow label="Visa Number" value={personData?.visaNumber} />
          <InfoRow label="Valid From" value={formatDate(personData?.visaValidFrom)} icon={Calendar} />
          <InfoRow label="Valid To" value={formatDate(personData?.visaValidTo)} icon={Calendar} />
        </div>
      </div>

      <div>
        <SectionTitle>Other Documents</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="National ID" value={personData?.nationalId} icon={FileText} />
          <InfoRow label="Driving License" value={personData?.drivingLicense} />
        </div>
      </div>
    </div>
  )

  const renderProfessionalTab = () => (
    <div className="space-y-6">
      <div>
        <SectionTitle>Professional Information</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Position/Job Title" value={personData?.position || personData?.jobTitle || personData?.occupation} icon={Briefcase} />
          <InfoRow label="Department" value={personData?.department} />
          {personType === 'EMPLOYEE' && (
            <>
              <InfoRow label="Hire Date" value={formatDate(personData?.hireDate)} icon={Calendar} />
              <InfoRow label="Employment Type" value={personData?.employeeType} />
              <InfoRow label="Status" value={personData?.status} />
              <InfoRow label="Salary" value={personData?.salary ? `${personData.currency || 'USD'} ${personData.salary.toLocaleString()}` : null} icon={DollarSign} />
            </>
          )}
          {personType === 'STAKEHOLDER' && (
            <>
              <InfoRow label="Employer" value={personData?.employer} icon={Briefcase} />
              <InfoRow label="Occupation" value={personData?.occupation} />
            </>
          )}
          {personType === 'TASK_HELPER' && (
            <>
              <InfoRow label="Work Type" value={personData?.workType} />
              <InfoRow label="Cooperation Level" value={personData?.degreeOfCooperation} />
              <InfoRow label="Payment Type" value={personData?.paymentType} icon={DollarSign} />
              {personData?.hourlyRate && <InfoRow label="Hourly Rate" value={`${personData.currency || 'USD'} ${personData.hourlyRate}`} />}
              {personData?.dailyRate && <InfoRow label="Daily Rate" value={`${personData.currency || 'USD'} ${personData.dailyRate}`} />}
              {personData?.monthlyRate && <InfoRow label="Monthly Rate" value={`${personData.currency || 'USD'} ${personData.monthlyRate}`} />}
            </>
          )}
        </div>
      </div>

      {(personData?.highestEducation || personData?.university) && (
        <div>
          <SectionTitle>Education & Qualifications</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Highest Education" value={personData?.highestEducation} icon={GraduationCap} />
            <InfoRow label="University" value={personData?.university} />
            <InfoRow label="Field of Study" value={personData?.fieldOfStudy} />
            <InfoRow label="Graduation Year" value={personData?.graduationYear} />
            {personData?.certifications && (
              <div className="col-span-2">
                <InfoRow
                  label="Certifications"
                  value={parseJSON(personData.certifications).join(', ') || personData.certifications}
                  icon={FileCheck}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {personType === 'TASK_HELPER' && (personData?.overallRating || personData?.reliability || personData?.quality) && (
        <div>
          <SectionTitle>Performance Ratings</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            {personData?.overallRating && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Overall</p>
                <p className="text-3xl font-bold text-blue-600">{personData.overallRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">out of 5.0</p>
              </div>
            )}
            {personData?.reliability && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Reliability</p>
                <p className="text-3xl font-bold text-green-600">{personData.reliability.toFixed(1)}</p>
                <p className="text-xs text-gray-500">out of 5.0</p>
              </div>
            )}
            {personData?.quality && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Quality</p>
                <p className="text-3xl font-bold text-purple-600">{personData.quality.toFixed(1)}</p>
                <p className="text-xs text-gray-500">out of 5.0</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <div>
        <SectionTitle>Emergency Contacts</SectionTitle>
        <div className="grid grid-cols-2 gap-6">
          {personData?.emergencyContact1Name && (
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-3">Primary Emergency Contact</h4>
              <InfoRow label="Name" value={personData.emergencyContact1Name} icon={User} />
              <InfoRow label="Relationship" value={personData.emergencyContact1Relation} />
              <InfoRow label="Phone" value={personData.emergencyContact1Phone} icon={Phone} />
            </div>
          )}

          {personData?.emergencyContact2Name && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-3">Secondary Emergency Contact</h4>
              <InfoRow label="Name" value={personData.emergencyContact2Name} icon={User} />
              <InfoRow label="Relationship" value={personData.emergencyContact2Relation} />
              <InfoRow label="Phone" value={personData.emergencyContact2Phone} icon={Phone} />
            </div>
          )}
        </div>
      </div>

      {(personData?.medicalConditions || personData?.allergies || personData?.medications) && (
        <div>
          <SectionTitle>Medical Information</SectionTitle>
          <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
            <InfoRow label="Medical Conditions" value={personData?.medicalConditions} />
            <InfoRow label="Allergies" value={personData?.allergies} />
            <InfoRow label="Medications" value={personData?.medications} />
          </div>
        </div>
      )}
    </div>
  )

  const renderNotesTab = () => (
    <div className="space-y-6">
      <div>
        <SectionTitle>Notes & Additional Information</SectionTitle>
        {personData?.notes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">General Notes</h4>
            <p className="text-gray-900 whitespace-pre-wrap">{personData.notes}</p>
          </div>
        )}
        {personData?.personalNotes && (
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-blue-900 mb-2">Personal Notes</h4>
            <p className="text-gray-900 whitespace-pre-wrap">{personData.personalNotes}</p>
          </div>
        )}
        {!personData?.notes && !personData?.personalNotes && (
          <p className="text-gray-500 text-center py-8">No notes available</p>
        )}
      </div>
    </div>
  )

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'emergency', label: 'Emergency & Health', icon: Heart },
    { id: 'notes', label: 'Notes', icon: FileText },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {getPersonTypeName()} Profile
            </h2>
            <p className="text-gray-600 mt-1">
              {personData?.fullName || `${personData?.firstName || ''} ${personData?.lastName || ''}`.trim() || personData?.companyName || 'Loading...'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading {getPersonTypeName().toLowerCase()} information...</p>
            </div>
          </div>
        ) : !personData ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="border-b px-6">
              <nav className="flex gap-2 -mb-px">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors
                        ${activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'personal' && renderPersonalTab()}
              {activeTab === 'documents' && renderDocumentsTab()}
              {activeTab === 'professional' && renderProfessionalTab()}
              {activeTab === 'emergency' && renderEmergencyTab()}
              {activeTab === 'notes' && renderNotesTab()}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
