import { IEmployerRepository, IEmployer } from '@core/interfaces/repositories'
import { ValidationException } from '@core/exceptions'
import { Email } from '@core/valueObjects'

/**
 * Create Employer Request DTO
 */
export interface CreateEmployerRequest {
  employerType: string
  companyName?: string
  tradingName?: string
  registrationNumber?: string
  taxId?: string
  incorporationDate?: Date
  establishedYear?: number
  firstName?: string
  middleName?: string
  lastName?: string
  dateOfBirth?: Date
  industry?: string
  profession?: string
  businessType?: string
  companySize?: string
  email?: string
  phoneNumber?: string
  mobileNumber?: string
  faxNumber?: string
  website?: string
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  billingStreet?: string
  billingCity?: string
  billingState?: string
  billingPostalCode?: string
  billingCountry?: string
  relationshipType?: string
  relationshipStart?: Date
  accountManager?: string
  contractValue?: number
  creditLimit?: number
  paymentTerms?: string
  preferredCurrency?: string
  bankName?: string
  accountNumber?: string
  insuranceProvider?: string
  insuranceCoverage?: number
  licenseNumber?: string
  certificationBody?: string
  budgetAuthority?: number
  decisionMakingRole?: string
  innovationIndex?: number
  status: string
  notes?: string
}

/**
 * Create Employer Use Case
 * Creates a new employer with validation
 */
export class CreateEmployerUseCase {
  constructor(private readonly employerRepository: IEmployerRepository) {}

  /**
   * Executes the use case
   * @param request - Employer creation request
   * @returns The created employer entity
   * @throws ValidationException if validation fails
   */
  async execute(request: CreateEmployerRequest): Promise<IEmployer> {
    // Validate required fields
    this.validateRequest(request)

    // Validate email if provided
    if (request.email) {
      const email = Email.create(request.email)
      request.email = email.value

      // Check if email already exists
      const existingEmployer = await this.employerRepository.findByEmail(email.value)
      if (existingEmployer) {
        throw ValidationException.fromFieldError('email', 'Email already exists')
      }
    }

    // Check if registration number already exists
    if (request.registrationNumber) {
      const existingEmployer = await this.employerRepository.findByRegistrationNumber(request.registrationNumber)
      if (existingEmployer) {
        throw ValidationException.fromFieldError('registrationNumber', 'Registration number already exists')
      }
    }

    // Generate full name based on employer type
    const fullName = this.generateFullName(request)

    // Create employer entity
    const employer: IEmployer = {
      id: 0, // Will be set by repository
      ...request,
      fullName,
      publiclyListed: false,
      pensionScheme: false,
      healthInsurance: false,
      riskLevel: 'LOW',
      preferredContactMethod: 'EMAIL',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Persist to database
    const createdEmployer = await this.employerRepository.create(employer)

    return createdEmployer
  }

  /**
   * Validates the request
   */
  private validateRequest(request: CreateEmployerRequest): void {
    const errors: Array<{ field: string; message: string }> = []

    if (!request.employerType || request.employerType.trim().length === 0) {
      errors.push({ field: 'employerType', message: 'Employer type is required' })
    }

    // Validate based on employer type
    if (request.employerType === 'COMPANY') {
      if (!request.companyName || request.companyName.trim().length === 0) {
        errors.push({ field: 'companyName', message: 'Company name is required for company type' })
      }
    }

    if (request.employerType === 'INDIVIDUAL') {
      if (!request.firstName || request.firstName.trim().length === 0) {
        errors.push({ field: 'firstName', message: 'First name is required for individual type' })
      }
      if (!request.lastName || request.lastName.trim().length === 0) {
        errors.push({ field: 'lastName', message: 'Last name is required for individual type' })
      }
    }

    if (!request.status || request.status.trim().length === 0) {
      errors.push({ field: 'status', message: 'Status is required' })
    }

    if (errors.length > 0) {
      throw ValidationException.fromFieldErrors(errors)
    }
  }

  /**
   * Generates full name based on employer type
   */
  private generateFullName(request: CreateEmployerRequest): string {
    if (request.employerType === 'COMPANY') {
      return request.companyName || request.tradingName || 'Unknown Company'
    }

    if (request.employerType === 'INDIVIDUAL') {
      const parts = []
      if (request.firstName) parts.push(request.firstName)
      if (request.middleName) parts.push(request.middleName)
      if (request.lastName) parts.push(request.lastName)
      return parts.join(' ').trim() || 'Unknown Individual'
    }

    return 'Unknown Employer'
  }
}
