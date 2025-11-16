import { IEmployeeRepository, IEmployee } from '@core/interfaces/repositories'
import { NotFoundException, ValidationException } from '@core/exceptions'
import { Email } from '@core/valueObjects'

/**
 * Update Employee Request DTO
 */
export interface UpdateEmployeeRequest {
  firstName?: string
  lastName?: string
  middleName?: string
  email?: string
  phoneNumber?: string
  dateOfBirth?: Date
  nationality?: string
  gender?: string
  maritalStatus?: string
  department?: string
  position?: string
  employmentType?: string
  hireDate?: Date
  terminationDate?: Date
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
  status?: string
  notes?: string
}

/**
 * Update Employee Use Case
 * Updates an existing employee with validation
 */
export class UpdateEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  /**
   * Executes the use case
   * @param id - Employee ID
   * @param request - Employee update request
   * @returns The updated employee entity
   * @throws NotFoundException if employee not found
   * @throws ValidationException if validation fails
   */
  async execute(id: number, request: UpdateEmployeeRequest): Promise<IEmployee> {
    // Validate ID
    if (!id || id <= 0) {
      throw new Error('Invalid employee ID')
    }

    // Check if employee exists
    const existingEmployee = await this.employeeRepository.findById(id)
    if (!existingEmployee) {
      throw new NotFoundException('Employee', id)
    }

    // Validate email if provided
    if (request.email) {
      const email = Email.create(request.email)

      // Check if email is taken by another employee
      const employeeWithEmail = await this.employeeRepository.findByEmail(email.value)
      if (employeeWithEmail && employeeWithEmail.id !== id) {
        throw ValidationException.fromFieldError('email', 'Email already in use by another employee')
      }

      request.email = email.value
    }

    // Generate full name if name fields are updated
    let fullName: string | undefined
    if (request.firstName || request.lastName) {
      const firstName = request.firstName || existingEmployee.firstName
      const lastName = request.lastName || existingEmployee.lastName
      const middleName = request.middleName !== undefined ? request.middleName : existingEmployee.middleName

      fullName = this.generateFullName(firstName, middleName, lastName)
    }

    // Update employee
    const updateData: Partial<IEmployee> = {
      ...request,
      ...(fullName && { fullName })
    }

    const updatedEmployee = await this.employeeRepository.update(id, updateData)

    return updatedEmployee
  }

  /**
   * Generates full name from components
   */
  private generateFullName(
    firstName: string,
    middleName: string | null | undefined,
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
