/**
 * Example Unit Tests for CreateEmployeeUseCase
 * Demonstrates how to test use cases in isolation using mocks
 */

import { CreateEmployeeUseCase, type CreateEmployeeRequest } from '@application/useCases/employee'
import { type IEmployeeRepository, type IEmployee } from '@core/interfaces/repositories'
import { ValidationException } from '@core/exceptions'

// Mock repository implementation
const createMockRepository = (): jest.Mocked<IEmployeeRepository> => ({
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  exists: jest.fn(),
  count: jest.fn(),
  findByFilters: jest.fn(),
  findByEmail: jest.fn(),
  findByDepartment: jest.fn(),
  findByStatus: jest.fn(),
  getStatsByStatus: jest.fn(),
  getDistinctDepartments: jest.fn(),
  getDistinctPositions: jest.fn()
})

describe('CreateEmployeeUseCase', () => {
  let useCase: CreateEmployeeUseCase
  let mockRepository: jest.Mocked<IEmployeeRepository>

  beforeEach(() => {
    mockRepository = createMockRepository()
    useCase = new CreateEmployeeUseCase(mockRepository)
  })

  describe('execute', () => {
    const validRequest: CreateEmployeeRequest = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      status: 'ACTIVE'
    }

    it('should create employee with valid data', async () => {
      // Arrange
      const expectedEmployee: IEmployee = {
        id: 1,
        ...validRequest,
        fullName: 'John Doe',
        middleName: null,
        phoneNumber: null,
        dateOfBirth: null,
        nationality: null,
        gender: null,
        maritalStatus: null,
        department: null,
        position: null,
        employmentType: null,
        hireDate: null,
        terminationDate: null,
        salary: null,
        currency: null,
        bankName: null,
        accountNumber: null,
        taxId: null,
        socialSecurityNumber: null,
        emergencyContactName: null,
        emergencyContactPhone: null,
        street: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockRepository.findByEmail.mockResolvedValue(null)
      mockRepository.create.mockResolvedValue(expectedEmployee)

      // Act
      const result = await useCase.execute(validRequest)

      // Assert
      expect(result).toEqual(expectedEmployee)
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com')
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          email: 'john.doe@example.com'
        })
      )
    })

    it('should throw ValidationException when email is missing', async () => {
      // Arrange
      const invalidRequest = { ...validRequest, email: '' }

      // Act & Assert
      await expect(useCase.execute(invalidRequest)).rejects.toThrow(ValidationException)
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it('should throw ValidationException when firstName is missing', async () => {
      // Arrange
      const invalidRequest = { ...validRequest, firstName: '' }

      // Act & Assert
      await expect(useCase.execute(invalidRequest)).rejects.toThrow(ValidationException)
    })

    it('should throw ValidationException when lastName is missing', async () => {
      // Arrange
      const invalidRequest = { ...validRequest, lastName: '' }

      // Act & Assert
      await expect(useCase.execute(invalidRequest)).rejects.toThrow(ValidationException)
    })

    it('should throw ValidationException when email is invalid format', async () => {
      // Arrange
      const invalidRequest = { ...validRequest, email: 'invalid-email' }

      // Act & Assert
      await expect(useCase.execute(invalidRequest)).rejects.toThrow(ValidationException)
    })

    it('should throw ValidationException when email already exists', async () => {
      // Arrange
      const existingEmployee: IEmployee = {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        fullName: 'Jane Doe',
        email: 'john.doe@example.com',
        status: 'ACTIVE',
        middleName: null,
        phoneNumber: null,
        dateOfBirth: null,
        nationality: null,
        gender: null,
        maritalStatus: null,
        department: null,
        position: null,
        employmentType: null,
        hireDate: null,
        terminationDate: null,
        salary: null,
        currency: null,
        bankName: null,
        accountNumber: null,
        taxId: null,
        socialSecurityNumber: null,
        emergencyContactName: null,
        emergencyContactPhone: null,
        street: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockRepository.findByEmail.mockResolvedValue(existingEmployee)

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(ValidationException)
      await expect(useCase.execute(validRequest)).rejects.toThrow('Email already exists')
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it('should generate full name with middle name', async () => {
      // Arrange
      const requestWithMiddleName = {
        ...validRequest,
        middleName: 'Michael'
      }

      const expectedEmployee: IEmployee = {
        id: 1,
        ...requestWithMiddleName,
        fullName: 'John Michael Doe',
        phoneNumber: null,
        dateOfBirth: null,
        nationality: null,
        gender: null,
        maritalStatus: null,
        department: null,
        position: null,
        employmentType: null,
        hireDate: null,
        terminationDate: null,
        salary: null,
        currency: null,
        bankName: null,
        accountNumber: null,
        taxId: null,
        socialSecurityNumber: null,
        emergencyContactName: null,
        emergencyContactPhone: null,
        street: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockRepository.findByEmail.mockResolvedValue(null)
      mockRepository.create.mockResolvedValue(expectedEmployee)

      // Act
      const result = await useCase.execute(requestWithMiddleName)

      // Assert
      expect(result.fullName).toBe('John Michael Doe')
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'John Michael Doe'
        })
      )
    })
  })
})
