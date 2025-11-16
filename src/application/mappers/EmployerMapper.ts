import { IEmployer } from '@core/interfaces/repositories'
import {
  EmployerResponseDto,
  DetailedEmployerResponseDto,
  EmployerListResponseDto
} from '@application/dto/responses'

/**
 * Employer Mapper
 * Converts between Employer entities and DTOs
 */
export class EmployerMapper {
  /**
   * Maps Employer entity to basic response DTO
   */
  static toResponseDto(employer: IEmployer): EmployerResponseDto {
    return {
      id: employer.id,
      employerType: employer.employerType,
      fullName: employer.fullName || '',
      companyName: employer.companyName,
      tradingName: employer.tradingName,
      firstName: employer.firstName,
      lastName: employer.lastName,
      email: employer.email,
      phoneNumber: employer.phoneNumber,
      industry: employer.industry,
      relationshipType: employer.relationshipType,
      status: employer.status,
      createdAt: employer.createdAt.toISOString(),
      updatedAt: employer.updatedAt.toISOString()
    }
  }

  /**
   * Maps Employer entity to detailed response DTO
   */
  static toDetailedResponseDto(employer: IEmployer): DetailedEmployerResponseDto {
    return {
      ...this.toResponseDto(employer),
      middleName: employer.middleName,
      registrationNumber: employer.registrationNumber,
      taxId: employer.taxId,
      incorporationDate: employer.incorporationDate ? employer.incorporationDate.toISOString() : null,
      establishedYear: employer.establishedYear,
      dateOfBirth: employer.dateOfBirth ? employer.dateOfBirth.toISOString() : null,
      profession: employer.profession,
      businessType: employer.businessType,
      companySize: employer.companySize,
      mobileNumber: employer.mobileNumber,
      faxNumber: employer.faxNumber,
      website: employer.website,
      address: {
        street: employer.street,
        city: employer.city,
        state: employer.state,
        postalCode: employer.postalCode,
        country: employer.country
      },
      billingAddress: {
        street: employer.billingStreet,
        city: employer.billingCity,
        state: employer.billingState,
        postalCode: employer.billingPostalCode,
        country: employer.billingCountry
      },
      relationshipStart: employer.relationshipStart ? employer.relationshipStart.toISOString() : null,
      accountManager: employer.accountManager,
      contractValue: employer.contractValue,
      creditLimit: employer.creditLimit,
      paymentTerms: employer.paymentTerms,
      preferredCurrency: employer.preferredCurrency,
      bankName: employer.bankName,
      accountNumber: employer.accountNumber,
      insuranceProvider: employer.insuranceProvider,
      insuranceCoverage: employer.insuranceCoverage,
      licenseNumber: employer.licenseNumber,
      certificationBody: employer.certificationBody,
      budgetAuthority: employer.budgetAuthority,
      decisionMakingRole: employer.decisionMakingRole,
      innovationIndex: employer.innovationIndex,
      notes: employer.notes
    }
  }

  /**
   * Maps array of Employer entities to list response DTO
   */
  static toListResponseDto(
    employers: IEmployer[],
    stats?: Record<string, number>,
    industries?: string[],
    relationshipTypes?: string[]
  ): EmployerListResponseDto {
    return {
      employers: employers.map(e => this.toResponseDto(e)),
      stats,
      industries,
      relationshipTypes,
      total: employers.length
    }
  }

  /**
   * Maps array of Employer entities to response DTOs
   */
  static toResponseDtoArray(employers: IEmployer[]): EmployerResponseDto[] {
    return employers.map(e => this.toResponseDto(e))
  }

  /**
   * Maps array of Employer entities to detailed response DTOs
   */
  static toDetailedResponseDtoArray(employers: IEmployer[]): DetailedEmployerResponseDto[] {
    return employers.map(e => this.toDetailedResponseDto(e))
  }
}
