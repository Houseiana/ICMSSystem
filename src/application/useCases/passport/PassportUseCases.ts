import { IPassportRepository, IPassport, PassportSearchFilters } from '@core/interfaces/repositories'
import { NotFoundException, ValidationException } from '@core/exceptions'

/**
 * Create Passport Request DTO
 */
export interface CreatePassportRequest {
  passportNumber: string
  issuingCountry: string
  nationality: string
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: Date
  placeOfBirth?: string
  gender?: string
  issueDate: Date
  expiryDate: Date
  issuingAuthority?: string
  personType: string
  personId?: number
  status: string
  notes?: string
}

/**
 * Update Passport Request DTO
 */
export interface UpdatePassportRequest {
  passportNumber?: string
  issuingCountry?: string
  nationality?: string
  firstName?: string
  middleName?: string
  lastName?: string
  dateOfBirth?: Date
  placeOfBirth?: string
  gender?: string
  issueDate?: Date
  expiryDate?: Date
  issuingAuthority?: string
  personType?: string
  personId?: number
  status?: string
  notes?: string
}

/**
 * Get Passport By ID Use Case
 */
export class GetPassportByIdUseCase {
  constructor(private readonly passportRepository: IPassportRepository) {}

  async execute(id: number): Promise<IPassport> {
    if (!id || id <= 0) {
      throw new Error('Invalid passport ID')
    }

    const passport = await this.passportRepository.findById(id)
    if (!passport) {
      throw new NotFoundException('Passport', id)
    }

    return passport
  }
}

/**
 * Get All Passports Use Case
 */
export class GetAllPassportsUseCase {
  constructor(private readonly passportRepository: IPassportRepository) {}

  async execute(filters?: PassportSearchFilters): Promise<IPassport[]> {
    if (filters && Object.keys(filters).length > 0) {
      return await this.passportRepository.findByFilters(filters)
    }
    return await this.passportRepository.findAll()
  }

  async executeWithStats(filters?: PassportSearchFilters): Promise<{
    passports: IPassport[]
    stats: Record<string, number>
    issuingCountries: string[]
    nationalities: string[]
  }> {
    const [passports, stats, issuingCountries, nationalities] = await Promise.all([
      this.execute(filters),
      this.passportRepository.getStatsByStatus(),
      this.passportRepository.getDistinctIssuingCountries(),
      this.passportRepository.getDistinctNationalities()
    ])

    return { passports, stats, issuingCountries, nationalities }
  }
}

/**
 * Create Passport Use Case
 */
export class CreatePassportUseCase {
  constructor(private readonly passportRepository: IPassportRepository) {}

  async execute(request: CreatePassportRequest): Promise<IPassport> {
    // Validate required fields
    this.validateRequest(request)

    // Check if passport number already exists
    const existing = await this.passportRepository.findByPassportNumber(request.passportNumber)
    if (existing) {
      throw ValidationException.fromFieldError('passportNumber', 'Passport number already exists')
    }

    // Validate dates
    if (request.expiryDate <= request.issueDate) {
      throw ValidationException.fromFieldError('expiryDate', 'Expiry date must be after issue date')
    }

    // Generate full name
    const fullName = this.generateFullName(request.firstName, request.middleName, request.lastName)

    // Create passport entity
    const passport: IPassport = {
      id: 0,
      ...request,
      fullName,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return await this.passportRepository.create(passport)
  }

  private validateRequest(request: CreatePassportRequest): void {
    const errors: Array<{ field: string; message: string }> = []

    if (!request.passportNumber?.trim()) {
      errors.push({ field: 'passportNumber', message: 'Passport number is required' })
    }
    if (!request.issuingCountry?.trim()) {
      errors.push({ field: 'issuingCountry', message: 'Issuing country is required' })
    }
    if (!request.nationality?.trim()) {
      errors.push({ field: 'nationality', message: 'Nationality is required' })
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
 * Update Passport Use Case
 */
export class UpdatePassportUseCase {
  constructor(private readonly passportRepository: IPassportRepository) {}

  async execute(id: number, request: UpdatePassportRequest): Promise<IPassport> {
    if (!id || id <= 0) {
      throw new Error('Invalid passport ID')
    }

    const existing = await this.passportRepository.findById(id)
    if (!existing) {
      throw new NotFoundException('Passport', id)
    }

    // Check if passport number is taken by another passport
    if (request.passportNumber) {
      const passportWithNumber = await this.passportRepository.findByPassportNumber(request.passportNumber)
      if (passportWithNumber && passportWithNumber.id !== id) {
        throw ValidationException.fromFieldError('passportNumber', 'Passport number already in use')
      }
    }

    // Generate full name if name fields are updated
    let fullName: string | undefined
    if (request.firstName || request.lastName) {
      const firstName = request.firstName || existing.firstName
      const lastName = request.lastName || existing.lastName
      const middleName = request.middleName !== undefined ? request.middleName : existing.middleName

      const parts = [firstName]
      if (middleName?.trim()) parts.push(middleName)
      parts.push(lastName)
      fullName = parts.join(' ').trim()
    }

    const updateData: Partial<IPassport> = {
      ...request,
      ...(fullName && { fullName })
    }

    return await this.passportRepository.update(id, updateData)
  }
}

/**
 * Delete Passport Use Case
 */
export class DeletePassportUseCase {
  constructor(private readonly passportRepository: IPassportRepository) {}

  async execute(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid passport ID')
    }

    const exists = await this.passportRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Passport', id)
    }

    const deleted = await this.passportRepository.delete(id)
    if (!deleted) {
      throw new Error('Failed to delete passport')
    }
  }

  async softDelete(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid passport ID')
    }

    const exists = await this.passportRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Passport', id)
    }

    await this.passportRepository.update(id, { status: 'EXPIRED' })
  }
}

/**
 * Get Expiring Passports Use Case
 */
export class GetExpiringPassportsUseCase {
  constructor(private readonly passportRepository: IPassportRepository) {}

  async execute(days: number = 90): Promise<IPassport[]> {
    return await this.passportRepository.findExpiringWithinDays(days)
  }
}
