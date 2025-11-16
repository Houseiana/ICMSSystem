import { prisma } from '@/infrastructure/database/prisma/client'

/**
 * Person Details Interface
 * Standardized interface for person details across different entity types
 */
export interface PersonDetails {
  id: number
  fullName: string
  firstName?: string
  lastName?: string
  email: string | null
  phone: string | null
  nationality: string | null
  dateOfBirth: Date | null
  type: 'EMPLOYEE' | 'STAKEHOLDER' | 'EMPLOYER' | 'TASK_HELPER'
}

/**
 * Fetch person details by type and ID
 * Supports polymorphic queries across Employee, Stakeholder, Employer, and TaskHelper
 *
 * @param personType - The type of person (EMPLOYEE, STAKEHOLDER, EMPLOYER, TASK_HELPER)
 * @param personId - The ID of the person
 * @returns PersonDetails object or null if not found
 */
export async function fetchPersonDetails(
  personType: string,
  personId: number
): Promise<PersonDetails | null> {
  try {
    switch (personType) {
      case 'EMPLOYEE': {
        const employee = await prisma.employee.findUnique({
          where: { id: personId },
          select: {
            id: true,
            fullName: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            nationality: true,
            dateOfBirth: true
          }
        })

        if (!employee) return null

        return {
          id: employee.id,
          fullName: employee.fullName || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Unknown',
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          nationality: employee.nationality,
          dateOfBirth: employee.dateOfBirth,
          type: 'EMPLOYEE'
        }
      }

      case 'STAKEHOLDER': {
        const stakeholder = await prisma.stakeholder.findUnique({
          where: { id: personId },
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true,
            phone: true,
            nationality: true,
            dateOfBirth: true
          }
        })

        if (!stakeholder) return null

        return {
          id: stakeholder.id,
          fullName: `${stakeholder.firstName}${stakeholder.middleName ? ' ' + stakeholder.middleName : ''} ${stakeholder.lastName}`,
          firstName: stakeholder.firstName,
          lastName: stakeholder.lastName,
          email: stakeholder.email,
          phone: stakeholder.phone,
          nationality: stakeholder.nationality,
          dateOfBirth: stakeholder.dateOfBirth,
          type: 'STAKEHOLDER'
        }
      }

      case 'EMPLOYER': {
        const employer = await prisma.employer.findUnique({
          where: { id: personId },
          select: {
            id: true,
            companyName: true,
            fullName: true,
            firstName: true,
            lastName: true,
            primaryEmail: true,
            secondaryEmail: true,
            mainPhone: true,
            alternatePhone: true,
            nationality: true,
            dateOfBirth: true
          }
        })

        if (!employer) return null

        return {
          id: employer.id,
          fullName: employer.companyName || employer.fullName || `${employer.firstName || ''} ${employer.lastName || ''}`.trim() || 'Unknown',
          firstName: employer.firstName || undefined,
          lastName: employer.lastName || undefined,
          email: employer.primaryEmail || employer.secondaryEmail,
          phone: employer.mainPhone || employer.alternatePhone,
          nationality: employer.nationality,
          dateOfBirth: employer.dateOfBirth,
          type: 'EMPLOYER'
        }
      }

      case 'TASK_HELPER': {
        const taskHelper = await prisma.taskHelper.findUnique({
          where: { id: personId },
          select: {
            id: true,
            fullName: true,
            primaryEmail: true,
            primaryPhone: true,
            nationality: true,
            dateOfBirth: true
          }
        })

        if (!taskHelper) return null

        return {
          id: taskHelper.id,
          fullName: taskHelper.fullName || 'Unknown',
          email: taskHelper.primaryEmail,
          phone: taskHelper.primaryPhone,
          nationality: taskHelper.nationality,
          dateOfBirth: taskHelper.dateOfBirth,
          type: 'TASK_HELPER'
        }
      }

      default:
        console.error(`Unknown person type: ${personType}`)
        return null
    }
  } catch (error) {
    console.error(`Error fetching ${personType} details for ID ${personId}:`, error)
    return null
  }
}

/**
 * Fetch multiple person details at once
 * Useful for batch operations
 *
 * @param persons - Array of {personType, personId} objects
 * @returns Array of PersonDetails objects (skips not found)
 */
export async function fetchMultiplePersonDetails(
  persons: Array<{ personType: string; personId: number }>
): Promise<PersonDetails[]> {
  const results = await Promise.all(
    persons.map(({ personType, personId }) => fetchPersonDetails(personType, personId))
  )

  // Filter out null values
  return results.filter((person): person is PersonDetails => person !== null)
}

