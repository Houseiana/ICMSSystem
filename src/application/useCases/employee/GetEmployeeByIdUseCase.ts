import { IEmployeeRepository, IEmployee } from '@core/interfaces/repositories'
import { NotFoundException } from '@core/exceptions'

/**
 * Get Employee By ID Use Case
 * Retrieves a single employee by their ID
 *
 * Example of a simple query use case following Clean Architecture principles
 */
export class GetEmployeeByIdUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  /**
   * Executes the use case
   * @param id - Employee ID
   * @returns The employee entity
   * @throws NotFoundException if employee not found
   */
  async execute(id: number): Promise<IEmployee> {
    // Validate input
    if (!id || id <= 0) {
      throw new Error('Invalid employee ID')
    }

    // Query repository
    const employee = await this.employeeRepository.findById(id)

    // Handle not found
    if (!employee) {
      throw new NotFoundException('Employee', id)
    }

    return employee
  }
}
