/**
 * Example Unit Tests for EmployeeMapper
 * Demonstrates how to test mappers
 */

import { EmployeeMapper } from '@application/mappers'
import { type IEmployee } from '@core/interfaces/repositories'

describe('EmployeeMapper', () => {
  const mockEmployee: IEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    fullName: 'John Michael Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    dateOfBirth: new Date('1990-01-01'),
    nationality: 'USA',
    gender: 'Male',
    maritalStatus: 'Single',
    department: 'Engineering',
    position: 'Senior Developer',
    employmentType: 'Full-time',
    status: 'ACTIVE',
    hireDate: new Date('2020-01-01'),
    terminationDate: null,
    salary: 100000,
    currency: 'USD',
    bankName: 'Test Bank',
    accountNumber: '1234567890',
    taxId: 'TAX123',
    socialSecurityNumber: 'SSN123',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+0987654321',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    notes: 'Test notes',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01')
  }

  describe('toResponseDto', () => {
    it('should map employee to basic response DTO', () => {
      // Act
      const dto = EmployeeMapper.toResponseDto(mockEmployee)

      // Assert
      expect(dto.id).toBe(1)
      expect(dto.fullName).toBe('John Michael Doe')
      expect(dto.firstName).toBe('John')
      expect(dto.lastName).toBe('Doe')
      expect(dto.email).toBe('john.doe@example.com')
      expect(dto.department).toBe('Engineering')
      expect(dto.position).toBe('Senior Developer')
      expect(dto.status).toBe('ACTIVE')
    })

    it('should convert dates to ISO strings', () => {
      // Act
      const dto = EmployeeMapper.toResponseDto(mockEmployee)

      // Assert
      expect(typeof dto.createdAt).toBe('string')
      expect(typeof dto.updatedAt).toBe('string')
      expect(typeof dto.hireDate).toBe('string')
      expect(dto.createdAt).toBe('2020-01-01T00:00:00.000Z')
    })

    it('should handle null dates', () => {
      // Arrange
      const employeeWithoutHireDate = { ...mockEmployee, hireDate: null }

      // Act
      const dto = EmployeeMapper.toResponseDto(employeeWithoutHireDate)

      // Assert
      expect(dto.hireDate).toBeNull()
    })
  })

  describe('toDetailedResponseDto', () => {
    it('should include all employee fields', () => {
      // Act
      const dto = EmployeeMapper.toDetailedResponseDto(mockEmployee)

      // Assert
      expect(dto.id).toBe(1)
      expect(dto.fullName).toBe('John Michael Doe')
      expect(dto.dateOfBirth).toBe('1990-01-01T00:00:00.000Z')
      expect(dto.gender).toBe('Male')
      expect(dto.maritalStatus).toBe('Single')
      expect(dto.bankName).toBe('Test Bank')
      expect(dto.taxId).toBe('TAX123')
      expect(dto.notes).toBe('Test notes')
    })

    it('should include nested address object', () => {
      // Act
      const dto = EmployeeMapper.toDetailedResponseDto(mockEmployee)

      // Assert
      expect(dto.address).toBeDefined()
      expect(dto.address?.street).toBe('123 Main St')
      expect(dto.address?.city).toBe('New York')
      expect(dto.address?.state).toBe('NY')
      expect(dto.address?.postalCode).toBe('10001')
      expect(dto.address?.country).toBe('USA')
    })
  })

  describe('toListResponseDto', () => {
    it('should map employees array with metadata', () => {
      // Arrange
      const employees = [mockEmployee]
      const stats = { ACTIVE: 10, TERMINATED: 5 }
      const departments = ['Engineering', 'Sales']
      const positions = ['Developer', 'Manager']

      // Act
      const dto = EmployeeMapper.toListResponseDto(employees, stats, departments, positions)

      // Assert
      expect(dto.employees).toHaveLength(1)
      expect(dto.total).toBe(1)
      expect(dto.stats).toEqual(stats)
      expect(dto.departments).toEqual(departments)
      expect(dto.positions).toEqual(positions)
    })
  })

  describe('toResponseDtoArray', () => {
    it('should map array of employees', () => {
      // Arrange
      const employees = [mockEmployee, { ...mockEmployee, id: 2 }]

      // Act
      const dtos = EmployeeMapper.toResponseDtoArray(employees)

      // Assert
      expect(dtos).toHaveLength(2)
      expect(dtos[0].id).toBe(1)
      expect(dtos[1].id).toBe(2)
    })
  })
})
