# Clean Architecture Implementation

This document describes the Clean Architecture implementation for the HR Management System.

## Architecture Overview

The project follows Clean Architecture principles with clear separation of concerns across multiple layers:

```
src/
├── core/                    # Core Domain Layer (Business Logic)
├── application/             # Application Layer (Use Cases)
├── infrastructure/          # Infrastructure Layer (External Services)
├── presentation/            # Presentation Layer (API/UI)
└── shared/                  # Shared Utilities
```

## Layers Description

### 1. Core Layer (`src/core/`)

The innermost layer containing business logic and domain models. This layer has NO dependencies on external layers.

**Components:**

- **Entities** (`entities/`): Domain entities and aggregate roots
  - `BaseEntity.ts`: Base class for all entities
  - `AggregateRoot.ts`: Base class for aggregate roots with domain events

- **Value Objects** (`valueObjects/`): Immutable objects representing domain concepts
  - `Email.ts`: Email validation and representation
  - `PhoneNumber.ts`: Phone number validation and formatting
  - `Address.ts`: Address validation and representation

- **Exceptions** (`exceptions/`): Domain-specific exceptions
  - `DomainException.ts`: Base exception class
  - `ValidationException.ts`: Validation error handling
  - `NotFoundException.ts`: Entity not found errors

- **Interfaces** (`interfaces/`): Contracts for repositories and services
  - `repositories/`: Repository interfaces for data access
    - `IBaseRepository.ts`: Base repository interface
    - `IEmployeeRepository.ts`: Employee-specific operations
    - `IEmployerRepository.ts`: Employer-specific operations
    - `IPassportRepository.ts`: Passport-specific operations
    - `IVisaRepository.ts`: Visa-specific operations

**Key Principles:**
- Zero dependencies on outer layers
- Pure business logic only
- Framework-agnostic
- Highly testable

### 2. Application Layer (`src/application/`)

Contains application-specific business rules and use cases.

**Planned Components:**

- **Use Cases** (`useCases/`): Application business rules
  - Employee management use cases
  - Employer management use cases
  - Authentication use cases

- **DTOs** (`dto/`): Data transfer objects
  - `requests/`: Input DTOs
  - `responses/`: Output DTOs

- **Mappers** (`mappers/`): Convert between domain models and DTOs

- **Validators** (`validators/`): Input validation logic

**Dependencies:** Core layer only

### 3. Infrastructure Layer (`src/infrastructure/`)

Implements interfaces defined in the core layer using external frameworks and libraries.

**Planned Components:**

- **Database** (`database/`): Data persistence
  - `prisma/`: Prisma client configuration
  - `repositories/`: Repository implementations
    - `PrismaEmployeeRepository.ts`
    - `PrismaEmployerRepository.ts`
    - etc.

- **Services** (`services/`): External service integrations
  - Email service
  - File storage service
  - etc.

- **Config** (`config/`): Configuration management

**Dependencies:** Core, Application

### 4. Presentation Layer (`src/presentation/`)

Handles user interface and API endpoints.

**Planned Components:**

- **API** (`api/`): REST API endpoints
  - `controllers/`: Request handlers
  - `middleware/`: Authentication, validation, error handling

- **Components** (existing): React components for UI

**Dependencies:** Application, Core (for types)

### 5. Shared Layer (`src/shared/`)

Contains utilities and helpers used across layers.

**Planned Components:**

- **Utils** (`utils/`): Common utility functions
- **Constants** (`constants/`): Application constants
- **Types** (`types/`): Shared TypeScript types

## Dependency Rule

The fundamental rule: dependencies point inward only.

```
Presentation → Application → Core
Infrastructure → Application → Core
Shared → (can be used by any layer)
```

**Never:**
- Core depends on Application
- Core depends on Infrastructure
- Core depends on Presentation
- Application depends on Infrastructure or Presentation

## Data Flow

### Inbound (Request)

1. **Presentation Layer** receives HTTP request
2. **Controller** validates input and creates DTO
3. **Use Case** is invoked with DTO
4. **Use Case** calls domain entities/value objects
5. **Use Case** calls repository interface
6. **Repository Implementation** (Infrastructure) performs database operations
7. **Mapper** converts entity to response DTO
8. **Controller** returns HTTP response

### Outbound (Domain Event)

1. **Entity** raises domain event
2. **Use Case** publishes event
3. **Event Handler** (Infrastructure) processes event
4. External services are called if needed

