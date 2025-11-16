import {
  IPassportRepository,
  IPassport,
  PassportSearchFilters,
  IPassportEntitySummary
} from '@core/interfaces/repositories'
import { NotFoundException } from '@core/exceptions'
import { prisma } from '../prisma/client'

/**
 * Prisma implementation of IPassportRepository
 * Handles all passport data access operations using Prisma ORM
 */
export class PrismaPassportRepository implements IPassportRepository {
  /**
   * Finds a passport by ID
   */
  async findById(id: number): Promise<IPassport | null> {
    const passport = await prisma.passport.findUnique({
      where: { id }
    })
    return passport as IPassport | null
  }

  /**
   * Finds all passports
   */
  async findAll(): Promise<IPassport[]> {
    const passports = await prisma.passport.findMany({
      orderBy: [
        { expiryDate: 'asc' },
        { lastNameOnPassport: 'asc' },
        { firstNameOnPassport: 'asc' }
      ]
    })
    return passports as IPassport[]
  }

  /**
   * Creates a new passport
   */
  async create(entity: IPassport): Promise<IPassport> {
    const { id, createdAt, updatedAt, ...data } = entity as any

    const passport = await prisma.passport.create({
      data: data
    })
    return passport as IPassport
  }

  /**
   * Updates an existing passport
   */
  async update(id: number, entity: Partial<IPassport>): Promise<IPassport> {
    const exists = await this.exists(id)
    if (!exists) {
      throw new NotFoundException('Passport', id)
    }

    const { id: _, createdAt, updatedAt, ...data } = entity as any

    const passport = await prisma.passport.update({
      where: { id },
      data: data
    })
    return passport as IPassport
  }

  /**
   * Deletes a passport by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.passport.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Checks if a passport exists by ID
   */
  async exists(id: number): Promise<boolean> {
    const count = await prisma.passport.count({
      where: { id }
    })
    return count > 0
  }

  /**
   * Counts total number of passports
   */
  async count(): Promise<number> {
    return await prisma.passport.count()
  }

  /**
   * Finds passports by search criteria
   */
  async findByFilters(filters: PassportSearchFilters): Promise<IPassport[]> {
    const where: any = {}

    if (filters.search) {
      where.OR = [
        { passportNumber: { contains: filters.search, mode: 'insensitive' } },
        { firstNameOnPassport: { contains: filters.search, mode: 'insensitive' } },
        { lastNameOnPassport: { contains: filters.search, mode: 'insensitive' } },
        { middleName: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { issuingCountry: { contains: filters.search, mode: 'insensitive' } },
        { nationality: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters.issuingCountry) {
      where.issuingCountry = filters.issuingCountry
    }

    if (filters.nationality) {
      where.nationality = filters.nationality
    }

    if (filters.personType) {
      where.ownerType = filters.personType
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

    const passports = await prisma.passport.findMany({
      where,
      orderBy: [
        { expiryDate: 'asc' },
        { lastNameOnPassport: 'asc' },
        { firstNameOnPassport: 'asc' }
      ]
    })

    return passports as IPassport[]
  }

  /**
   * Finds a passport by passport number
   */
  async findByPassportNumber(passportNumber: string): Promise<IPassport | null> {
    const passport = await prisma.passport.findFirst({
      where: {
        passportNumber: {
          equals: passportNumber,
          mode: 'insensitive'
        }
      }
    })
    return passport as IPassport | null
  }

  /**
   * Finds passports by person
   */
  async findByPerson(ownerType: string, ownerId: number): Promise<IPassport[]> {
    const passports = await prisma.passport.findMany({
      where: {
        ownerType,
        ownerId
      },
      orderBy: [
        { expiryDate: 'asc' }
      ]
    })
    return passports as IPassport[]
  }

  /**
   * Finds passports expiring within a certain number of days
   */
  async findExpiringWithinDays(days: number): Promise<IPassport[]> {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const passports = await prisma.passport.findMany({
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

    return passports as IPassport[]
  }

  /**
   * Finds expired passports
   */
  async findExpired(): Promise<IPassport[]> {
    const passports = await prisma.passport.findMany({
      where: {
        expiryDate: {
          lt: new Date()
        }
      },
      orderBy: [
        { expiryDate: 'desc' }
      ]
    })

    return passports as IPassport[]
  }

  /**
   * Finds passports by status
   */
  async findByStatus(status: string): Promise<IPassport[]> {
    const passports = await prisma.passport.findMany({
      where: { status },
      orderBy: [
        { expiryDate: 'asc' },
        { lastNameOnPassport: 'asc' }
      ]
    })
    return passports as IPassport[]
  }

  /**
   * Gets all entities (people) that have passports
   */
  async getEntitiesWithPassports(): Promise<IPassportEntitySummary[]> {
    // Get all passports grouped by person
    const passports = await prisma.passport.findMany({
      where: {
        ownerId: { gt: 0 }
      },
      select: {
        ownerType: true,
        ownerId: true
      }
    })

    // Group by ownerType and ownerId
    const entityMap = new Map<string, { type: string; id: number; count: number }>()

    passports.forEach(p => {
      if (p.ownerId) {
        const key = `${p.ownerType}-${p.ownerId}`
        const existing = entityMap.get(key)
        if (existing) {
          existing.count++
        } else {
          entityMap.set(key, {
            type: p.ownerType,
            id: p.ownerId,
            count: 1
          })
        }
      }
    })

    // Fetch full names from respective tables
    const entities: IPassportEntitySummary[] = []

    for (const [_, entity] of Array.from(entityMap)) {
      let fullName = 'Unknown'

      try {
        if (entity.type === 'EMPLOYEE') {
          const employee = await prisma.employee.findUnique({
            where: { id: entity.id },
            select: { fullName: true }
          })
          fullName = employee?.fullName || 'Unknown'
        } else if (entity.type === 'EMPLOYER') {
          const employer = await prisma.employer.findUnique({
            where: { id: entity.id },
            select: { fullName: true, companyName: true }
          })
          fullName = employer?.fullName || employer?.companyName || 'Unknown'
        } else if (entity.type === 'STAKEHOLDER') {
          const stakeholder = await prisma.stakeholder.findUnique({
            where: { id: entity.id },
            select: { firstName: true, lastName: true }
          })
          fullName = stakeholder ? `${stakeholder.firstName} ${stakeholder.lastName}` : 'Unknown'
        }
      } catch (error) {
        // If entity not found, use default
      }

      entities.push({
        id: entity.id,
        type: entity.type,
        fullName,
        passportCount: entity.count
      })
    }

    return entities.sort((a, b) => a.fullName.localeCompare(b.fullName))
  }

  /**
   * Gets passport statistics grouped by status
   */
  async getStatsByStatus(): Promise<Record<string, number>> {
    const stats = await prisma.passport.groupBy({
      by: ['status'],
      _count: true
    })

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Gets distinct issuing countries
   */
  async getDistinctIssuingCountries(): Promise<string[]> {
    const countries = await prisma.passport.findMany({
      select: { issuingCountry: true },
      distinct: ['issuingCountry'],
      orderBy: { issuingCountry: 'asc' }
    })

    return countries
      .map(c => c.issuingCountry)
      .filter(Boolean) as string[]
  }

  /**
   * Gets distinct nationalities
   */
  async getDistinctNationalities(): Promise<string[]> {
    // Passport schema doesn't have a nationality field at root level
    // Return empty array for now
    return []
  }
}
