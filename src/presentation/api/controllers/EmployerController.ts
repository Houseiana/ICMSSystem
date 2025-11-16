import { NextRequest, NextResponse } from 'next/server'
import { RepositoryFactory } from '@infrastructure/database/repositories/RepositoryFactory'
import {
  GetEmployerByIdUseCase,
  GetAllEmployersUseCase,
  CreateEmployerUseCase,
  UpdateEmployerUseCase,
  DeleteEmployerUseCase
} from '@application/useCases/employer'
import { EmployerMapper } from '@application/mappers'
import { ValidationException, NotFoundException, DomainException } from '@core/exceptions'

/**
 * Employer Controller
 * Handles HTTP requests for employer endpoints
 * Follows Clean Architecture by delegating to use cases
 */
export class EmployerController {
  /**
   * GET /api/employers/:id
   * Retrieves a single employer by ID
   */
  static async getById(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const repository = RepositoryFactory.getEmployerRepository()
      const useCase = new GetEmployerByIdUseCase(repository)
      const employer = await useCase.execute(id)
      const dto = EmployerMapper.toDetailedResponseDto(employer)

      return NextResponse.json(dto, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * GET /api/employers
   * Retrieves all employers with optional filtering
   */
  static async getAll(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const includeContacts = searchParams.get('includeContacts') === 'true'
      const includeStats = searchParams.get('includeStats') === 'true'

      const filters = {
        search: searchParams.get('search') || undefined,
        industry: searchParams.get('industry') || undefined,
        relationshipType: searchParams.get('relationshipType') || undefined,
        status: searchParams.get('status') || undefined,
        employerType: searchParams.get('employerType') || undefined
      }

      const repository = RepositoryFactory.getEmployerRepository()
      const useCase = new GetAllEmployersUseCase(repository)

      if (includeStats) {
        const result = await useCase.executeWithStats(filters, includeContacts)
        const dto = EmployerMapper.toListResponseDto(
          result.employers,
          result.stats,
          result.industries,
          result.relationshipTypes
        )
        return NextResponse.json(dto, { status: 200 })
      }

      const employers = await useCase.execute(filters, includeContacts)
      const dtos = EmployerMapper.toResponseDtoArray(employers)

      return NextResponse.json({ employers: dtos, total: dtos.length }, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * POST /api/employers
   * Creates a new employer
   */
  static async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const repository = RepositoryFactory.getEmployerRepository()
      const useCase = new CreateEmployerUseCase(repository)
      const employer = await useCase.execute(body)
      const dto = EmployerMapper.toDetailedResponseDto(employer)

      return NextResponse.json(dto, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * PATCH /api/employers/:id
   * Updates an existing employer
   */
  static async update(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const body = await request.json()
      const repository = RepositoryFactory.getEmployerRepository()
      const useCase = new UpdateEmployerUseCase(repository)
      const employer = await useCase.execute(id, body)
      const dto = EmployerMapper.toDetailedResponseDto(employer)

      return NextResponse.json(dto, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * DELETE /api/employers/:id
   * Deletes an employer
   */
  static async delete(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const soft = searchParams.get('soft') === 'true'

      const repository = RepositoryFactory.getEmployerRepository()
      const useCase = new DeleteEmployerUseCase(repository)

      if (soft) {
        await useCase.softDelete(id)
      } else {
        await useCase.execute(id)
      }

      return NextResponse.json(
        { message: 'Employer deleted successfully' },
        { status: 200 }
      )
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Handles errors and returns appropriate HTTP responses
   */
  private static handleError(error: unknown): NextResponse {
    console.error('Employer Controller Error:', error)

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

    if (error instanceof NotFoundException) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code
        },
        { status: 404 }
      )
    }

    if (error instanceof DomainException) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code
        },
        { status: 422 }
      )
    }

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
