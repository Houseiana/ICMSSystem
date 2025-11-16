import { IBaseRepository } from './IBaseRepository'

/**
 * Employee entity interface (domain model)
 * Represents the core employee business entity
 */
export interface IEmployee {
  id: number
  empId: string // Unique employee ID (required in Prisma schema)

  // Personal Information
  firstName: string
  lastName: string
  middleName?: string | null
  fullName?: string | null
  preferredName?: string | null
  email: string
  personalEmail?: string | null
  phone?: string | null
  alternatePhone?: string | null
  dateOfBirth?: Date | null
  placeOfBirth?: string | null
  gender?: string | null
  maritalStatus?: string | null
  bloodGroup?: string | null
  nationality?: string | null
  religion?: string | null
  languages?: string | null

  // Address Information
  currentAddress?: string | null
  permanentAddress?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null

  // Identification Documents
  nationalId?: string | null
  passportNumber?: string | null
  passportExpiry?: Date | null
  drivingLicense?: string | null
  licenseExpiry?: Date | null
  visaStatus?: string | null
  visaExpiry?: Date | null

  // QID (Qatar ID) Information
  qidNumber?: string | null
  qidIssueDate?: Date | null
  qidExpiryDate?: Date | null
  qidLocation?: string | null

  // Emergency Contact
  emergencyContact1Name?: string | null
  emergencyContact1Relation?: string | null
  emergencyContact1Phone?: string | null
  emergencyContact1Address?: string | null
  emergencyContact2Name?: string | null
  emergencyContact2Relation?: string | null
  emergencyContact2Phone?: string | null
  emergencyContact2Address?: string | null

  // Education & Qualifications
  highestEducation?: string | null
  university?: string | null
  graduationYear?: number | null
  fieldOfStudy?: string | null
  certifications?: string | null
  skills?: string | null

  // Employment Details
  department?: string | null
  position?: string | null
  managerId?: number | null
  employerId?: number | null
  salary?: number | null
  currency?: string | null
  bankAccount?: string | null
  bankName?: string | null
  bankBranch?: string | null
  taxId?: string | null
  socialSecurityNumber?: string | null
  hireDate: Date
  confirmationDate?: Date | null
  terminationDate?: Date | null
  status: string
  employeeType: string
  workLocation?: string | null

  // Medical Information
  medicalConditions?: string | null
  allergies?: string | null
  medications?: string | null
  bloodGroupRh?: string | null

  // System Fields
  createdAt: Date
  updatedAt: Date
}

/**
 * Employee search filters
 */
export interface EmployeeSearchFilters {
  search?: string
  department?: string
  position?: string
  employmentType?: string
  status?: string
  nationality?: string
  gender?: string
}

/**
 * Employee repository interface
 * Extends base repository with employee-specific methods
 */
export interface IEmployeeRepository extends IBaseRepository<IEmployee> {
  /**
   * Finds employees by search criteria
   * @param filters - Search filters
   * @returns Array of matching employees
   */
  findByFilters(filters: EmployeeSearchFilters): Promise<IEmployee[]>

  /**
   * Finds an employee by email
   * @param email - Employee email
   * @returns The employee if found, null otherwise
   */
  findByEmail(email: string): Promise<IEmployee | null>

  /**
   * Finds employees by department
   * @param department - Department name
   * @returns Array of employees in the department
   */
  findByDepartment(department: string): Promise<IEmployee[]>

  /**
   * Finds employees by status
   * @param status - Employment status
   * @returns Array of employees with the status
   */
  findByStatus(status: string): Promise<IEmployee[]>

  /**
   * Gets employee statistics grouped by status
   * @returns Statistics object
   */
  getStatsByStatus(): Promise<Record<string, number>>

  /**
   * Gets distinct departments
   * @returns Array of department names
   */
  getDistinctDepartments(): Promise<string[]>

  /**
   * Gets distinct positions
   * @returns Array of position titles
   */
  getDistinctPositions(): Promise<string[]>
}
