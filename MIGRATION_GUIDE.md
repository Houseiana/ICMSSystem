# Migration Guide: Clean Architecture Implementation

This guide explains how to migrate existing API routes to use the new Clean Architecture implementation.

## Overview

The new architecture separates concerns into distinct layers:
- **Core**: Business logic, entities, value objects, exceptions
- **Application**: Use cases, DTOs, mappers
- **Infrastructure**: Database repositories, external services
- **Presentation**: Controllers, API routes, UI components

## Before and After Examples

### Example 1: Simple GET by ID

#### Before (Old Pattern)
```typescript
// src/app/api/employees/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}
```

#### After (Clean Architecture)
```typescript
// src/app/api/employees/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { EmployeeController } from '@presentation/api/controllers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  return await EmployeeController.getById(request, id)
}
```

### Example 2: POST with Validation

#### Before (Old Pattern)
```typescript
// src/app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Manual validation
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check duplicates
    const existing = await prisma.employee.findFirst({
      where: { email: body.email }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Generate full name
    const fullName = `${body.firstName} ${body.lastName}`

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        ...body,
        fullName
      }
    })

    return NextResponse.json(employee, { status: 201 })

  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}
```

#### After (Clean Architecture)
```typescript
// src/app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { EmployeeController } from '@presentation/api/controllers'

export async function POST(request: NextRequest) {
  return await EmployeeController.create(request)
}
```

## Step-by-Step Migration Process

### Step 1: Identify the Entity

Determine which domain entity the route deals with (Employee, Employer, Passport, Visa, etc.)

### Step 2: Check if Repository Exists

Repositories already implemented:
- ✅ Employee
- ✅ Employer
- ✅ Passport
- ✅ Visa

### Step 3: Create Use Case (if needed)

If a use case doesn't exist for your operation, create one:

```typescript
// src/application/useCases/employee/UpdateEmployeeUseCase.ts
import { IEmployeeRepository, IEmployee } from '@core/interfaces/repositories'
import { NotFoundException, ValidationException } from '@core/exceptions'

export interface UpdateEmployeeRequest {
  firstName?: string
  lastName?: string
  // ... other fields
}

export class UpdateEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: number, request: UpdateEmployeeRequest): Promise<IEmployee> {
    // 1. Validate input
    if (id <= 0) {
      throw new Error('Invalid employee ID')
    }

    // 2. Check if exists
    const exists = await this.employeeRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Employee', id)
    }

    // 3. Update entity
    const updatedEmployee = await this.employeeRepository.update(id, request)

    return updatedEmployee
  }
}
```

### Step 4: Add Method to Controller (if needed)

```typescript
// src/presentation/api/controllers/EmployeeController.ts
static async update(request: NextRequest, id: number): Promise<NextResponse> {
  try {
    const body = await request.json()
    const repository = RepositoryFactory.getEmployeeRepository()
    const useCase = new UpdateEmployeeUseCase(repository)
    const employee = await useCase.execute(id, body)

    return NextResponse.json(employee, { status: 200 })
  } catch (error) {
    return this.handleError(error)
  }
}
```

### Step 5: Update API Route

Replace direct Prisma calls with controller method:

```typescript
// src/app/api/employees/[id]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  return await EmployeeController.update(request, id)
}
```

## Common Patterns

### Pattern 1: List/Search Endpoints

```typescript
// Use Case
export class GetEmployeesUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(filters: EmployeeSearchFilters): Promise<IEmployee[]> {
    return await this.employeeRepository.findByFilters(filters)
  }
}

// Controller
static async getAll(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      search: searchParams.get('search') || undefined,
      department: searchParams.get('department') || undefined,
      status: searchParams.get('status') || undefined
    }

    const repository = RepositoryFactory.getEmployeeRepository()
    const useCase = new GetEmployeesUseCase(repository)
    const employees = await useCase.execute(filters)

    return NextResponse.json(employees, { status: 200 })
  } catch (error) {
    return this.handleError(error)
  }
}

// Route
export async function GET(request: NextRequest) {
  return await EmployeeController.getAll(request)
}
```

### Pattern 2: Delete Endpoints