/**
 * Search for persons across all entity types
 *
 * @param searchTerm - Search term to match against names, emails, phones
 * @param limit - Maximum number of results per entity type
 * @returns Array of PersonDetails objects from all entity types
 */
export async function searchPersons(
  searchTerm: string,
  limit: number = 10
): Promise<PersonDetails[]> {
  if (!searchTerm || searchTerm.length < 2) {
    return []
  }

  const results: PersonDetails[] = []

  // Search Employees
  const employees = await prisma.employee.findMany({
    where: {
      OR: [
        { fullName: { contains: searchTerm, mode: 'insensitive' } },
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      fullName: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      nationality: true,
      dateOfBirth: true
    },
    take: limit
  })

  employees.forEach(emp => {
    results.push({
      id: emp.id,
      fullName: emp.fullName || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown',
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      nationality: emp.nationality,
      dateOfBirth: emp.dateOfBirth,
      type: 'EMPLOYEE'
    })
  })

  // Search Stakeholders
  const stakeholders = await prisma.stakeholder.findMany({
    where: {
      OR: [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { middleName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      phone: true,
      nationality: true,
      dateOfBirth: true
    },
    take: limit
  })

  stakeholders.forEach(sh => {
    results.push({
      id: sh.id,
      fullName: `${sh.firstName}${sh.middleName ? ' ' + sh.middleName : ''} ${sh.lastName}` || 'Unknown',
      firstName: sh.firstName,
      lastName: sh.lastName,
      email: sh.email,
      phone: sh.phone,
      nationality: sh.nationality,
      dateOfBirth: sh.dateOfBirth,
      type: 'STAKEHOLDER'
    })
  })

  // Search Employers
  const employers = await prisma.employer.findMany({
    where: {
      OR: [
        { companyName: { contains: searchTerm, mode: 'insensitive' } },
        { primaryEmail: { contains: searchTerm, mode: 'insensitive' } },
        { secondaryEmail: { contains: searchTerm, mode: 'insensitive' } },
        { mainPhone: { contains: searchTerm, mode: 'insensitive' } },
        { alternatePhone: { contains: searchTerm, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      companyName: true,
      fullName: true,
      primaryEmail: true,
      secondaryEmail: true,
      mainPhone: true,
      alternatePhone: true,
      nationality: true,
      dateOfBirth: true
    },
    take: limit
  })

  employers.forEach(emp => {
    results.push({
      id: emp.id,
      fullName: emp.companyName || emp.fullName || 'Unknown',
      email: emp.primaryEmail || emp.secondaryEmail,
      phone: emp.mainPhone || emp.alternatePhone,
      nationality: emp.nationality,
      dateOfBirth: emp.dateOfBirth,
      type: 'EMPLOYER'
    })
  })

  // Search Task Helpers
  const taskHelpers = await prisma.taskHelper.findMany({
    where: {
      OR: [
        { fullName: { contains: searchTerm, mode: 'insensitive' } },
        { primaryEmail: { contains: searchTerm, mode: 'insensitive' } },
        { primaryPhone: { contains: searchTerm, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      fullName: true,
      primaryEmail: true,
      primaryPhone: true,
      nationality: true,
      dateOfBirth: true
    },
    take: limit
  })

  taskHelpers.forEach(th => {
    results.push({
      id: th.id,
      fullName: th.fullName || 'Unknown',
      email: th.primaryEmail,
      phone: th.primaryPhone,
      nationality: th.nationality,
      dateOfBirth: th.dateOfBirth,
      type: 'TASK_HELPER'
    })
  })

  return results
}

/**
 * Validate if a person exists
 *
 * @param personType - The type of person
 * @param personId - The ID of the person
 * @returns true if person exists, false otherwise
 */
export async function personExists(
  personType: string,
  personId: number
): Promise<boolean> {
  const person = await fetchPersonDetails(personType, personId)
  return person !== null
}

/**
 * Get person display name
 * Convenience function to get just the name
 *
 * @param personType - The type of person
 * @param personId - The ID of the person
 * @returns Display name or 'Unknown' if not found
 */
export async function getPersonDisplayName(
  personType: string,
  personId: number
): Promise<string> {
  const person = await fetchPersonDetails(personType, personId)
  return person ? person.fullName : 'Unknown'
}
