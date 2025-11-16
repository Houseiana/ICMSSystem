import { IEmployee } from '@core/interfaces/repositories'
import {
  EmployeeResponseDto,
  DetailedEmployeeResponseDto,
  EmployeeListResponseDto
} from '@application/dto/responses'

/**
 * Employee Mapper
 * Converts between Employee entities and DTOs
 */
export class EmployeeMapper {
  /**
   * Maps Employee entity to basic response DTO
   */
  static toResponseDto(employee: IEmployee): EmployeeResponseDto {
    return {
      id: employee.id,
      fullName: employee.fullName,
      firstName: employee.firstName,
      lastName: employee.lastName,
      middleName: employee.middleName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      department: employee.department,
      position: employee.position,
      employmentType: employee.employmentType,
      status: employee.status,
      hireDate: employee.hireDate ? employee.hireDate.toISOString() : null,
      salary: employee.salary,
      currency: employee.currency,
      nationality: employee.nationality,
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString()
    }
  }

  /**
   * Maps Employee entity to detailed response DTO
   */
  static toDetailedResponseDto(employee: IEmployee): DetailedEmployeeResponseDto {
    return {
      ...this.toResponseDto(employee),
      dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.toISOString() : null,
      gender: employee.gender,
      maritalStatus: employee.maritalStatus,
      terminationDate: employee.terminationDate ? employee.terminationDate.toISOString() : null,
      bankName: employee.bankName,
      accountNumber: employee.accountNumber,
      taxId: employee.taxId,
      socialSecurityNumber: employee.socialSecurityNumber,
      emergencyContactName: employee.emergencyContactName,
      emergencyContactPhone: employee.emergencyContactPhone,
      address: {
        street: employee.street,
        city: employee.city,
        state: employee.state,
        postalCode: employee.postalCode,
        country: employee.country
      },
      notes: employee.notes
    }
  }

  /**
   * Maps array of Employee entities to list response DTO
   */
  static toListResponseDto(
    employees: IEmployee[],
    stats?: Record<string, number>,
    departments?: string[],
    positions?: string[]
  ): EmployeeListResponseDto {
    return {
      employees: employees.map(e => this.toResponseDto(e)),
      stats,
      departments,
      positions,
      total: employees.length
    }
  }

  /**
   * Maps array of Employee entities to response DTOs
   */
  static toResponseDtoArray(employees: IEmployee[]): EmployeeResponseDto[] {
    return employees.map(e => this.toResponseDto(e))
  }

  /**
   * Maps array of Employee entities to detailed response DTOs
   */
  static toDetailedResponseDtoArray(employees: IEmployee[]): DetailedEmployeeResponseDto[] {
    return employees.map(e => this.toDetailedResponseDto(e))
  }
}
