import {
  IVisaRepository,
  IVisa,
  VisaSearchFilters
} from '@core/interfaces/repositories'
import { NotFoundException } from '@core/exceptions'
import { prisma } from '../prisma/client'

/**
 * Prisma implementation of IVisaRepository
 * Handles all visa data access operations using Prisma ORM
 */
export class PrismaVisaRepository implements IVisaRepository {
  /**
   * Finds a visa by ID
   */
  async findById(id: number): Promise<IVisa | null> {
    const visa = await prisma.visa.findUnique({
      where: { id }
    })
    return visa as IVisa | null
  }

  /**
   * Finds all visas
   */
  async findAll(): Promise<IVisa[]> {
    const visas = await prisma.visa.findMany({
      orderBy: [
        { expiryDate: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })
    return visas as IVisa[]
  }

  /**
   * Creates a new visa
   */
  async create(entity: IVisa): Promise<IVisa> {
    const { id, createdAt, updatedAt, ...data } = entity as any

    const visa = await prisma.visa.create({
      data: data
    })
    return visa as IVisa
  }

  /**
   * Updates an existing visa
   */
  async update(id: number, entity: Partial<IVisa>): Promise<IVisa> {
    const exists = await this.exists(id)
    if (!exists) {
      throw new NotFoundException('Visa', id)
    }

    const { id: _, createdAt, updatedAt, ...data } = entity as any

    const visa = await prisma.visa.update({
      where: { id },
      data: data
    })
    return visa as IVisa
  }

  /**
   * Deletes a visa by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.visa.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Checks if a visa exists by ID
   */
  async exists(id: number): Promise<boolean> {
    const count = await prisma.visa.count({
      where: { id }
    })
    return count > 0
  }

  /**
   * Counts total number of visas
   */
  async count(): Promise<number> {
    return await prisma.visa.count()
  }

  /**
   * Finds visas by search criteria
   */
  async findByFilters(filters: VisaSearchFilters): Promise<IVisa[]> {
    const where: any = {}

    if (filters.search) {
      where.OR = [
        { visaNumber: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { middleName: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { passportNumber: { contains: filters.search, mode: 'insensitive' } },
        { nationality: { contains: filters.search, mode: 'insensitive' } },
        { visaType: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters.visaType) {
      where.visaType = filters.visaType
    }

    if (filters.issuingCountry) {
      where.issuingCountry = filters.issuingCountry
    }

    if (filters.destinationCountry) {
      where.destinationCountry = filters.destinationCountry
    }

    if (filters.personType) {
      where.personType = filters.personType
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.expiringWithinDays) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + filters.expiringWithinDays)

      where.expiryDate = {
        gte: new Date(),
        lte: futureDate
      }
    }

    const visas = await prisma.visa.findMany({
      where,
      orderBy: [
        { expiryDate: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })

    return visas as IVisa[]
  }

  /**
   * Finds a visa by visa number
   */
  async findByVisaNumber(visaNumber: string): Promise<IVisa | null> {
    const visa = await prisma.visa.findFirst({
      where: {
        visaNumber: {
          equals: visaNumber,
          mode: 'insensitive'
        }
      }
    })
    return visa as IVisa | null
  }

  /**
   * Finds visas by person
   */
  async findByPerson(personType: string, personId: number): Promise<IVisa[]> {
    const visas = await prisma.visa.findMany({
      where: {
        personType,
        personId
      },
      orderBy: [
        { expiryDate: 'asc' }
      ]
    })
    return visas as IVisa[]
  }

  /**
   * Finds visas by passport number
   */
  async findByPassportNumber(passportNumber: string): Promise<IVisa[]> {
    const visas = await prisma.visa.findMany({
      where: {
        passportNumber: {
          equals: passportNumber,
          mode: 'insensitive'
        }
      },
      orderBy: [
        { expiryDate: 'asc' }
      ]
    })
    return visas as IVisa[]
  }

  /**
   * Finds visas expiring within a certain number of days
   */
  async findExpiringWithinDays(days: number): Promise<IVisa[]> {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const visas = await prisma.visa.findMany({
      where: {
        expiryDate: {
          gte: new Date(),
          lte: futureDate
        },
        status: {
          not: 'EXPIRED'
        }
      },
      orderBy: [
        { expiryDate: 'asc' }
      ]
    })

    return visas as IVisa[]
  }

  /**
   * Finds expired visas
   */
  async findExpired(): Promise<IVisa[]> {
    const visas = await prisma.visa.findMany({
      where: {
        expiryDate: {
          lt: new Date()
        }
      },
      orderBy: [
        { expiryDate: 'desc' }
      ]
    })

    return visas as IVisa[]
  }

  /**
   * Finds visas by status
   */
  async findByStatus(status: string): Promise<IVisa[]> {
    const visas = await prisma.visa.findMany({
      where: { status },
      orderBy: [
        { expiryDate: 'asc' },
        { lastName: 'asc' }
      ]
    })
    return visas as IVisa[]
  }

  /**
   * Gets visa statistics grouped by status
   */
  async getStatsByStatus(): Promise<Record<string, number>> {
    const stats = await prisma.visa.groupBy({
      by: ['status'],
      _count: true
    })

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Gets distinct visa types
   */
  async getDistinctVisaTypes(): Promise<string[]> {
    const visaTypes = await prisma.visa.findMany({
      select: { visaType: true },
      distinct: ['visaType'],
      orderBy: { visaType: 'asc' }
    })

    return visaTypes
      .map(v => v.visaType)
      .filter(Boolean) as string[]
  }

  /**
   * Gets distinct issuing countries
   */
  async getDistinctIssuingCountries(): Promise<string[]> {
    const countries = await prisma.visa.findMany({
      select: { issuingCountry: true },
      distinct: ['issuingCountry'],
      orderBy: { issuingCountry: 'asc' }
    })

    return countries
      .map(c => c.issuingCountry)
      .filter(Boolean) as string[]
  }

  /**
   * Gets distinct destination countries
   */
  async getDistinctDestinationCountries(): Promise<string[]> {
    const countries = await prisma.visa.findMany({
      select: { destinationCountry: true },
      distinct: ['destinationCountry'],
      orderBy: { destinationCountry: 'asc' }
    })

    return countries
      .map(c => c.destinationCountry)
      .filter(Boolean) as string[]
  }
}
