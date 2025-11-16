/**
 * Repository interfaces barrel export
 * Provides centralized access to all repository interfaces
 */
export type { IBaseRepository } from './IBaseRepository'
export type {
  IEmployeeRepository,
  IEmployee,
  EmployeeSearchFilters
} from './IEmployeeRepository'
export type {
  IEmployerRepository,
  IEmployer,
  EmployerSearchFilters
} from './IEmployerRepository'
export type {
  IPassportRepository,
  IPassport,
  PassportSearchFilters,
  IPassportEntitySummary
} from './IPassportRepository'
export type {
  IVisaRepository,
  IVisa,
  VisaSearchFilters
} from './IVisaRepository'
