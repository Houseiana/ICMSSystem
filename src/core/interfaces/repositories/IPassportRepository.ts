import { IBaseRepository } from './IBaseRepository'

/**
 * Passport entity interface (domain model)
 * Represents the core passport business entity
 * Matches Prisma schema fields
 */
export interface IPassport {
  id: number

  // Owner Information (Polymorphic relationship)
  ownerType: string // EMPLOYEE, EMPLOYER, STAKEHOLDER
  ownerId: number
  ownerName: string
  ownerEmail?: string | null
  ownerNationality?: string | null

  // Passport Information
  passportNumber: string
  issuingCountry: string
  countryIcon?: string | null
  issuanceDate: Date
  expiryDate: Date
  issueLocation?: string | null
  passportType: string

  // Personal Information (from passport)
  firstNameOnPassport: string
  lastNameOnPassport: string
  fullNameOnPassport?: string | null
  dateOfBirth?: Date | null
  placeOfBirth?: string | null
  gender?: string | null
  height?: string | null
  eyeColor?: string | null

  // Passport Status
  status: string
  isActive: boolean

  // Physical Passport Location Tracking
  currentLocation: string
  locationDetails?: string | null
  lastLocationUpdate: Date
  locationNotes?: string | null

  // Representative Information
  withMainRepresentative: boolean
  mainRepresentativeName?: string | null
  mainRepresentativeContact?: string | null
  mainRepresentativeNotes?: string | null
  withMinorRepresentative: boolean
  minorRepresentativeName?: string | null
  minorRepresentativeContact?: string | null
  minorRepresentativeNotes?: string | null

  // Security Features
  machineReadableZone?: string | null
  chipEnabled: boolean
  biometricData: boolean
  securityFeatures?: string | null

  // Visa Pages & Stamps
  totalPages?: number | null
  usedPages?: number | null
  availablePages?: number | null
  lastStampDate?: Date | null
  lastStampCountry?: string | null

  // Renewal Information
  renewalEligible: boolean
  renewalBefore?: Date | null
  renewalProcess?: string | null
  renewalLocation?: string | null
  renewalFee?: number | null
  renewalFeeCurrency?: string | null

  // Emergency Information
  emergencyContact?: string | null
  bloodType?: string | null
  medicalConditions?: string | null
  emergencyNotes?: string | null

  // Documents & Verification
  photoPath?: string | null
  scannedCopyPath?: string | null
  verificationStatus: string
  verifiedBy?: string | null
  verificationDate?: Date | null
  verificationNotes?: string | null

  // Travel Information
  lastTravelDate?: Date | null
  frequentDestinations?: string | null
  travelRestrictions?: string | null
  visaHistory?: string | null

  // Administrative
  submittedBy?: string | null
  reviewedBy?: string | null
  approvedBy?: string | null
  rejectionReason?: string | null

  // Internal Notes
  publicNotes?: string | null
  privateNotes?: string | null
  alerts?: string | null
  tags?: string | null

  // Compliance & Legal
  legalIssues?: string | null
  restrictions?: string | null
  watchlistStatus?: string | null
  sanctionsCheck: boolean

  // System Fields
  createdAt: Date
  updatedAt: Date
  createdBy?: string | null
  lastModifiedBy?: string | null
}

/**
 * Passport search filters
 */
export interface PassportSearchFilters {
  search?: string
  issuingCountry?: string
  nationality?: string
  personType?: string
  status?: string
  expiringWithinDays?: number
}

/**
 * Passport entity summary (for listing passport-holding entities)
 */
export interface IPassportEntitySummary {
  id: number
  type: string
  fullName: string
  passportCount: number
}

/**
 * Passport repository interface
 * Extends base repository with passport-specific methods
 */
export interface IPassportRepository extends IBaseRepository<IPassport> {
  /**
   * Finds passports by search criteria
   * @param filters - Search filters
   * @returns Array of matching passports
   */
  findByFilters(filters: PassportSearchFilters): Promise<IPassport[]>

  /**
   * Finds a passport by passport number
   * @param passportNumber - Passport number
   * @returns The passport if found, null otherwise
   */
  findByPassportNumber(passportNumber: string): Promise<IPassport | null>

  /**
   * Finds passports by person
   * @param personType - Type of person (Employee, Employer, etc.)
   * @param personId - Person ID
   * @returns Array of passports for the person
   */
  findByPerson(personType: string, personId: number): Promise<IPassport[]>

  /**
   * Finds passports expiring within a certain number of days
   * @param days - Number of days from now
   * @returns Array of expiring passports
   */
  findExpiringWithinDays(days: number): Promise<IPassport[]>

  /**
   * Finds expired passports
   * @returns Array of expired passports
   */
  findExpired(): Promise<IPassport[]>

  /**
   * Finds passports by status
   * @param status - Passport status
   * @returns Array of passports with the status
   */
  findByStatus(status: string): Promise<IPassport[]>

  /**
   * Gets all entities (people) that have passports
   * @returns Array of entity summaries with passport counts
   */
  getEntitiesWithPassports(): Promise<IPassportEntitySummary[]>

  /**
   * Gets passport statistics grouped by status
   * @returns Statistics object
   */
  getStatsByStatus(): Promise<Record<string, number>>

  /**
   * Gets distinct issuing countries
   * @returns Array of country names
   */
  getDistinctIssuingCountries(): Promise<string[]>

  /**
   * Gets distinct nationalities
   * @returns Array of nationalities
   */
  getDistinctNationalities(): Promise<string[]>
}
