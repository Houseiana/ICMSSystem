import { IBaseRepository } from './IBaseRepository'

/**
 * Employer entity interface (domain model)
 * Represents the core employer business entity
 * Matches Prisma schema fields
 */
export interface IEmployer {
  id: number

  // Employer Type
  employerType: string // COMPANY or INDIVIDUAL

  // Basic Information (Company)
  companyName?: string | null
  tradingName?: string | null
  legalName?: string | null
  companyType?: string | null
  industry?: string | null
  businessNature?: string | null

  // Personal Information (Individual)
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  fullName?: string | null
  preferredName?: string | null
  dateOfBirth?: Date | null
  placeOfBirth?: string | null
  gender?: string | null
  maritalStatus?: string | null
  nationality?: string | null
  profession?: string | null

  // Registration Information
  registrationNumber?: string | null
  taxId?: string | null
  vatNumber?: string | null
  licenseNumber?: string | null
  incorporationDate?: Date | null

  // Contact Information
  primaryEmail?: string | null
  secondaryEmail?: string | null
  mainPhone?: string | null
  alternatePhone?: string | null
  faxNumber?: string | null
  website?: string | null

  // Address Information
  headOfficeAddress?: string | null
  mailingAddress?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null
  timeZone?: string | null

  // Business Details
  establishedYear?: number | null
  employeeCount?: string | null
  annualRevenue?: string | null
  marketCap?: string | null
  stockSymbol?: string | null
  publiclyListed: boolean

  // Operational Details
  businessHours?: string | null
  operatingCountries?: string | null
  languages?: string | null
  currencies?: string | null

  // Reputation & Certification
  creditRating?: string | null
  certifications?: string | null
  awards?: string | null
  accreditations?: string | null

  // Financial Information
  bankName?: string | null
  bankAddress?: string | null
  accountNumber?: string | null
  routingNumber?: string | null
  swiftCode?: string | null
  paymentTerms?: string | null

  // Relationship Information
  relationshipType?: string | null
  relationshipStart?: Date | null
  contractValue?: number | null
  paymentHistory?: string | null

  // Key Personnel
  ceoName?: string | null
  ceoEmail?: string | null
  hrContactName?: string | null
  hrContactEmail?: string | null
  hrContactPhone?: string | null
  financeContactName?: string | null
  financeContactEmail?: string | null

  // Legal & Compliance
  legalStructure?: string | null
  regulatoryBody?: string | null
  complianceNotes?: string | null
  auditFirm?: string | null
  legalRepresentative?: string | null

  // Performance & Ratings
  overallRating?: number | null
  reliabilityRating?: number | null
  qualityRating?: number | null
  paymentRating?: number | null
  communicationRating?: number | null

  // Benefits & Compensation
  benefits?: string | null
  salaryRange?: string | null
  bonusStructure?: string | null
  pensionScheme: boolean
  healthInsurance: boolean

  // Work Environment
  workCulture?: string | null
  remoteWorkPolicy?: string | null
  diversityPolicy?: string | null
  trainingPrograms?: string | null
  careerDevelopment?: string | null

  // Social & Environmental
  csrActivities?: string | null
  environmentalPolicy?: string | null
  sustainabilityRating?: string | null
  charitableActivities?: string | null

  // Technology & Systems
  technologyStack?: string | null
  systemsUsed?: string | null
  digitalization?: string | null
  innovationIndex?: number | null

  // Risk Assessment
  riskLevel: string
  riskFactors?: string | null
  creditLimit?: number | null
  insuranceCoverage?: number | null

  // Documents & Attachments
  documents?: string | null
  contracts?: string | null
  proposals?: string | null
  reports?: string | null

  // Communication Preferences
  preferredContactMethod: string
  communicationSchedule?: string | null
  escalationProcess?: string | null
  keyDecisionMakers?: string | null

  // Status & Tracking
  status: string
  onboardingStatus?: string | null
  lastInteraction?: Date | null
  nextReviewDate?: Date | null
  renewalDate?: Date | null

  // Internal Notes
  publicNotes?: string | null
  privateNotes?: string | null
  tags?: string | null
  alerts?: string | null

  // System Fields
  createdAt: Date
  updatedAt: Date
  createdBy?: string | null
  lastModifiedBy?: string | null
}

/**
 * Employer search filters
 */
export interface EmployerSearchFilters {
  search?: string
  industry?: string
  relationshipType?: string
  status?: string
  employerType?: string
}

/**
 * Employer repository interface
 * Extends base repository with employer-specific methods
 */
export interface IEmployerRepository extends IBaseRepository<IEmployer> {
  /**
   * Finds employers by search criteria
   * @param filters - Search filters
   * @param includeContacts - Whether to include associated contacts
   * @returns Array of matching employers
   */
  findByFilters(filters: EmployerSearchFilters, includeContacts?: boolean): Promise<IEmployer[]>

  /**
   * Finds an employer by registration number
   * @param registrationNumber - Company registration number
   * @returns The employer if found, null otherwise
   */
  findByRegistrationNumber(registrationNumber: string): Promise<IEmployer | null>

  /**
   * Finds an employer by email
   * @param email - Employer email
   * @returns The employer if found, null otherwise
   */
  findByEmail(email: string): Promise<IEmployer | null>

  /**
   * Finds employers by industry
   * @param industry - Industry name
   * @returns Array of employers in the industry
   */
  findByIndustry(industry: string): Promise<IEmployer[]>

  /**
   * Finds employers by status
   * @param status - Employer status
   * @returns Array of employers with the status
   */
  findByStatus(status: string): Promise<IEmployer[]>

  /**
   * Gets employer statistics grouped by status
   * @returns Statistics object
   */
  getStatsByStatus(): Promise<Record<string, number>>

  /**
   * Gets distinct industries
   * @returns Array of industry names
   */
  getDistinctIndustries(): Promise<string[]>

  /**
   * Gets distinct relationship types
   * @returns Array of relationship types
   */
  getDistinctRelationshipTypes(): Promise<string[]>
}
