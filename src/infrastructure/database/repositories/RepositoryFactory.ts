import {
  IEmployeeRepository,
  IEmployerRepository,
  IPassportRepository,
  IVisaRepository
} from '@core/interfaces/repositories'

import { PrismaEmployeeRepository } from './PrismaEmployeeRepository'
import { PrismaEmployerRepository } from './PrismaEmployerRepository'
import { PrismaPassportRepository } from './PrismaPassportRepository'
import { PrismaVisaRepository } from './PrismaVisaRepository'

/**
 * Repository Factory
 * Implements the Factory pattern for creating repository instances
 * Provides dependency injection and singleton management
 */
export class RepositoryFactory {
  private static employeeRepository: IEmployeeRepository | null = null
  private static employerRepository: IEmployerRepository | null = null
  private static passportRepository: IPassportRepository | null = null
  private static visaRepository: IVisaRepository | null = null

  /**
   * Gets the Employee repository instance (singleton)
   */
  static getEmployeeRepository(): IEmployeeRepository {
    if (!this.employeeRepository) {
      this.employeeRepository = new PrismaEmployeeRepository()
    }
    return this.employeeRepository
  }

  /**
   * Gets the Employer repository instance (singleton)
   */
  static getEmployerRepository(): IEmployerRepository {
    if (!this.employerRepository) {
      this.employerRepository = new PrismaEmployerRepository()
    }
    return this.employerRepository
  }

  /**
   * Gets the Passport repository instance (singleton)
   */
  static getPassportRepository(): IPassportRepository {
    if (!this.passportRepository) {
      this.passportRepository = new PrismaPassportRepository()
    }
    return this.passportRepository
  }

  /**
   * Gets the Visa repository instance (singleton)
   */
  static getVisaRepository(): IVisaRepository {
    if (!this.visaRepository) {
      this.visaRepository = new PrismaVisaRepository()
    }
    return this.visaRepository
  }

  /**
   * Resets all repository instances
   * Useful for testing
   */
  static reset(): void {
    this.employeeRepository = null
    this.employerRepository = null
    this.passportRepository = null
    this.visaRepository = null
  }

  /**
   * Sets a custom Employee repository implementation
   * Useful for testing with mocks
   */
  static setEmployeeRepository(repository: IEmployeeRepository): void {
    this.employeeRepository = repository
  }

  /**
   * Sets a custom Employer repository implementation
   * Useful for testing with mocks
   */
  static setEmployerRepository(repository: IEmployerRepository): void {
    this.employerRepository = repository
  }

  /**
   * Sets a custom Passport repository implementation
   * Useful for testing with mocks
   */
  static setPassportRepository(repository: IPassportRepository): void {
    this.passportRepository = repository
  }

  /**
   * Sets a custom Visa repository implementation
   * Useful for testing with mocks
   */
  static setVisaRepository(repository: IVisaRepository): void {
    this.visaRepository = repository
  }
}
