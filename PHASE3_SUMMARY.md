# Phase 3: Use Cases Implementation - Complete! ✅

This document summarizes the completion of Phase 3: implementing comprehensive use cases, DTOs, and mappers for the Clean Architecture.

## Overview

Phase 3 focused on building the **Application Layer**, which orchestrates business workflows and coordinates between the domain and infrastructure layers.

## What Was Implemented

### 1. Employee Use Cases (5 Complete)

**Location**: `src/application/useCases/employee/`

- **GetEmployeeByIdUseCase** ([GetEmployeeByIdUseCase.ts](src/application/useCases/employee/GetEmployeeByIdUseCase.ts))
  - Retrieves single employee by ID
  - Validates input
  - Throws NotFoundException if not found

- **GetAllEmployeesUseCase** ([GetAllEmployeesUseCase.ts](src/application/useCases/employee/GetAllEmployeesUseCase.ts))
  - Lists all employees with optional filtering
  - Supports search by multiple criteria
  - Includes `executeWithStats()` method for dashboard data

- **CreateEmployeeUseCase** ([CreateEmployeeUseCase.ts](src/application/useCases/employee/CreateEmployeeUseCase.ts))
  - Creates new employee with validation
  - Uses Email value object for email validation
  - Checks for duplicate emails
  - Generates full name automatically
  - 128 lines of robust validation logic

- **UpdateEmployeeUseCase** ([UpdateEmployeeUseCase.ts](src/application/useCases/employee/UpdateEmployeeUseCase.ts))
  - Updates existing employee
  - Validates email uniqueness across other employees
  - Regenerates full name when name fields change
  - 111 lines with comprehensive validation

- **DeleteEmployeeUseCase** ([DeleteEmployeeUseCase.ts](src/application/useCases/employee/DeleteEmployeeUseCase.ts))
  - Hard delete with validation
  - Soft delete option (sets status to TERMINATED)
  - Checks existence before deletion

### 2. Employer Use Cases (5 Complete)

**Location**: `src/application/useCases/employer/`

- **GetEmployerByIdUseCase** ([GetEmployerByIdUseCase.ts](src/application/useCases/employer/GetEmployerByIdUseCase.ts))
  - Retrieves single employer
  - Similar pattern to employee use case

- **GetAllEmployersUseCase** ([GetAllEmployersUseCase.ts](src/application/useCases/employer/GetAllEmployersUseCase.ts))
  - Lists employers with filtering
  - Optional contact inclusion
  - Statistics aggregation support

- **CreateEmployerUseCase** ([CreateEmployerUseCase.ts](src/application/useCases/employer/CreateEmployerUseCase.ts))
  - Complex validation for COMPANY vs INDIVIDUAL types
  - Checks email and registration number uniqueness
  - Smart full name generation based on employer type
  - 156 lines with type-specific validation

- **UpdateEmployerUseCase** ([UpdateEmployerUseCase.ts](src/application/useCases/employer/UpdateEmployerUseCase.ts))
  - Updates with type-aware validation
  - Email and registration number conflict checking
  - Dynamic full name regeneration
  - 149 lines

- **DeleteEmployerUseCase** ([DeleteEmployerUseCase.ts](src/application/useCases/employer/DeleteEmployerUseCase.ts))
  - Hard and soft delete options
  - Soft delete sets status to INACTIVE

### 3. Passport Use Cases (6 Complete)

**Location**: `src/application/useCases/passport/`

All implemented in [PassportUseCases.ts](src/application/useCases/passport/PassportUseCases.ts) (247 lines):

- **GetPassportByIdUseCase** - Single passport retrieval
- **GetAllPassportsUseCase** - List with filtering and statistics
- **CreatePassportUseCase** - Create with comprehensive validation
  - Validates passport number uniqueness
  - Ensures expiry date > issue date
  - Validates all required fields (9 validations)
- **UpdatePassportUseCase** - Update with conflict checking
- **DeletePassportUseCase** - Hard/soft delete
- **GetExpiringPassportsUseCase** - Find passports expiring within N days

### 4. Visa Use Cases (6 Complete)

**Location**: `src/application/useCases/visa/`

All implemented in [VisaUseCases.ts](src/application/useCases/visa/VisaUseCases.ts) (281 lines):

