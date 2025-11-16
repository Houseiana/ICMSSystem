import { NextRequest, NextResponse } from 'next/server'
import { RepositoryFactory } from '@infrastructure/database/repositories/RepositoryFactory'
import {
  GetEmployeeByIdUseCase,
  GetAllEmployeesUseCase,
  CreateEmployeeUseCase,
  UpdateEmployeeUseCase,
  DeleteEmployeeUseCase
} from '@application/useCases/employee'
import { ValidationException, NotFoundException, DomainException } from '@core/exceptions'

/**
 * Employee Controller
 * Handles HTTP requests for employee endpoints
 * Follows Clean Architecture by delegating to use cases
 */
export class EmployeeController {
  /**
   * GET /api/employees/:id
   * Retrieves a single employee by ID
   */
  static async getById(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      // Get repository from factory
      const repository = RepositoryFactory.getEmployeeRepository()

      // Create and execute use case
      const useCase = new GetEmployeeByIdUseCase(repository)
      const employee = await useCase.execute(id)

      return NextResponse.json(employee, { status: 200 })

    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * GET /api/employees
   * Retrieves all employees with optional filters
   */
  static async getAll(request: NextRequest): Promise<NextResponse> {
    try {
      // Parse query parameters
      const { searchParams } = new URL(request.url)
      const includeStats = searchParams.get('includeStats') === 'true'

      // Build filters
      const filters = {
        search: searchParams.get('search') || undefined,
        department: searchParams.get('department') || undefined,
        position: searchParams.get('position') || undefined,
        employmentType: searchParams.get('employmentType') || undefined,
        status: searchParams.get('status') || undefined,
        nationality: searchParams.get('nationality') || undefined,
        gender: searchParams.get('gender') || undefined
      }

      // Get repository from factory
      const repository = RepositoryFactory.getEmployeeRepository()

      // Create and execute use case
      const useCase = new GetAllEmployeesUseCase(repository)

      if (includeStats) {
        const result = await useCase.executeWithStats(filters)
        return NextResponse.json(result, { status: 200 })
      }

      const employees = await useCase.execute(filters)
      return NextResponse.json({ employees, total: employees.length }, { status: 200 })

    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * POST /api/employees
   * Creates a new employee
   */
  static async create(request: NextRequest): Promise<NextResponse> {
    try {
      // Parse request body
      const body = await request.json()

      // Get repository from factory
      const repository = RepositoryFactory.getEmployeeRepository()

      // Create and execute use case
      const useCase = new CreateEmployeeUseCase(repository)
      const employee = await useCase.execute(body)

      return NextResponse.json(employee, { status: 201 })

    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * PATCH /api/employees/:id
   * Updates an existing employee
   */
  static async update(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      // Parse request body
      const body = await request.json()

      // Get repository from factory
      const repository = RepositoryFactory.getEmployeeRepository()

      // Create and execute use case
      const useCase = new UpdateEmployeeUseCase(repository)
      const employee = await useCase.execute(id, body)

      return NextResponse.json(employee, { status: 200 })

    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * DELETE /api/employees/:id
   * Deletes an employee (soft delete by default)
   */
  static async delete(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      // Get repository from factory
      const repository = RepositoryFactory.getEmployeeRepository()

      // Create and execute use case
      const useCase = new DeleteEmployeeUseCase(repository)
      await useCase.execute(id)

      return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 })

    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Handles errors and returns appropriate HTTP responses
   */
  private static handleError(error: unknown): NextResponse {
    console.error('Employee Controller Error:', error)

    // ValidationException - 400 Bad Request
    if (error instanceof ValidationException) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          validationErrors: error.errors
        },
        { status: 400 }
      )
    }

    // NotFoundException - 404 Not Found
    if (error instanceof NotFoundException) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code
        },
        { status: 404 }
      )
    }

    // DomainException - 422 Unprocessable Entity
    if (error instanceof DomainException) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code
        },
        { status: 422 }
      )
    }

    // Generic Error - 500 Internal Server Error
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