## TypeScript Path Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["./src/core/*"],
      "@application/*": ["./src/application/*"],
      "@infrastructure/*": ["./src/infrastructure/*"],
      "@presentation/*": ["./src/presentation/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

## Example Usage

### Creating an Entity with Value Objects

```typescript
import { Email, PhoneNumber, Address } from '@core/valueObjects'
import { ValidationException } from '@core/exceptions'

const email = Email.create('user@example.com')
const phone = PhoneNumber.create('1234567890', '+1')
const address = Address.create({
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'USA'
})
```

### Implementing a Repository

```typescript
import { IEmployeeRepository, IEmployee } from '@core/interfaces/repositories'
import { prisma } from '@infrastructure/database/prisma'

export class PrismaEmployeeRepository implements IEmployeeRepository {
  async findById(id: number): Promise<IEmployee | null> {
    return await prisma.employee.findUnique({ where: { id } })
  }

  // ... implement other methods
}
```

### Creating a Use Case

```typescript
import { IEmployeeRepository } from '@core/interfaces/repositories'
import { Email } from '@core/valueObjects'
import { NotFoundException } from '@core/exceptions'

export class GetEmployeeByEmailUseCase {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async execute(emailString: string): Promise<IEmployee> {
    const email = Email.create(emailString)
    const employee = await this.employeeRepository.findByEmail(email.value)

    if (!employee) {
      throw new NotFoundException('Employee', email.value)
    }

    return employee
  }
}
```

## Benefits

1. **Testability**: Core business logic is easy to test without external dependencies
2. **Maintainability**: Clear separation of concerns makes code easier to understand
3. **Flexibility**: Easy to swap implementations (e.g., database, external services)
4. **Scalability**: Well-organized code structure supports growth
5. **Type Safety**: TypeScript interfaces ensure compile-time safety
6. **Domain Focus**: Business logic is protected from infrastructure concerns

## Migration Strategy

### Phase 1: Foundation ✅
- [x] Create folder structure
- [x] Implement core exceptions
- [x] Create value objects
- [x] Define repository interfaces
- [x] Create base entities
- [x] Update TypeScript configuration

### Phase 2: Repository Implementation ✅
- [x] Implement Prisma repositories
  - [x] PrismaEmployeeRepository
  - [x] PrismaEmployerRepository
  - [x] PrismaPassportRepository
  - [x] PrismaVisaRepository
- [x] Create repository factory
- [x] Add Prisma client singleton
- [x] Create example use cases
- [x] Create example controller
- [ ] Add unit tests for repositories

### Phase 3: Use Cases ✅
- [x] Implement complete employee use cases (5 use cases)
  - [x] GetEmployeeByIdUseCase
  - [x] GetAllEmployeesUseCase
  - [x] CreateEmployeeUseCase
  - [x] UpdateEmployeeUseCase
  - [x] DeleteEmployeeUseCase
- [x] Implement employer use cases (5 use cases)
  - [x] GetEmployerByIdUseCase
  - [x] GetAllEmployersUseCase
  - [x] CreateEmployerUseCase
  - [x] UpdateEmployerUseCase
  - [x] DeleteEmployerUseCase
- [x] Implement passport use cases (6 use cases)
- [x] Implement visa use cases (6 use cases)
- [x] Create DTOs (Employee, Employer Response DTOs)
- [x] Create mappers (EmployeeMapper, EmployerMapper)
- [ ] Implement auth use cases (future)

### Phase 4: Presentation Layer ✅
- [x] Create all controllers (Employee, Employer, Passport, Visa)
- [x] Implement error handling middleware
- [x] Implement validation middleware
- [x] Add centralized error handling
- [ ] Migrate existing API routes to use controllers (future)
- [ ] Add authentication middleware (future)

### Phase 5: Testing & Documentation ✅
- [x] Create ARCHITECTURE.md
- [x] Create MIGRATION_GUIDE.md
- [x] Create PHASE3_SUMMARY.md
- [x] Create CLEAN_ARCHITECTURE_COMPLETE.md
- [x] Create API_DOCUMENTATION.md
- [x] Create comprehensive test examples
- [x] Create testing guide
- [ ] Write full test suite (future)
- [ ] Performance optimization (future)

## Best Practices

1. **Immutability**: Value objects and entities should be immutable where possible
2. **Factory Methods**: Use static factory methods for object creation with validation
3. **Interface Segregation**: Keep interfaces focused and cohesive
4. **Single Responsibility**: Each class should have one reason to change
5. **Dependency Injection**: Inject dependencies through constructors
6. **Error Handling**: Use domain exceptions for business rule violations
7. **Validation**: Validate at the boundaries (value objects, use cases)

## Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