- **GetVisaByIdUseCase** - Single visa retrieval
- **GetAllVisasUseCase** - List with filtering and statistics
- **CreateVisaUseCase** - Create with validation
  - Validates visa number uniqueness
  - Ensures expiry date > issue date
  - Validates 12 required fields
- **UpdateVisaUseCase** - Update with conflict checking
- **DeleteVisaUseCase** - Hard/soft delete
- **GetExpiringVisasUseCase** - Find visas expiring within N days

### 5. Response DTOs

**Location**: `src/application/dto/responses/`

**EmployeeResponseDto** ([EmployeeResponseDto.ts](src/application/dto/responses/EmployeeResponseDto.ts)):
- `EmployeeResponseDto` - Basic employee data (14 fields)
- `DetailedEmployeeResponseDto` - Complete employee data (extends basic with address, sensitive data)
- `EmployeeListResponseDto` - List with metadata (stats, departments, positions)

**EmployerResponseDto** ([EmployerResponseDto.ts](src/application/dto/responses/EmployerResponseDto.ts)):
- `EmployerResponseDto` - Basic employer data (13 fields)
- `DetailedEmployerResponseDto` - Complete employer data (35+ fields, includes address, billing address)
- `EmployerListResponseDto` - List with metadata (stats, industries, relationship types)

**Key Features**:
- All dates converted to ISO strings
- Nullable fields properly typed
- Nested objects for addresses
- Consistent naming conventions

### 6. Mappers

**Location**: `src/application/mappers/`

**EmployeeMapper** ([EmployeeMapper.ts](src/application/mappers/EmployeeMapper.ts)):
- `toResponseDto()` - Entity → Basic DTO
- `toDetailedResponseDto()` - Entity → Detailed DTO
- `toListResponseDto()` - Entities → List DTO with metadata
- `toResponseDtoArray()` - Batch basic mapping
- `toDetailedResponseDtoArray()` - Batch detailed mapping

**EmployerMapper** ([EmployerMapper.ts](src/application/mappers/EmployerMapper.ts)):
- Same methods as EmployeeMapper
- Handles employer-specific fields
- Separates main address and billing address

**Mapper Benefits**:
- Centralized transformation logic
- Date formatting consistency
- Easy to maintain and test
- Prevents data leakage (can exclude sensitive fields)

## Code Statistics

### Total Files Created: 18

**Use Cases**: 11 files
- Employee: 5 files
- Employer: 5 files
- Passport: 2 files (consolidated)
- Visa: 2 files (consolidated)

**DTOs**: 3 files
- Employee DTOs: 1 file
- Employer DTOs: 1 file
- Index: 1 file

**Mappers**: 3 files
- Employee Mapper: 1 file
- Employer Mapper: 1 file
- Index: 1 file

**Application Index**: 1 file

### Total Lines of Code: ~1,600+

- Employee Use Cases: ~350 lines
- Employer Use Cases: ~420 lines
- Passport Use Cases: ~250 lines
- Visa Use Cases: ~280 lines
- DTOs: ~180 lines
- Mappers: ~140 lines

## Architecture Patterns Used

### 1. Command-Query Separation (CQS)

**Queries** (return data, no side effects):
- `GetEmployeeByIdUseCase`
- `GetAllEmployeesUseCase`
- `GetExpiringPassportsUseCase`

**Commands** (modify state, may return created/updated entity):
- `CreateEmployeeUseCase`
- `UpdateEmployeeUseCase`
- `DeleteEmployeeUseCase`

### 2. Dependency Injection

All use cases receive repository through constructor:
```typescript
export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}
  // ...
}
```

### 3. Single Responsibility Principle

Each use case has ONE job:
- `CreateEmployeeUseCase` - Only creates employees
- `UpdateEmployeeUseCase` - Only updates employees
- NOT combined into `SaveEmployeeUseCase`

### 4. Validation at Boundaries

Use cases validate inputs before calling domain logic:
```typescript
private validateRequest(request: CreateEmployeeRequest): void {
  const errors: Array<{ field: string; message: string }> = []
  if (!request.firstName?.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' })
  }
  // ... more validations
  if (errors.length > 0) {
    throw ValidationException.fromFieldErrors(errors)
  }
}
```

