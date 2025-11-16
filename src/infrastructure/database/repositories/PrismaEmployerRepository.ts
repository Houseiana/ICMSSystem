import {
  IEmployerRepository,
  IEmployer,
  EmployerSearchFilters
} from '@core/interfaces/repositories'
import { NotFoundException } from '@core/exceptions'
import { prisma } from '../prisma/client'

/**
 * Prisma implementation of IEmployerRepository
 * Handles all employer data access operations using Prisma ORM
 */
export class PrismaEmployerRepository implements IEmployerRepository {
  /**
   * Finds an employer by ID
   */
  async findById(id: number): Promise<IEmployer | null> {
    const employer = await prisma.employer.findUnique({
      where: { id }
    })
    return employer as IEmployer | null
  }

  /**
   * Finds all employers
   */
  async findAll(): Promise<IEmployer[]> {
    const employers = await prisma.employer.findMany({
      orderBy: [
        { status: 'asc' },
        { companyName: 'asc' }
      ]
    })
    return employers as IEmployer[]
  }

  /**
   * Creates a new employer
   */
  async create(entity: IEmployer): Promise<IEmployer> {
    const { id, createdAt, updatedAt, ...data } = entity as any

    const employer = await prisma.employer.create({
      data: data
    })
    return employer as IEmployer
  }

  /**
   * Updates an existing employer
   */
  async update(id: number, entity: Partial<IEmployer>): Promise<IEmployer> {
    const exists = await this.exists(id)
    if (!exists) {
      throw new NotFoundException('Employer', id)
    }

    const { id: _, createdAt, updatedAt, ...data } = entity as any

    const employer = await prisma.employer.update({
      where: { id },
      data: data
    })
    return employer as IEmployer
  }

  /**
   * Deletes an employer by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.employer.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Checks if an employer exists by ID
   */
  async exists(id: number): Promise<boolean> {
    const count = await prisma.employer.count({
      where: { id }
    })
    return count > 0
  }

  /**
   * Counts total number of employers
   */
  async count(): Promise<number> {
    return await prisma.employer.count()
  }

  /**
   * Finds employers by search criteria
   */
  async findByFilters(
    filters: EmployerSearchFilters,
    includeContacts: boolean = false
  ): Promise<IEmployer[]> {
    const where: any = {}

    if (filters.search) {
      where.OR = [
        { companyName: { contains: filters.search, mode: 'insensitive' } },
        { tradingName: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { industry: { contains: filters.search, mode: 'insensitive' } },
        { profession: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { country: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters.industry) {
      where.industry = filters.industry
    }

    if (filters.relationshipType) {
      where.relationshipType = filters.relationshipType
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.employerType) {
      where.employerType = filters.employerType
    }

    const employers = await prisma.employer.findMany({
      where,
      include: {
        contacts: includeContacts ? {
          where: {
            status: 'ACTIVE'
          },
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'desc' }
          ]
        } : false
      },
      orderBy: [
        { status: 'asc' },
        { companyName: 'asc' }
      ]
    })

    return employers as IEmployer[]
  }

  /**
   * Finds an employer by registration number
   */
  async findByRegistrationNumber(registrationNumber: string): Promise<IEmployer | null> {
    const employer = await prisma.employer.findFirst({
      where: {
        registrationNumber: {
          equals: registrationNumber,
          mode: 'insensitive'
        }
      }
    })
    return employer as IEmployer | null
  }

  /**
   * Finds an employer by email
   */
  async findByEmail(email: string): Promise<IEmployer | null> {
    const employer = await prisma.employer.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    })
    return employer as IEmployer | null
  }

  /**
   * Finds employers by industry
   */
  async findByIndustry(industry: string): Promise<IEmployer[]> {
    const employers = await prisma.employer.findMany({
      where: { industry },
      orderBy: [
        { companyName: 'asc' }
      ]
    })
    return employers as IEmployer[]
  }

  /**
   * Finds employers by status
   */
  async findByStatus(status: string): Promise<IEmployer[]> {
    const employers = await prisma.employer.findMany({
      where: { status },
      orderBy: [
        { companyName: 'asc' }
      ]
    })
    return employers as IEmployer[]
  }

  /**
   * Gets employer statistics grouped by status
   */
  async getStatsByStatus(): Promise<Record<string, number>> {
    const stats = await prisma.employer.groupBy({
      by: ['status'],
      _count: true
    })

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Gets distinct industries
   */
  async getDistinctIndustries(): Promise<string[]> {
    const industries = await prisma.employer.findMany({
      select: { industry: true },
      distinct: ['industry'],
      where: { industry: { not: null } },
      orderBy: { industry: 'asc' }
    })

    return industries
      .map(i => i.industry)
      .filter(Boolean) as string[]
  }

  /**
   * Gets distinct relationship types
   */
  async getDistinctRelationshipTypes(): Promise<string[]> {
    const relationshipTypes = await prisma.employer.findMany({
      select: { relationshipType: true },
      distinct: ['relationshipType'],
      where: { relationshipType: { not: null } },
      orderBy: { relationshipType: 'asc' }
    })

    return relationshipTypes
      .map(r => r.relationshipType)
      .filter(Boolean) as string[]
  }
}
