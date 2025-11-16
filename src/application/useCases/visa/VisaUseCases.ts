import { IVisaRepository, IVisa, VisaSearchFilters } from '@core/interfaces/repositories'
import { NotFoundException, ValidationException } from '@core/exceptions'

/**
 * Create Visa Request DTO
 */
export interface CreateVisaRequest {
  visaNumber: string
  visaType: string
  visaCategory?: string
  issuingCountry: string
  destinationCountry: string
  firstName: string
  middleName?: string
  lastName: string
  passportNumber?: string
  dateOfBirth: Date
  nationality: string
  issueDate: Date
  expiryDate: Date
  entryType?: string
  numberOfEntries?: number
  durationOfStay?: number
  issuingAuthority?: string
  placeOfIssue?: string
  personType: string
  personId?: number
  sponsorName?: string
  sponsorType?: string
  purposeOfVisit?: string
  status: string
  notes?: string
}

/**
 * Update Visa Request DTO
 */
export interface UpdateVisaRequest {
  visaNumber?: string
  visaType?: string
  visaCategory?: string
  issuingCountry?: string
  destinationCountry?: string
  firstName?: string
  middleName?: string
  lastName?: string
  passportNumber?: string
  dateOfBirth?: Date
  nationality?: string
  issueDate?: Date
  expiryDate?: Date
  entryType?: string
  numberOfEntries?: number
  durationOfStay?: number
  issuingAuthority?: string
  placeOfIssue?: string
  personType?: string
  personId?: number
  sponsorName?: string
  sponsorType?: string
  purposeOfVisit?: string
  status?: string
  notes?: string
}

/**
 * Get Visa By ID Use Case
 */
export class GetVisaByIdUseCase {
  constructor(private readonly visaRepository: IVisaRepository) {}

  async execute(id: number): Promise<IVisa> {
    if (!id || id <= 0) {
      throw new Error('Invalid visa ID')
    }

    const visa = await this.visaRepository.findById(id)
    if (!visa) {
      throw new NotFoundException('Visa', id)
    }

    return visa
  }
}

/**
 * Get All Visas Use Case
 */
export class GetAllVisasUseCase {
  constructor(private readonly visaRepository: IVisaRepository) {}

  async execute(filters?: VisaSearchFilters): Promise<IVisa[]> {
    if (filters && Object.keys(filters).length > 0) {
      return await this.visaRepository.findByFilters(filters)
    }
    return await this.visaRepository.findAll()
  }

  async executeWithStats(filters?: VisaSearchFilters): Promise<{
    visas: IVisa[]
    stats: Record<string, number>
    visaTypes: string[]
    issuingCountries: string[]
    destinationCountries: string[]
  }> {
    const [visas, stats, visaTypes, issuingCountries, destinationCountries] = await Promise.all([
      this.execute(filters),
      this.visaRepository.getStatsByStatus(),
      this.visaRepository.getDistinctVisaTypes(),
      this.visaRepository.getDistinctIssuingCountries(),
      this.visaRepository.getDistinctDestinationCountries()
    ])

    return { visas, stats, visaTypes, issuingCountries, destinationCountries }
  }
}

/**
 * Create Visa Use Case
 */
export class CreateVisaUseCase {
  constructor(private readonly visaRepository: IVisaRepository) {}

