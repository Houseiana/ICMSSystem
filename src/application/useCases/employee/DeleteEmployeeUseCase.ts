import { IEmployeeRepository } from '@core/interfaces/repositories'
import { NotFoundException } from '@core/exceptions'

/**
 * Delete Employee Use Case
 * Deletes an employee after validation
 */
export class DeleteEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  /**
   * Executes the use case
   * @param id - Employee ID
   * @throws NotFoundException if employee not found
   * @throws Error if deletion fails
   */
  async execute(id: number): Promise<void> {
    // Validate ID
    if (!id || id <= 0) {
      throw new Error('Invalid employee ID')
    }

    // Check if employee exists
    const exists = await this.employeeRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Employee', id)
    }

    // Delete employee
    const deleted = await this.employeeRepository.delete(id)

    if (!deleted) {
      throw new Error('Failed to delete employee')
    }
  }

  /**
   * Soft delete by updating status to TERMINATED
   * @param id - Employee ID
   */
  async softDelete(id: number): Promise<void> {
    // Validate ID
    if (!id || id <= 0) {
      throw new Error('Invalid employee ID')
    }

    // Check if employee exists
    const exists = await this.employeeRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Employee', id)
    }

    // Update status to TERMINATED
    await this.employeeRepository.update(id, {
      status: 'TERMINATED',
      terminationDate: new Date()
    })
  }
}
