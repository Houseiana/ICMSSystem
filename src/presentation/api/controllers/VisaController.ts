import { NextRequest, NextResponse } from 'next/server'
import { RepositoryFactory } from '@infrastructure/database/repositories/RepositoryFactory'
import {
  GetVisaByIdUseCase,
  GetAllVisasUseCase,
  CreateVisaUseCase,
  UpdateVisaUseCase,
  DeleteVisaUseCase,
  GetExpiringVisasUseCase
} from '@application/useCases/visa'
import { ValidationException, NotFoundException, DomainException } from '@core/exceptions'

/**
 * Visa Controller
 * Handles HTTP requests for visa endpoints
 */
export class VisaController {
  /**
   * GET /api/visas/:id
   */
  static async getById(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const repository = RepositoryFactory.getVisaRepository()
      const useCase = new GetVisaByIdUseCase(repository)
      const visa = await useCase.execute(id)

      return NextResponse.json(visa, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * GET /api/visas
   */
  static async getAll(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const includeStats = searchParams.get('includeStats') === 'true'

      const filters = {
        search: searchParams.get('search') || undefined,
        visaType: searchParams.get('visaType') || undefined,
        issuingCountry: searchParams.get('issuingCountry') || undefined,
        destinationCountry: searchParams.get('destinationCountry') || undefined,
        personType: searchParams.get('personType') || undefined,
        status: searchParams.get('status') || undefined,
        expiringWithinDays: searchParams.get('expiringWithinDays')
          ? parseInt(searchParams.get('expiringWithinDays')!)
          : undefined
      }

      const repository = RepositoryFactory.getVisaRepository()
      const useCase = new GetAllVisasUseCase(repository)

      if (includeStats) {
        const result = await useCase.executeWithStats(filters)
        return NextResponse.json(result, { status: 200 })
      }

      const visas = await useCase.execute(filters)
      return NextResponse.json({ visas, total: visas.length }, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * GET /api/visas/expiring
   */
  static async getExpiring(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 90

      const repository = RepositoryFactory.getVisaRepository()
      const useCase = new GetExpiringVisasUseCase(repository)
      const visas = await useCase.execute(days)

      return NextResponse.json({ visas, total: visas.length }, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * POST /api/visas
   */
  static async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const repository = RepositoryFactory.getVisaRepository()
      const useCase = new CreateVisaUseCase(repository)
      const visa = await useCase.execute(body)

      return NextResponse.json(visa, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * PATCH /api/visas/:id
   */
  static async update(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const body = await request.json()
      const repository = RepositoryFactory.getVisaRepository()
      const useCase = new UpdateVisaUseCase(repository)
      const visa = await useCase.execute(id, body)

      return NextResponse.json(visa, { status: 200 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * DELETE /api/visas/:id
   */
  static async delete(request: NextRequest, id: number): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const soft = searchParams.get('soft') === 'true'

      const repository = RepositoryFactory.getVisaRepository()
      const useCase = new DeleteVisaUseCase(repository)

      if (soft) {
        await useCase.softDelete(id)
      } else {
        await useCase.execute(id)
      }

      return NextResponse.json(
        { message: 'Visa deleted successfully' },
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
    console.error('Visa Controller Error:', error)

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
