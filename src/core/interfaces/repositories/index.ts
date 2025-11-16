/**
 * Repository interfaces barrel export
 * Provides centralized access to all repository interfaces
 */
export { IBaseRepository } from './IBaseRepository'
export {
  IEmployeeRepository,
  type IEmployee,
  type EmployeeSearchFilters
} from './IEmployeeRepository'
export {
  IEmployerRepository,
  type IEmployer,
  type EmployerSearchFilters
} from './IEmployerRepository'
export {
  IPassportRepository,
  type IPassport,
  type PassportSearchFilters,
  type IPassportEntitySummary
} from './IPassportRepository'
export {
  IVisaRepository,
  type IVisa,
  type VisaSearchFilters
} from './IVisaRepository'
