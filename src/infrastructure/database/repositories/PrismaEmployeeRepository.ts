import {
  IEmployeeRepository,
  IEmployee,
  EmployeeSearchFilters
} from '@core/interfaces/repositories'
import { NotFoundException } from '@core/exceptions'
import { prisma } from '../prisma/client'

/**
 * Prisma implementation of IEmployeeRepository
 * Handles all employee data access operations using Prisma ORM
 */
export class PrismaEmployeeRepository implements IEmployeeRepository {
  /**
   * Finds an employee by ID
   */
  async findById(id: number): Promise<IEmployee | null> {
    const employee = await prisma.employee.findUnique({
      where: { id }
    })
    return employee as IEmployee | null
  }

  /**
   * Finds all employees
   */
  async findAll(): Promise<IEmployee[]> {
    const employees = await prisma.employee.findMany({
      orderBy: [
        { status: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })
    return employees as IEmployee[]
  }

  /**
   * Creates a new employee
   */
  async create(entity: IEmployee): Promise<IEmployee> {
    const { id, createdAt, updatedAt, ...data } = entity as any

    const employee = await prisma.employee.create({
      data: data
    })
    return employee as IEmployee
  }

  /**
   * Updates an existing employee
   */
  async update(id: number, entity: Partial<IEmployee>): Promise<IEmployee> {
    const exists = await this.exists(id)
    if (!exists) {
      throw new NotFoundException('Employee', id)
    }

    const { id: _, createdAt, updatedAt, ...data } = entity as any

    const employee = await prisma.employee.update({
      where: { id },
      data: data
    })
    return employee as IEmployee
  }

  /**
   * Deletes an employee by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.employee.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Checks if an employee exists by ID
   */
  async exists(id: number): Promise<boolean> {
    const count = await prisma.employee.count({
      where: { id }
    })
    return count > 0
  }

  /**
   * Counts total number of employees
   */
  async count(): Promise<number> {
    return await prisma.employee.count()
  }

  /**
   * Finds employees by search criteria
   */
  async findByFilters(filters: EmployeeSearchFilters): Promise<IEmployee[]> {
    const where: any = {}

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { middleName: { contains: filters.search, mode: 'insensitive' } },
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phoneNumber: { contains: filters.search, mode: 'insensitive' } },
        { department: { contains: filters.search, mode: 'insensitive' } },
        { position: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters.department) {
      where.department = filters.department
    }

    if (filters.position) {
      where.position = filters.position
    }

    if (filters.employmentType) {
      where.employmentType = filters.employmentType
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.nationality) {
      where.nationality = filters.nationality
    }

    if (filters.gender) {
      where.gender = filters.gender
    }

    const employees = await prisma.employee.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })

    return employees as IEmployee[]
  }

  /**
   * Finds an employee by email
   */
  async findByEmail(email: string): Promise<IEmployee | null> {
    const employee = await prisma.employee.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    })
    return employee as IEmployee | null
  }

  /**
   * Finds employees by department
   */
  async findByDepartment(department: string): Promise<IEmployee[]> {
    const employees = await prisma.employee.findMany({
      where: { department },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })
    return employees as IEmployee[]
  }

  /**
   * Finds employees by status
   */
  async findByStatus(status: string): Promise<IEmployee[]> {
    const employees = await prisma.employee.findMany({
      where: { status },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })
    return employees as IEmployee[]
  }

  /**
   * Gets employee statistics grouped by status
   */
  async getStatsByStatus(): Promise<Record<string, number>> {
    const stats = await prisma.employee.groupBy({
      by: ['status'],
      _count: true
    })

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Gets distinct departments
   */
  async getDistinctDepartments(): Promise<string[]> {
    const departments = await prisma.employee.findMany({
      select: { department: true },
      distinct: ['department'],
      where: { department: { not: null } },
      orderBy: { department: 'asc' }
    })

    return departments
      .map(d => d.department)
      .filter(Boolean) as string[]
  }

  /**
   * Gets distinct positions
   */
  async getDistinctPositions(): Promise<string[]> {
    const positions = await prisma.employee.findMany({
      select: { position: true },
      distinct: ['position'],
      where: { position: { not: null } },
      orderBy: { position: 'asc' }
    })

    return positions
      .map(p => p.position)
      .filter(Boolean) as string[]
  }
}
