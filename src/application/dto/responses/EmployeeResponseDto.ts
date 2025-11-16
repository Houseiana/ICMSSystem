import { IEmployee } from '@core/interfaces/repositories'

/**
 * Employee Response DTO
 * Standardized response format for employee data
 */
export interface EmployeeResponseDto {
  id: number
  fullName?: string | null
  firstName: string
  lastName: string
  middleName?: string | null
  email: string
  phoneNumber?: string | null
  department?: string | null
  position?: string | null
  employmentType?: string | null
  status: string
  hireDate?: string | null
  salary?: number | null
  currency?: string | null
  nationality?: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Detailed Employee Response DTO
 * Includes all employee fields
 */
export interface DetailedEmployeeResponseDto extends EmployeeResponseDto {
  dateOfBirth?: string | null
  gender?: string | null
  maritalStatus?: string | null
  terminationDate?: string | null
  bankName?: string | null
  accountNumber?: string | null
  taxId?: string | null
  socialSecurityNumber?: string | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  address?: {
    street?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
  }
  notes?: string | null
}

/**
 * Employee List Response DTO
 * Includes employees and metadata
 */
export interface EmployeeListResponseDto {
  employees: EmployeeResponseDto[]
  stats?: Record<string, number>
  departments?: string[]
  positions?: string[]
  total: number
}
