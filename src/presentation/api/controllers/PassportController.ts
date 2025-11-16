import { NextRequest, NextResponse } from 'next/server'
import { RepositoryFactory } from '@infrastructure/database/repositories/RepositoryFactory'
import {
  GetPassportByIdUseCase,
  GetAllPassportsUseCase,
  CreatePassportUseCase,
  UpdatePassportUseCase,
  DeletePassportUseCase,
  GetExpiringPassportsUseCase
} from '@application/useCases/passport'
import { ValidationException, NotFoundException, DomainException } from '@core/exceptions'

/**
 * Passport Controller
 * Handles HTTP requests for passport endpoints
 */
export class PassportController {
  /**
   * GET /api/passports/:id
   */
  static async getById(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const repository = RepositoryFactory.getPassportRepository()
      const useCase = new GetPassportByIdUseCase(repository)
      const passport = await useCase.execute(id)

      return NextResponse.json(passport, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * GET /api/passports
   */
  static async getAll(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const includeStats = searchParams.get('includeStats') === 'true'

      const filters = {
        search: searchParams.get('search') || undefined,
        issuingCountry: searchParams.get('issuingCountry') || undefined,
        nationality: searchParams.get('nationality') || undefined,
        personType: searchParams.get('personType') || undefined,
        status: searchParams.get('status') || undefined,
        expiringWithinDays: searchParams.get('expiringWithinDays')
          ? parseInt(searchParams.get('expiringWithinDays')!)
          : undefined
      }

      const repository = RepositoryFactory.getPassportRepository()
      const useCase = new GetAllPassportsUseCase(repository)

      if (includeStats) {
        const result = await useCase.executeWithStats(filters)
        return NextResponse.json(result, { status: 200 })
      }

      const passports = await useCase.execute(filters)
      return NextResponse.json({ passports, total: passports.length }, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * GET /api/passports/expiring
   */
  static async getExpiring(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 90

      const repository = RepositoryFactory.getPassportRepository()
      const useCase = new GetExpiringPassportsUseCase(repository)
      const passports = await useCase.execute(days)

      return NextResponse.json({ passports, total: passports.length }, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * POST /api/passports
   */
  static async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const repository = RepositoryFactory.getPassportRepository()
      const useCase = new CreatePassportUseCase(repository)
      const passport = await useCase.execute(body)

      return NextResponse.json(passport, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * PATCH /api/passports/:id
   */
  static async update(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const body = await request.json()
      const repository = RepositoryFactory.getPassportRepository()
      const useCase = new UpdatePassportUseCase(repository)
      const passport = await useCase.execute(id, body)

      return NextResponse.json(passport, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * DELETE /api/passports/:id
   */
  static async delete(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const soft = searchParams.get('soft') === 'true'

      const repository = RepositoryFactory.getPassportRepository()
      const useCase = new DeletePassportUseCase(repository)

      if (soft) {
        await useCase.softDelete(id)
      } else {
        await useCase.execute(id)
      }

      return NextResponse.json(
        { message: 'Passport deleted successfully' },
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
    console.error('Passport Controller Error:', error)

    if (error instanceof ValidationException) {
      return NextResponse.json(error.toJSON(), { status: 400 })
    }

    if (error instanceof NotFoundException) {
      return NextResponse.json(error.toJSON(), { status: 404 })
    }

    if (error instanceof DomainException) {
      return NextResponse.json(error.toJSON(), { status: 422 })
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