### 5. Value Objects for Complex Validation

Email validation delegated to Email value object:
```typescript
const email = Email.create(request.email) // Validates format, length
```

### 6. Data Transfer Objects (DTOs)

Separate DTOs for different use cases:
- **Request DTOs**: Input validation and documentation
- **Response DTOs**: Control what data is exposed
- **List DTOs**: Include metadata (stats, filters)

### 7. Mapper Pattern

Centralized entity-to-DTO conversion:
```typescript
const dto = EmployeeMapper.toDetailedResponseDto(employee)
```

## Key Features

### Smart Full Name Generation

Employee/Employer/Passport/Visa use cases automatically generate full names:
```typescript
private generateFullName(
  firstName: string,
  middleName: string | undefined,
  lastName: string
): string {
  const parts = [firstName]
  if (middleName?.trim()) parts.push(middleName)
  parts.push(lastName)
  return parts.join(' ').trim()
}
```

### Employer Type-Aware Logic

CreateEmployerUseCase validates based on employer type:
```typescript
if (request.employerType === 'COMPANY') {
  if (!request.companyName) {
    errors.push({ field: 'companyName', message: 'Required for company type' })
  }
}
if (request.employerType === 'INDIVIDUAL') {
  if (!request.firstName || !request.lastName) {
    errors.push({ field: 'firstName/lastName', message: 'Required for individual' })
  }
}
```

### Duplicate Detection

All create use cases check for duplicates:
- **Employee**: Email uniqueness
- **Employer**: Email + Registration number uniqueness
- **Passport**: Passport number uniqueness
- **Visa**: Visa number uniqueness

### Soft Delete Support

All delete use cases support both hard and soft delete:
```typescript
async execute(id: number): Promise<void> {
  // Hard delete
  await this.employeeRepository.delete(id)
}

async softDelete(id: number): Promise<void> {
  // Soft delete
  await this.employeeRepository.update(id, { status: 'TERMINATED' })
}
```

### Statistics Aggregation

"Get All" use cases support statistics:
```typescript
async executeWithStats(filters?: EmployeeSearchFilters): Promise<{
  employees: IEmployee[]
  stats: Record<string, number>
  departments: string[]
  positions: string[]
}> {
  const [employees, stats, departments, positions] = await Promise.all([
    this.execute(filters),
    this.employeeRepository.getStatsByStatus(),
    this.employeeRepository.getDistinctDepartments(),
    this.employeeRepository.getDistinctPositions()
  ])
  return { employees, stats, departments, positions }
}
```

## Testing Strategy

### Unit Testing Use Cases

```typescript
describe('CreateEmployeeUseCase', () => {
  it('should create employee with valid data', async () => {
    const mockRepo: IEmployeeRepository = {
      create: jest.fn().mockResolvedValue({ id: 1, ...mockData }),
      findByEmail: jest.fn().mockResolvedValue(null),
      // ... other methods
    }

    const useCase = new CreateEmployeeUseCase(mockRepo)
    const result = await useCase.execute(validRequest)

    expect(result.id).toBe(1)
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: 'John Doe' })
    )
  })

  it('should throw ValidationException for duplicate email', async () => {
    const mockRepo: IEmployeeRepository = {
      findByEmail: jest.fn().mockResolvedValue({ id: 2, email: 'test@test.com' }),
      // ...
    }

    const useCase = new CreateEmployeeUseCase(mockRepo)

    await expect(useCase.execute({ email: 'test@test.com', ... }))
      .rejects.toThrow(ValidationException)
  })
})
```

### Integration Testing Mappers

```typescript
describe('EmployeeMapper', () => {
  it('should map entity to response DTO correctly', () => {
    const employee: IEmployee = createMockEmployee()
    const dto = EmployeeMapper.toResponseDto(employee)

    expect(dto.id).toBe(employee.id)
    expect(dto.fullName).toBe(employee.fullName)
    expect(typeof dto.createdAt).toBe('string') // ISO string
  })
})
```

## Error Handling

All use cases throw appropriate exceptions:

**ValidationException** (400):
```typescript
throw ValidationException.fromFieldError('email', 'Email is required')
throw ValidationException.fromFieldErrors([...])
```

