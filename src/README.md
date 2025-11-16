# Source Code Structure

This directory contains the application source code organized using Clean Architecture principles.

## Directory Structure

```
src/
├── core/                    # Core Domain Layer
│   ├── entities/           # Base entities and aggregate roots
│   ├── valueObjects/       # Immutable value objects (Email, PhoneNumber, Address)
│   ├── exceptions/         # Domain-specific exceptions
│   └── interfaces/         # Repository and service interfaces
│
├── application/            # Application Layer
│   ├── useCases/          # Business use cases
│   │   ├── employee/      # Employee-related use cases
│   │   ├── employer/      # Employer-related use cases
│   │   └── auth/          # Authentication use cases
│   ├── dto/               # Data Transfer Objects
│   │   ├── requests/      # Input DTOs
│   │   └── responses/     # Output DTOs
│   ├── mappers/           # Entity ↔ DTO mappers
│   └── validators/        # Input validation logic
│
├── infrastructure/         # Infrastructure Layer
│   ├── database/          # Database-related implementations
│   │   ├── prisma/        # Prisma client configuration
│   │   └── repositories/  # Repository implementations
│   ├── services/          # External service integrations
│   └── config/            # Configuration management
│
├── presentation/          # Presentation Layer
│   ├── api/              # REST API
│   │   ├── controllers/  # Request handlers
│   │   └── middleware/   # Auth, validation, error handling
│   └── components/       # React UI components (existing)
│
├── shared/               # Shared Utilities
│   ├── utils/           # Common utility functions
│   ├── constants/       # Application constants
│   └── types/           # Shared TypeScript types
│
└── app/                 # Next.js App Router (existing)
    └── api/            # API route handlers
```

## Import Aliases

Use TypeScript path aliases for clean imports:

```typescript
// Core layer
import { Email, PhoneNumber, Address } from '@core/valueObjects'
import { ValidationException, NotFoundException } from '@core/exceptions'
import { IEmployeeRepository } from '@core/interfaces/repositories'

// Application layer
import { CreateEmployeeUseCase } from '@application/useCases/employee'
import { CreateEmployeeRequest } from '@application/useCases/employee'

// Infrastructure layer
import { RepositoryFactory } from '@infrastructure/database/repositories/RepositoryFactory'
import { prisma } from '@infrastructure/database/prisma/client'

// Presentation layer
import { EmployeeController } from '@presentation/api/controllers'

// Shared utilities
import { formatDate } from '@shared/utils'
```

## Layer Dependencies

**Dependency Rule**: Dependencies only point inward.

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI/API)         │
│  - Controllers, Routes, Components          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│       Application Layer (Use Cases)         │
│  - Business workflows, DTOs, Mappers        │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│       Infrastructure Layer (External)       │
│  - Database, Services, Config               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         Core Layer (Business Logic)         │
│  - Entities, Value Objects, Interfaces      │
│  - NO external dependencies                 │
└─────────────────────────────────────────────┘
```

## Key Components

### Core Layer

**Entities** ([BaseEntity.ts](core/entities/BaseEntity.ts), [AggregateRoot.ts](core/entities/AggregateRoot.ts))
- Base classes for domain entities
- Encapsulate business logic
- Framework-agnostic

**Value Objects** ([Email.ts](core/valueObjects/Email.ts), [PhoneNumber.ts](core/valueObjects/PhoneNumber.ts), [Address.ts](core/valueObjects/Address.ts))
- Immutable objects representing domain concepts
- Self-validating
- No identity, compared by value

**Exceptions** ([DomainException.ts](core/exceptions/DomainException.ts), [ValidationException.ts](core/exceptions/ValidationException.ts), [NotFoundException.ts](core/exceptions/NotFoundException.ts))
- Domain-specific error handling
- Structured error information
- JSON serializable

**Interfaces** ([IEmployeeRepository.ts](core/interfaces/repositories/IEmployeeRepository.ts), etc.)
- Contracts for repositories
- Define data access operations
- Enable dependency inversion

### Infrastructure Layer

**Repositories** ([PrismaEmployeeRepository.ts](../infrastructure/database/repositories/PrismaEmployeeRepository.ts), etc.)
- Implement repository interfaces
- Handle database operations via Prisma
- Provide data persistence

**Repository Factory** ([RepositoryFactory.ts](../infrastructure/database/repositories/RepositoryFactory.ts))
- Singleton pattern for repositories
- Dependency injection
- Easy to mock for testing

### Application Layer

**Use Cases** ([GetEmployeeByIdUseCase.ts](application/useCases/employee/GetEmployeeByIdUseCase.ts), [CreateEmployeeUseCase.ts](application/useCases/employee/CreateEmployeeUseCase.ts))
- Application business rules
- Orchestrate domain objects
- Single responsibility per use case

### Presentation Layer

**Controllers** ([EmployeeController.ts](presentation/api/controllers/EmployeeController.ts))
- Handle HTTP requests/responses
- Delegate to use cases
- Centralized error handling

## Example Usage Flow

1. **HTTP Request** arrives at API route
   ```typescript
   // app/api/employees/route.ts
   export async function POST(request: NextRequest) {
     return await EmployeeController.create(request)
   }
   ```

2. **Controller** extracts data and calls use case
   ```typescript
   // presentation/api/controllers/EmployeeController.ts
   static async create(request: NextRequest): Promise<NextResponse> {
     const body = await request.json()
     const repository = RepositoryFactory.getEmployeeRepository()
     const useCase = new CreateEmployeeUseCase(repository)
     const employee = await useCase.execute(body)
     return NextResponse.json(employee, { status: 201 })
   }
   ```

3. **Use Case** validates and executes business logic
   ```typescript
   // application/useCases/employee/CreateEmployeeUseCase.ts
   async execute(request: CreateEmployeeRequest): Promise<IEmployee> {
     const email = Email.create(request.email) // Value object validation
     // ... business logic
     return await this.employeeRepository.create(employee)
   }
   ```

4. **Repository** persists data
   ```typescript
   // infrastructure/database/repositories/PrismaEmployeeRepository.ts
   async create(entity: IEmployee): Promise<IEmployee> {
     return await prisma.employee.create({ data })
   }
   ```

## Best Practices

1. **Never import Prisma in use cases** - Always use repository interfaces
2. **Validate early** - Use value objects for validation at boundaries
3. **Keep use cases focused** - One use case per business operation
4. **Handle errors properly** - Use domain exceptions
5. **Test in isolation** - Mock repositories for use case tests

## Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Complete architecture overview
- [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) - How to migrate existing code

## Getting Started

To add a new feature:

1. Define repository interface in `core/interfaces/repositories/`
2. Implement repository in `infrastructure/database/repositories/`
3. Create use case in `application/useCases/`
4. Add controller method in `presentation/api/controllers/`
5. Update API route in `app/api/`

See [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) for detailed examples.
