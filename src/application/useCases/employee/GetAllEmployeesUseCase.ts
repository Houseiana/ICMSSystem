import { IEmployeeRepository, IEmployee, EmployeeSearchFilters } from '@core/interfaces/repositories'

/**
 * Get All Employees Use Case
 * Retrieves employees with optional filtering
 */
export class GetAllEmployeesUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  /**
   * Executes the use case
   * @param filters - Optional search filters
   * @returns Array of employees
   */
  async execute(filters?: EmployeeSearchFilters): Promise<IEmployee[]> {
    if (filters && Object.keys(filters).length > 0) {
      return await this.employeeRepository.findByFilters(filters)
    }

    return await this.employeeRepository.findAll()
  }

  /**
   * Gets employees with statistics
   */
  async executeWithStats(filters?: EmployeeSearchFilters): Promise<{
    employees: IEmployee[]
    stats: Record<string, number>
    departments: string[]
    positions: string[]
  }> {
    const [employees, stats, departments, positions] = await Promise.all([
      this.execute(filters),
      this.employeeRepository.getStatsByStatus(),
      this.employeeRepository.getDistinctDepartments(),
      this.employeeRepository.getDistinctPositions()
    ])

    return { employees, stats, departments, positions }
  }
}
