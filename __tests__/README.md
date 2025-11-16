## Testing Guide

This directory contains test examples for the Clean Architecture implementation.

### Test Structure

```
__tests__/
├── useCases/          # Use case unit tests
│   └── employee/
│       └── CreateEmployeeUseCase.test.ts
├── mappers/           # Mapper unit tests
│   └── EmployeeMapper.test.ts
└── README.md          # This file
```

### Running Tests

```bash
# Install Jest (if not already installed)
npm install --save-dev jest @types/jest ts-jest

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Configure Jest

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1'
  }
}
```

### Test Patterns

#### 1. Use Case Tests

Test use cases in isolation by mocking repositories:

```typescript
const mockRepository: jest.Mocked<IEmployeeRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  // ... other methods
}

const useCase = new CreateEmployeeUseCase(mockRepository)
```

#### 2. Mapper Tests

Test data transformation:

```typescript
const employee: IEmployee = createMockEmployee()
const dto = EmployeeMapper.toResponseDto(employee)

expect(dto.id).toBe(employee.id)
expect(typeof dto.createdAt).toBe('string')
```

#### 3. Value Object Tests

Test validation and business rules:

```typescript
// Valid email
const email = Email.create('test@example.com')
expect(email.value).toBe('test@example.com')

// Invalid email
expect(() => Email.create('invalid')).toThrow(ValidationException)
```

### Test Coverage Goals

- Use Cases: 90%+
- Value Objects: 95%+
- Mappers: 85%+
- Repositories: 70%+ (integration tests)