```typescript
// Use Case
export class DeleteEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: number): Promise<void> {
    const exists = await this.employeeRepository.exists(id)
    if (!exists) {
      throw new NotFoundException('Employee', id)
    }

    const deleted = await this.employeeRepository.delete(id)
    if (!deleted) {
      throw new Error('Failed to delete employee')
    }
  }
}

// Controller
static async delete(request: NextRequest, id: number): Promise<NextResponse> {
  try {
    const repository = RepositoryFactory.getEmployeeRepository()
    const useCase = new DeleteEmployeeUseCase(repository)
    await useCase.execute(id)

    return NextResponse.json(
      { message: 'Employee deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return this.handleError(error)
  }
}

// Route
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  return await EmployeeController.delete(request, id)
}
```

### Pattern 3: Using Value Objects

```typescript
// Use Case with Email value object
import { Email } from '@core/valueObjects'

export class UpdateEmployeeEmailUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(id: number, emailString: string): Promise<IEmployee> {
    // Validate email using value object (throws ValidationException if invalid)
    const email = Email.create(emailString)

    // Check if email is already taken by another employee
    const existingEmployee = await this.employeeRepository.findByEmail(email.value)
    if (existingEmployee && existingEmployee.id !== id) {
      throw ValidationException.fromFieldError('email', 'Email already in use')
    }

    // Update employee
    return await this.employeeRepository.update(id, {
      email: email.value
    })
  }
}
```

## Benefits of New Architecture

### 1. Testability
```typescript
// Easy to test use cases with mock repositories
describe('CreateEmployeeUseCase', () => {
  it('should create employee', async () => {
    const mockRepo: IEmployeeRepository = {
      create: jest.fn().mockResolvedValue({ id: 1, ...mockData }),
      findByEmail: jest.fn().mockResolvedValue(null),
      // ... other methods
    }

    const useCase = new CreateEmployeeUseCase(mockRepo)
    const result = await useCase.execute(mockData)

    expect(result.id).toBe(1)
    expect(mockRepo.create).toHaveBeenCalled()
  })
})
```

### 2. Reusability
Use cases can be used from multiple entry points (API, CLI, background jobs)

### 3. Maintainability
Business logic is centralized in use cases, not scattered across routes

### 4. Type Safety
Full TypeScript support with interfaces and DTOs

### 5. Validation
Consistent validation using value objects and exceptions

## Migration Checklist

For each API route:

- [ ] Identify the domain entity
- [ ] Create use case (or reuse existing)
- [ ] Add controller method (or reuse existing)
- [ ] Update route to use controller
- [ ] Remove direct Prisma calls from route
- [ ] Test the endpoint
- [ ] Update any frontend code calling the endpoint

## Common Pitfalls

### ❌ Don't: Keep business logic in routes
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.firstName) { /* validation */ }
  const fullName = `${body.firstName} ${body.lastName}` // business logic
  await prisma.employee.create({ data: { ...body, fullName }})
}
```

### ✅ Do: Move logic to use cases
```typescript
export async function POST(request: NextRequest) {
  return await EmployeeController.create(request)
}
```

### ❌ Don't: Import Prisma in use cases
```typescript
import { prisma } from '@/lib/prisma' // ❌ Wrong

export class CreateEmployeeUseCase {
  async execute() {
    await prisma.employee.create() // ❌ Direct DB access
  }
}
```

### ✅ Do: Use repository interfaces
```typescript
import { IEmployeeRepository } from '@core/interfaces/repositories' // ✅ Correct

export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute() {
    await this.employeeRepository.create() // ✅ Through interface
  }
}
```

## Next Steps

1. Start migrating simple GET endpoints
2. Move to POST/PUT/DELETE endpoints
3. Refactor complex business logic into use cases
4. Add comprehensive error handling
5. Write unit tests for use cases
6. Write integration tests for controllers

## Need Help?

Check the existing implementations:
- [GetEmployeeByIdUseCase.ts](src/application/useCases/employee/GetEmployeeByIdUseCase.ts)
- [CreateEmployeeUseCase.ts](src/application/useCases/employee/CreateEmployeeUseCase.ts)
- [EmployeeController.ts](src/presentation/api/controllers/EmployeeController.ts)
