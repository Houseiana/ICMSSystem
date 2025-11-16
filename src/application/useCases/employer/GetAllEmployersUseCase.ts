import { IEmployerRepository, IEmployer, EmployerSearchFilters } from '@core/interfaces/repositories'

/**
 * Get All Employers Use Case
 * Retrieves employers with optional filtering
 */
export class GetAllEmployersUseCase {
  constructor(private readonly employerRepository: IEmployerRepository) {}

  /**
   * Executes the use case
   * @param filters - Optional search filters
   * @param includeContacts - Whether to include associated contacts
   * @returns Array of employers
   */
  async execute(filters?: EmployerSearchFilters, includeContacts: boolean = false): Promise<IEmployer[]> {
    if (filters && Object.keys(filters).length > 0) {
      return await this.employerRepository.findByFilters(filters, includeContacts)
    }

    return await this.employerRepository.findAll()
  }

  /**
   * Gets employers with statistics
   */
  async executeWithStats(filters?: EmployerSearchFilters, includeContacts: boolean = false): Promise<{
    employers: IEmployer[]
    stats: Record<string, number>
    industries: string[]
    relationshipTypes: string[]
  }> {
    const [employers, stats, industries, relationshipTypes] = await Promise.all([
      this.execute(filters, includeContacts),
      this.employerRepository.getStatsByStatus(),
      this.employerRepository.getDistinctIndustries(),
      this.employerRepository.getDistinctRelationshipTypes()
    ])

    return { employers, stats, industries, relationshipTypes }
  }
}