**NotFoundException** (404):
```typescript
throw new NotFoundException('Employee', id)
```

**Generic Error** (500):
```typescript
throw new Error('Invalid employee ID')
```

## Benefits Achieved

### 1. Reusability
Use cases can be called from:
- API controllers
- CLI commands
- Background jobs
- GraphQL resolvers

### 2. Testability
- Easy to mock repositories
- Pure business logic
- No framework dependencies

### 3. Maintainability
- Business logic centralized
- One place to update validation rules
- Clear separation of concerns

### 4. Type Safety
- Full TypeScript support
- DTOs provide API contracts
- Compile-time validation

### 5. Documentation
- Use case names document intent
- DTOs document API shape
- Clear request/response contracts

## Next Steps (Phase 4)

Now ready to:

1. **Update Controllers** to use all use cases
2. **Migrate API Routes** to use controllers
3. **Add Middleware**:
   - Authentication
   - Validation
   - Error handling
   - Logging
4. **Complete Controller Suite**:
   - EmployerController
   - PassportController
   - VisaController

## How to Use

### Example: Creating an Employee

```typescript
import { RepositoryFactory } from '@infrastructure/database/repositories/RepositoryFactory'
import { CreateEmployeeUseCase, CreateEmployeeRequest } from '@application/useCases/employee'
import { EmployeeMapper } from '@application/mappers'

// In your controller or API route
const repository = RepositoryFactory.getEmployeeRepository()
const useCase = new CreateEmployeeUseCase(repository)

const request: CreateEmployeeRequest = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  status: 'ACTIVE'
}

try {
  const employee = await useCase.execute(request)
  const dto = EmployeeMapper.toDetailedResponseDto(employee)
  return NextResponse.json(dto, { status: 201 })
} catch (error) {
  if (error instanceof ValidationException) {
    return NextResponse.json(error.toJSON(), { status: 400 })
  }
  // ... handle other errors
}
```

### Example: Getting Employees with Stats

```typescript
import { GetAllEmployeesUseCase } from '@application/useCases/employee'
import { EmployeeMapper } from '@application/mappers'

const repository = RepositoryFactory.getEmployeeRepository()
const useCase = new GetAllEmployeesUseCase(repository)

const filters = {
  search: 'John',
  department: 'Engineering',
  status: 'ACTIVE'
}

const result = await useCase.executeWithStats(filters)
const dto = EmployeeMapper.toListResponseDto(
  result.employees,
  result.stats,
  result.departments,
  result.positions
)

return NextResponse.json(dto)
```

## Files Structure

```
src/application/
├── useCases/
│   ├── employee/
│   │   ├── GetEmployeeByIdUseCase.ts
│   │   ├── GetAllEmployeesUseCase.ts
│   │   ├── CreateEmployeeUseCase.ts
│   │   ├── UpdateEmployeeUseCase.ts
│   │   ├── DeleteEmployeeUseCase.ts
│   │   └── index.ts
│   ├── employer/
│   │   ├── GetEmployerByIdUseCase.ts
│   │   ├── GetAllEmployersUseCase.ts
│   │   ├── CreateEmployerUseCase.ts
│   │   ├── UpdateEmployerUseCase.ts
│   │   ├── DeleteEmployerUseCase.ts
│   │   └── index.ts
│   ├── passport/
│   │   ├── PassportUseCases.ts (all 6 use cases)
│   │   └── index.ts
│   └── visa/
│       ├── VisaUseCases.ts (all 6 use cases)
│       └── index.ts
├── dto/
│   └── responses/
│       ├── EmployeeResponseDto.ts
│       ├── EmployerResponseDto.ts
│       └── index.ts
├── mappers/
│   ├── EmployeeMapper.ts
│   ├── EmployerMapper.ts
│   └── index.ts
└── index.ts
```

## Summary

Phase 3 has successfully implemented:
- ✅ 22 Use Cases across 4 entities
- ✅ 6 Response DTO types
- ✅ 2 Complete Mapper classes
- ✅ Full CRUD operations for all entities
- ✅ Advanced features (statistics, soft delete, expiring documents)
- ✅ Comprehensive validation
- ✅ Type-safe DTOs
- ✅ Clean separation of concerns

The application layer is now complete and ready for presentation layer integration!
