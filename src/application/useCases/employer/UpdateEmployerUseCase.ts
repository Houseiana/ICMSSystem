import { IEmployerRepository, IEmployer } from '@core/interfaces/repositories'
import { NotFoundException, ValidationException } from '@core/exceptions'
import { Email } from '@core/valueObjects'

/**
 * Update Employer Request DTO
 */
export interface UpdateEmployerRequest {
  employerType?: string
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
  status?: string
  notes?: string
}

/**
 * Update Employer Use Case
 * Updates an existing employer with validation
 */
export class UpdateEmployerUseCase {
  constructor(private readonly employerRepository: IEmployerRepository) {}

  /**
   * Executes the use case
   * @param id - Employer ID
   * @param request - Employer update request
   * @returns The updated employer entity
   * @throws NotFoundException if employer not found
   * @throws ValidationException if validation fails
   */
  async execute(id: number, request: UpdateEmployerRequest): Promise<IEmployer> {
    // Validate ID
    if (!id || id <= 0) {
      throw new Error('Invalid employer ID')
    }

    // Check if employer exists
    const existingEmployer = await this.employerRepository.findById(id)
    if (!existingEmployer) {
      throw new NotFoundException('Employer', id)
    }

    // Validate email if provided
    if (request.email) {
      const email = Email.create(request.email)

      // Check if email is taken by another employer
      const employerWithEmail = await this.employerRepository.findByEmail(email.value)
      if (employerWithEmail && employerWithEmail.id !== id) {
        throw ValidationException.fromFieldError('email', 'Email already in use by another employer')
      }

      request.email = email.value
    }

    // Check if registration number is taken by another employer
    if (request.registrationNumber) {
      const employerWithRegNum = await this.employerRepository.findByRegistrationNumber(request.registrationNumber)
      if (employerWithRegNum && employerWithRegNum.id !== id) {
        throw ValidationException.fromFieldError('registrationNumber', 'Registration number already in use')
      }
    }

    // Generate full name if relevant fields are updated
    let fullName: string | undefined
    const employerType = request.employerType || existingEmployer.employerType

    if (request.companyName || request.tradingName || request.firstName || request.lastName) {
      if (employerType === 'COMPANY') {
        fullName = request.companyName || request.tradingName || existingEmployer.companyName || existingEmployer.tradingName || 'Unknown Company'
      } else if (employerType === 'INDIVIDUAL') {
        const firstName = request.firstName || existingEmployer.firstName || ''
        const lastName = request.lastName || existingEmployer.lastName || ''
        const middleName = request.middleName !== undefined ? request.middleName : existingEmployer.middleName

        const parts = []
        if (firstName) parts.push(firstName)
        if (middleName) parts.push(middleName)
        if (lastName) parts.push(lastName)
        fullName = parts.join(' ').trim() || 'Unknown Individual'
      }
    }

    // Update employer
    const updateData: Partial<IEmployer> = {
      ...request,
      ...(fullName && { fullName })
    }

    const updatedEmployer = await this.employerRepository.update(id, updateData)

    return updatedEmployer
  }
}
