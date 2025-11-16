import { IEmployer } from '@core/interfaces/repositories'

/**
 * Employer Response DTO
 * Standardized response format for employer data
 */
export interface EmployerResponseDto {
  id: number
  employerType: string
  fullName: string
  companyName?: string | null
  tradingName?: string | null
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phoneNumber?: string | null
  industry?: string | null
  relationshipType?: string | null
  status: string
  createdAt: string
  updatedAt: string
}

/**
 * Detailed Employer Response DTO
 * Includes all employer fields
 */
export interface DetailedEmployerResponseDto extends EmployerResponseDto {
  middleName?: string | null
  registrationNumber?: string | null
  taxId?: string | null
  incorporationDate?: string | null
  establishedYear?: number | null
  dateOfBirth?: string | null
  profession?: string | null
  businessType?: string | null
  companySize?: string | null
  mobileNumber?: string | null
  faxNumber?: string | null
  website?: string | null
  address?: {
    street?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
  }
  billingAddress?: {
    street?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
  }
  relationshipStart?: string | null
  accountManager?: string | null
  contractValue?: number | null
  creditLimit?: number | null
  paymentTerms?: string | null
  preferredCurrency?: string | null
  bankName?: string | null
  accountNumber?: string | null
  insuranceProvider?: string | null
  insuranceCoverage?: number | null
  licenseNumber?: string | null
  certificationBody?: string | null
  budgetAuthority?: number | null
  decisionMakingRole?: string | null
  innovationIndex?: number | null
  notes?: string | null
}

/**
 * Employer List Response DTO
 */
export interface EmployerListResponseDto {
  employers: EmployerResponseDto[]
  stats?: Record<string, number>
  industries?: string[]
  relationshipTypes?: string[]
  total: number
}
