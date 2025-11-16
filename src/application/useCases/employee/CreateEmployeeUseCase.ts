import { IEmployeeRepository, IEmployee } from '@core/interfaces/repositories'
import { ValidationException } from '@core/exceptions'
import { Email } from '@core/valueObjects'

/**
 * Create Employee Request DTO
 */
export interface CreateEmployeeRequest {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phoneNumber?: string
  dateOfBirth?: Date
  nationality?: string
  gender?: string
  maritalStatus?: string
  department?: string
  position?: string
  employmentType?: string
  hireDate?: Date
  salary?: number
  currency?: string
  bankName?: string
  accountNumber?: string
  taxId?: string
  socialSecurityNumber?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  status: string
  notes?: string
}

/**
 * Create Employee Use Case
 * Creates a new employee with validation
 *
 * Example of a command use case following Clean Architecture principles
 */
export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  /**
   * Executes the use case
   * @param request - Employee creation request
   * @returns The created employee entity
   * @throws ValidationException if validation fails
   */
  async execute(request: CreateEmployeeRequest): Promise<IEmployee> {
    // Validate required fields
    this.validateRequest(request)

    // Validate email using value object
    const email = Email.create(request.email)

    // Check if email already exists
    const existingEmployee = await this.employeeRepository.findByEmail(email.value)
    if (existingEmployee) {
      throw ValidationException.fromFieldError('email', 'Email already exists')
    }

    // Generate empId (unique employee identifier)
    const empId = this.generateEmpId()

    // Generate full name
    const fullName = this.generateFullName(
      request.firstName,
      request.middleName,
      request.lastName
    )

    // Create employee entity with required Prisma schema fields
    const employee: IEmployee = {
      id: 0, // Will be set by repository
      empId,
      firstName: request.firstName,
      lastName: request.lastName,
      middleName: request.middleName || null,
      fullName,
      preferredName: null,
      email: email.value,
      personalEmail: null,
      phone: request.phoneNumber || null,
      alternatePhone: null,
      dateOfBirth: request.dateOfBirth || null,
      placeOfBirth: null,
      gender: request.gender || null,
      maritalStatus: request.maritalStatus || null,
      bloodGroup: null,
      nationality: request.nationality || null,
      religion: null,
      languages: null,
      currentAddress: request.street || null,
      permanentAddress: null,
      city: request.city || null,
      state: request.state || null,
      postalCode: request.postalCode || null,
      country: request.country || null,
      nationalId: null,
      passportNumber: null,
      passportExpiry: null,
      drivingLicense: null,
      licenseExpiry: null,
      visaStatus: null,
      visaExpiry: null,
      emergencyContact1Name: request.emergencyContactName || null,
      emergencyContact1Relation: null,
      emergencyContact1Phone: request.emergencyContactPhone || null,
      emergencyContact1Address: null,
      emergencyContact2Name: null,
      emergencyContact2Relation: null,
      emergencyContact2Phone: null,
      emergencyContact2Address: null,
      highestEducation: null,
      university: null,
      graduationYear: null,
      fieldOfStudy: null,
      certifications: null,
      skills: null,
      department: request.department || null,
      position: request.position || null,
      managerId: null,
      employerId: null,
      salary: request.salary || null,
      currency: request.currency || 'USD',
      bankAccount: request.accountNumber || null,
      bankName: request.bankName || null,
      bankBranch: null,
      taxId: request.taxId || null,
      socialSecurityNumber: request.socialSecurityNumber || null,
      hireDate: request.hireDate || new Date(),
      confirmationDate: null,
      terminationDate: null,
      status: request.status,
      employeeType: request.employmentType || 'FULL_TIME',
      workLocation: null,
      medicalConditions: null,
      allergies: null,
      medications: null,
      bloodGroupRh: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Persist to database
    const createdEmployee = await this.employeeRepository.create(employee)

    return createdEmployee
  }

  /**
   * Generates a unique employee ID
   * Format: EMP + timestamp
   */
  private generateEmpId(): string {
    const timestamp = Date.now()
    return `EMP${timestamp}`
  }

  /**
   * Validates the request
   */
  private validateRequest(request: CreateEmployeeRequest): void {
    const errors: Array<{ field: string; message: string }> = []

    if (!request.firstName || request.firstName.trim().length === 0) {
      errors.push({ field: 'firstName', message: 'First name is required' })
    }

    if (!request.lastName || request.lastName.trim().length === 0) {
      errors.push({ field: 'lastName', message: 'Last name is required' })
    }

    if (!request.email || request.email.trim().length === 0) {
      errors.push({ field: 'email', message: 'Email is required' })
    }

    if (!request.status || request.status.trim().length === 0) {
      errors.push({ field: 'status', message: 'Status is required' })
    }

    if (errors.length > 0) {
      throw ValidationException.fromFieldErrors(errors)
    }
  }

  /**
   * Generates full name from components
   */
  private generateFullName(
    firstName: string,
    middleName: string | undefined,
    lastName: string
  ): string {
    const parts = [firstName]
    if (middleName && middleName.trim().length > 0) {
      parts.push(middleName)
    }
    parts.push(lastName)
    return parts.join(' ').trim()
  }
}
