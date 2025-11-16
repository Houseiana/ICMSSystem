import { IEmployerRepository } from '@core/interfaces/repositories'
import { NotFoundException } from '@core/exceptions'

/**
 * Delete Employer Use Case
 * Deletes an employer after validation
 */
export class DeleteEmployerUseCase {
  constructor(private readonly employerRepository: IEmployerRepository) {}

  /**
   * Executes the use case
   * @param id - Employer ID
   * @throws NotFoundException if employer not found
   * @throws Error if deletion fails
   */
  async execute(id: number): Promise<void> {
    // Validate ID
    if (!id || id <= 0) {
      throw new Error('Invalid employer ID')
    }

    // Check if employer exists
    const exists = await this.employerRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Employer', id)
    }

    // Delete employer
    const deleted = await this.employerRepository.delete(id)

    if (!deleted) {
      throw new Error('Failed to delete employer')
    }
  }

  /**
   * Soft delete by updating status to INACTIVE
   * @param id - Employer ID
   */
  async softDelete(id: number): Promise<void> {
    // Validate ID
    if (!id || id <= 0) {
      throw new Error('Invalid employer ID')
    }

    // Check if employer exists
    const exists = await this.employerRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Employer', id)
    }

    // Update status to INACTIVE
    await this.employerRepository.update(id, {
      status: 'INACTIVE'
    })
  }
}