  async execute(request: CreateVisaRequest): Promise<IVisa> {
    // Validate required fields
    this.validateRequest(request)

    // Check if visa number already exists
    const existing = await this.visaRepository.findByVisaNumber(request.visaNumber)
    if (existing) {
      throw ValidationException.fromFieldError('visaNumber', 'Visa number already exists')
    }

    // Validate dates
    if (request.expiryDate <= request.issueDate) {
      throw ValidationException.fromFieldError('expiryDate', 'Expiry date must be after issue date')
    }

    // Create visa entity with required fields
    const visa: IVisa = {
      id: 0,
      // Person information (required)
      personType: request.personType,
      personId: request.personId || 0,
      personName: `${request.firstName} ${request.lastName}`,
      personNationality: request.nationality,
      // Visa destination country (required)
      destinationCountry: request.destinationCountry,
      countryIcon: '',
      countryFullName: request.destinationCountry,
      // Visa status (required)
      visaStatus: request.status,
      // Visa details
      visaNumber: request.visaNumber,
      issuanceDate: request.issueDate,
      expiryDate: request.expiryDate,
      issuanceLocation: request.placeOfIssue,
      // Duration and stay (required)
      lengthType: 'DAYS',
      stayDurationType: 'SINGLE',
      // Visa category and type
      visaCategory: request.visaCategory,
      visaType: request.visaType,
      entries: 'SINGLE',
      // Application information (required)
      feeCurrency: 'USD',
      // Supporting documents (required booleans)
      photoRequired: false,
      biometricsRequired: false,
      interviewRequired: false,
      // Travel information (required booleans)
      purposeOfTravel: request.purposeOfVisit,
      invitationLetter: false,
      // Financial information (required booleans)
      bankStatement: false,
      sponsorSupport: false,
      insuranceCoverage: false,
      // Previous travel history (required booleans)
      refusedBefore: false,
      // Processing status (required)
      applicationStatus: 'PENDING',
      // Visa status tracking (required)
      isActive: true,
      // Rejection information (required booleans)
      appealPossible: false,
      // Collection/Delivery (required)
      passportStatus: 'VALID',
      // Renewal information (required)
      renewalEligible: false,
      // Additional information (required booleans)
      vaccinationRequired: false,
      quarantineRequired: false,
      // Internal tracking (required)
      priority: 'NORMAL',
      // Optional fields
      sponsorInformation: request.sponsorName,
      // System fields
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return await this.visaRepository.create(visa)
  }

  private validateRequest(request: CreateVisaRequest): void {
    const errors: Array<{ field: string; message: string }> = []

    if (!request.visaNumber?.trim()) {
      errors.push({ field: 'visaNumber', message: 'Visa number is required' })
    }
    if (!request.visaType?.trim()) {
      errors.push({ field: 'visaType', message: 'Visa type is required' })
    }
    if (!request.issuingCountry?.trim()) {
      errors.push({ field: 'issuingCountry', message: 'Issuing country is required' })
    }
    if (!request.destinationCountry?.trim()) {
      errors.push({ field: 'destinationCountry', message: 'Destination country is required' })
    }
    if (!request.firstName?.trim()) {
      errors.push({ field: 'firstName', message: 'First name is required' })
    }
    if (!request.lastName?.trim()) {
      errors.push({ field: 'lastName', message: 'Last name is required' })
    }
    if (!request.dateOfBirth) {
      errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' })
    }
    if (!request.nationality?.trim()) {
      errors.push({ field: 'nationality', message: 'Nationality is required' })
    }
    if (!request.issueDate) {
      errors.push({ field: 'issueDate', message: 'Issue date is required' })
    }
    if (!request.expiryDate) {
      errors.push({ field: 'expiryDate', message: 'Expiry date is required' })
    }
    if (!request.personType?.trim()) {
      errors.push({ field: 'personType', message: 'Person type is required' })
    }
    if (!request.status?.trim()) {
      errors.push({ field: 'status', message: 'Status is required' })
    }

    if (errors.length > 0) {
      throw ValidationException.fromFieldErrors(errors)
    }
  }

  private generateFullName(firstName: string, middleName: string | undefined, lastName: string): string {
    const parts = [firstName]
    if (middleName?.trim()) parts.push(middleName)
    parts.push(lastName)
    return parts.join(' ').trim()
  }
}

/**
 * Update Visa Use Case
 */
export class UpdateVisaUseCase {
  constructor(private readonly visaRepository: IVisaRepository) {}

  async execute(id: number, request: UpdateVisaRequest): Promise<IVisa> {
    if (!id || id <= 0) {
      throw new Error('Invalid visa ID')
    }

    const existing = await this.visaRepository.findById(id)
    if (!existing) {
      throw new NotFoundException('Visa', id)
    }

    // Check if visa number is taken by another visa
    if (request.visaNumber) {
      const visaWithNumber = await this.visaRepository.findByVisaNumber(request.visaNumber)
      if (visaWithNumber && visaWithNumber.id !== id) {
        throw ValidationException.fromFieldError('visaNumber', 'Visa number already in use')
      }
    }

    const updateData: Partial<IVisa> = {
      ...request
    }

    return await this.visaRepository.update(id, updateData)
  }
}

/**
 * Delete Visa Use Case
 */
export class DeleteVisaUseCase {
  constructor(private readonly visaRepository: IVisaRepository) {}

  async execute(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid visa ID')
    }

    const exists = await this.visaRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Visa', id)
    }

    const deleted = await this.visaRepository.delete(id)
    if (!deleted) {
      throw new Error('Failed to delete visa')
    }
  }

  async softDelete(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid visa ID')
    }

    const exists = await this.visaRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Visa', id)
    }

    await this.visaRepository.update(id, { visaStatus: 'EXPIRED' })
  }
}

/**
 * Get Expiring Visas Use Case
 */
export class GetExpiringVisasUseCase {
  constructor(private readonly visaRepository: IVisaRepository) {}

  async execute(days: number = 90): Promise<IVisa[]> {
    return await this.visaRepository.findExpiringWithinDays(days)
  }
}
