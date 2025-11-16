import { IEmployerRepository, IEmployer } from '@core/interfaces/repositories'
import { NotFoundException } from '@core/exceptions'

/**
 * Get Employer By ID Use Case
 * Retrieves a single employer by their ID
 */
export class GetEmployerByIdUseCase {
  constructor(private readonly employerRepository: IEmployerRepository) {}

  /**
   * Executes the use case
   * @param id - Employer ID
   * @returns The employer entity
   * @throws NotFoundException if employer not found
   */
  async execute(id: number): Promise<IEmployer> {
    // Validate input
    if (!id || id <= 0) {
      throw new Error('Invalid employer ID')
    }

    // Query repository
    const employer = await this.employerRepository.findById(id)

    // Handle not found
    if (!employer) {
      throw new NotFoundException('Employer', id)
    }

    return employer
  }
}
