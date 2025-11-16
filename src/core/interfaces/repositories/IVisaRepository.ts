import { IBaseRepository } from './IBaseRepository'

/**
 * Visa entity interface (domain model)
 * Represents the core visa business entity
 * Matches Prisma schema fields
 */
export interface IVisa {
  id: number

  // Person Information (Imported from Employee or Stakeholder)
  personType: string // EMPLOYEE, STAKEHOLDER
  personId: number
  personName: string
  personEmail?: string | null
  personNationality?: string | null

  // Visa Destination Country
  destinationCountry: string
  countryIcon: string
  countryFullName: string

  // Visa Status
  visaStatus: string // HAS_VISA, NO_VISA, NEEDS_VISA

  // Visa Details (when HAS_VISA)
  visaNumber?: string | null
  issuanceDate?: Date | null
  expiryDate?: Date | null
  issuanceLocation?: string | null

  // Duration and Stay Information
  visaLength?: number | null
  lengthType: string
  maxStayDuration?: number | null
  stayDurationType: string

  // Visa Category and Type
  visaCategory?: string | null
  visaType?: string | null
  entries: string

  // Application Information
  applicationDate?: Date | null
  applicationRef?: string | null
  processingTime?: number | null
  applicationFee?: number | null
  feeCurrency: string

  // Supporting Documents
  documentsSubmitted?: string | null
  documentsRequired?: string | null
  photoRequired: boolean
  biometricsRequired: boolean
  interviewRequired: boolean

  // Embassy/Consulate Information
  embassy?: string | null
  embassyLocation?: string | null
  embassyContact?: string | null
  appointmentDate?: Date | null
  appointmentTime?: string | null

  // Travel Information
  purposeOfTravel?: string | null
  plannedDepartureDate?: Date | null
  plannedReturnDate?: Date | null
  accommodationDetails?: string | null
  sponsorInformation?: string | null
  invitationLetter: boolean

  // Financial Information
  financialProof?: string | null
  bankStatement: boolean
  sponsorSupport: boolean
  insuranceCoverage: boolean
  insuranceProvider?: string | null

  // Previous Travel History
  previousVisas?: string | null
  refusedBefore: boolean
  refusalReason?: string | null
  bannedCountries?: string | null

  // Processing Status
  applicationStatus: string
  processingStage?: string | null
  expectedDecision?: Date | null
  actualDecision?: Date | null
  decisionDetails?: string | null

  // Visa Status for Previous/Current tracking
  isActive: boolean
  archiveReason?: string | null

  // Rejection Information (if applicable)
  rejectionReason?: string | null
  appealPossible: boolean
  appealDeadline?: Date | null
  reapplicationDate?: Date | null

  // Collection/Delivery
  collectionMethod?: string | null
  collectionLocation?: string | null
  courierTracking?: string | null
  passportStatus: string

  // Renewal Information
  renewalEligible: boolean
  renewalBefore?: Date | null
  renewalProcess?: string | null

  // Additional Information
  specialRequirements?: string | null
  medicalRequirements?: string | null
  vaccinationRequired: boolean
  quarantineRequired: boolean
  covidRequirements?: string | null

  // Internal Notes and Tracking
  internalNotes?: string | null
  assignedOfficer?: string | null
  priority: string
  tags?: string | null

  // System Fields
  createdAt: Date
  updatedAt: Date
  createdBy?: string | null
  lastModifiedBy?: string | null
}

/**
 * Visa search filters
 */
export interface VisaSearchFilters {
  search?: string
  visaType?: string
  issuingCountry?: string
  destinationCountry?: string
  personType?: string
  status?: string
  expiringWithinDays?: number
}

/**
 * Visa repository interface
 * Extends base repository with visa-specific methods
 */
export interface IVisaRepository extends IBaseRepository<IVisa> {
  /**
   * Finds visas by search criteria
   * @param filters - Search filters
   * @returns Array of matching visas
   */
  findByFilters(filters: VisaSearchFilters): Promise<IVisa[]>

  /**
   * Finds a visa by visa number
   * @param visaNumber - Visa number
   * @returns The visa if found, null otherwise
   */
  findByVisaNumber(visaNumber: string): Promise<IVisa | null>

  /**
   * Finds visas by person
   * @param personType - Type of person (Employee, Employer, etc.)
   * @param personId - Person ID
   * @returns Array of visas for the person
   */
  findByPerson(personType: string, personId: number): Promise<IVisa[]>

  /**
   * Finds visas by passport number
   * @param passportNumber - Passport number
   * @returns Array of visas for the passport
   */
  findByPassportNumber(passportNumber: string): Promise<IVisa[]>

  /**
   * Finds visas expiring within a certain number of days
   * @param days - Number of days from now
   * @returns Array of expiring visas
   */
  findExpiringWithinDays(days: number): Promise<IVisa[]>

  /**
   * Finds expired visas
   * @returns Array of expired visas
   */
  findExpired(): Promise<IVisa[]>

  /**
   * Finds visas by status
   * @param status - Visa status
   * @returns Array of visas with the status
   */
  findByStatus(status: string): Promise<IVisa[]>

  /**
   * Gets visa statistics grouped by status
   * @returns Statistics object
   */
  getStatsByStatus(): Promise<Record<string, number>>

  /**
   * Gets distinct visa types
   * @returns Array of visa types
   */
  getDistinctVisaTypes(): Promise<string[]>

  /**
   * Gets distinct issuing countries
   * @returns Array of country names
   */
  getDistinctIssuingCountries(): Promise<string[]>

  /**
   * Gets distinct destination countries
   * @returns Array of country names
   */
  getDistinctDestinationCountries(): Promise<string[]>
}
