## API Documentation

Complete REST API documentation for the HR Management System.

## Base URL

```
Local Development: http://localhost:3001/api
Production: https://your-app.vercel.app/api
```

## Response Format

All responses follow a consistent JSON format:

**Success Response:**
```json
{
  "data": { ... },
  "total": 10
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "validationErrors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## HTTP Status Codes

- `200 OK` - Successful GET, PATCH, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Domain business rule violation
- `500 Internal Server Error` - Server error

---

## Employees API

### Get All Employees

```http
GET /api/employees
```

**Query Parameters:**
- `search` (string, optional) - Search by name, email, phone, department, position
- `department` (string, optional) - Filter by department
- `position` (string, optional) - Filter by position
- `employmentType` (string, optional) - Filter by employment type
- `status` (string, optional) - Filter by status
- `nationality` (string, optional) - Filter by nationality
- `gender` (string, optional) - Filter by gender
- `includeStats` (boolean, optional) - Include statistics and metadata

**Example Request:**
```http
GET /api/employees?status=ACTIVE&department=Engineering&includeStats=true
```

**Example Response:**
```json
{
  "employees": [
    {
      "id": 1,
      "fullName": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "middleName": null,
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "department": "Engineering",
      "position": "Senior Developer",
      "employmentType": "Full-time",
      "status": "ACTIVE",
      "hireDate": "2020-01-01T00:00:00.000Z",
      "salary": 100000,
      "currency": "USD",
      "nationality": "USA",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "ACTIVE": 45,
    "TERMINATED": 10,
    "ON_LEAVE": 5
  },
  "departments": ["Engineering", "Sales", "HR"],
  "positions": ["Developer", "Manager", "Director"],
  "total": 1
}
```

### Get Employee by ID

```http
GET /api/employees/:id
```

**Path Parameters:**
- `id` (number, required) - Employee ID

**Example Request:**
```http
GET /api/employees/1
```

**Example Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "middleName": "Michael",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "gender": "Male",
  "maritalStatus": "Single",
  "nationality": "USA",
  "department": "Engineering",
  "position": "Senior Developer",
  "employmentType": "Full-time",
  "status": "ACTIVE",
  "hireDate": "2020-01-01T00:00:00.000Z",
  "terminationDate": null,
  "salary": 100000,
  "currency": "USD",
  "bankName": "Test Bank",
  "accountNumber": "1234567890",
  "taxId": "TAX123",
  "socialSecurityNumber": "SSN123",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+0987654321",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "notes": "Test notes",
  "createdAt": "2020-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Create Employee

```http
POST /api/employees
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "middleName": "Michael",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "nationality": "USA",
  "gender": "Male",
  "maritalStatus": "Single",
  "department": "Engineering",
  "position": "Senior Developer",
  "employmentType": "Full-time",
  "hireDate": "2020-01-01",
  "salary": 100000,
  "currency": "USD",
  "status": "ACTIVE"
}
```

**Required Fields:**
- `firstName` - Employee first name
- `lastName` - Employee last name
- `email` - Valid email address
- `status` - Employee status (ACTIVE, TERMINATED, ON_LEAVE)

**Example Response:**
```json
{
  "id": 1,
  "fullName": "John Michael Doe",
  "firstName": "John",
  ...
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status:** `201 Created`

### Update Employee

```http
PATCH /api/employees/:id
```

**Path Parameters:**
- `id` (number, required) - Employee ID

**Request Body:** (all fields optional)
```json
{
  "firstName": "Jane",
  "department": "Sales",
  "salary": 110000,
  "status": "ACTIVE"
}
```

**Example Response:**
```json
{
  "id": 1,
  "fullName": "Jane Doe",
  ...
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### Delete Employee

```http
DELETE /api/employees/:id?soft=true
```

**Path Parameters:**
- `id` (number, required) - Employee ID

**Query Parameters:**
- `soft` (boolean, optional) - If true, soft delete (sets status to TERMINATED)

**Example Response:**
```json
{
  "message": "Employee deleted successfully"
}
```

---

## Employers API

### Get All Employers

```http
GET /api/employers
```

**Query Parameters:**
- `search` (string, optional) - Search by company name, name, industry
- `industry` (string, optional) - Filter by industry
- `relationshipType` (string, optional) - Filter by relationship type
- `status` (string, optional) - Filter by status
- `employerType` (string, optional) - Filter by type (COMPANY, INDIVIDUAL)
- `includeContacts` (boolean, optional) - Include associated contacts
- `includeStats` (boolean, optional) - Include statistics

**Example Request:**
```http
GET /api/employers?employerType=COMPANY&industry=Technology&includeStats=true
```

**Example Response:**
```json
{
  "employers": [
    {
      "id": 1,
      "employerType": "COMPANY",
      "fullName": "Tech Corp",
      "companyName": "Tech Corp",
      "tradingName": "TechCo",
      "email": "info@techcorp.com",
      "phoneNumber": "+1234567890",
      "industry": "Technology",
      "relationshipType": "CLIENT",
      "status": "ACTIVE",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "ACTIVE": 30,
    "INACTIVE": 10
  },
  "industries": ["Technology", "Finance", "Healthcare"],
  "relationshipTypes": ["CLIENT", "VENDOR", "PARTNER"],
  "total": 1
}
```

### Create Employer

```http
POST /api/employers
```

**Request Body (Company):**
```json
{
  "employerType": "COMPANY",
  "companyName": "Tech Corp",
  "tradingName": "TechCo",
  "registrationNumber": "REG123456",
  "taxId": "TAX789",
  "incorporationDate": "2010-01-01",
  "industry": "Technology",
  "email": "info@techcorp.com",
  "phoneNumber": "+1234567890",
  "relationshipType": "CLIENT",
  "status": "ACTIVE"
}
```

**Request Body (Individual):**
```json
{
  "employerType": "INDIVIDUAL",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "profession": "Consultant",
  "status": "ACTIVE"
}
```

**Required Fields:**
- `employerType` - COMPANY or INDIVIDUAL
- `companyName` (if COMPANY)
- `firstName` and `lastName` (if INDIVIDUAL)
- `status`

**Status:** `201 Created`

---

## Passports API

### Get All Passports

```http
GET /api/passports
```

**Query Parameters:**
- `search` (string) - Search by passport number, name, country
- `issuingCountry` (string) - Filter by issuing country
- `nationality` (string) - Filter by nationality
- `personType` (string) - Filter by person type (EMPLOYEE, EMPLOYER, etc.)
- `status` (string) - Filter by status
- `expiringWithinDays` (number) - Filter passports expiring within N days
- `includeStats` (boolean) - Include statistics

**Example Request:**
```http
GET /api/passports?expiringWithinDays=90&status=ACTIVE
```

### Get Expiring Passports

```http
GET /api/passports/expiring?days=90
```

Returns all passports expiring within the specified number of days (default: 90).

### Create Passport

```http
POST /api/passports
```

**Request Body:**
```json
{
  "passportNumber": "P123456789",
  "issuingCountry": "USA",
  "nationality": "USA",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "issueDate": "2020-01-01",
  "expiryDate": "2030-01-01",
  "issuingAuthority": "US Passport Agency",
  "personType": "EMPLOYEE",
  "personId": 1,
  "status": "ACTIVE"
}
```

**Required Fields:**
- `passportNumber`, `issuingCountry`, `nationality`
- `firstName`, `lastName`, `dateOfBirth`
- `issueDate`, `expiryDate`
- `personType`, `status`

**Business Rules:**
- Passport number must be unique
- Expiry date must be after issue date

**Status:** `201 Created`

---

## Visas API

### Get All Visas

```http
GET /api/visas
```

**Query Parameters:**
- `search` (string) - Search by visa number, name
- `visaType` (string) - Filter by visa type
- `issuingCountry` (string) - Filter by issuing country
- `destinationCountry` (string) - Filter by destination country
- `personType` (string) - Filter by person type
- `status` (string) - Filter by status
- `expiringWithinDays` (number) - Filter visas expiring within N days
- `includeStats` (boolean) - Include statistics

### Get Expiring Visas

```http
GET /api/visas/expiring?days=90
```

Returns all visas expiring within the specified number of days.

### Create Visa

```http
POST /api/visas
```

**Request Body:**
```json
{
  "visaNumber": "V123456789",
  "visaType": "Work Visa",
  "visaCategory": "H-1B",
  "issuingCountry": "USA",
  "destinationCountry": "USA",
  "firstName": "John",
  "lastName": "Doe",
  "passportNumber": "P123456789",
  "dateOfBirth": "1990-01-01",
  "nationality": "India",
  "issueDate": "2024-01-01",
  "expiryDate": "2027-01-01",
  "entryType": "Multiple",
  "numberOfEntries": 999,
  "durationOfStay": 1095,
  "personType": "EMPLOYEE",
  "personId": 1,
  "purposeOfVisit": "Employment",
  "status": "ACTIVE"
}
```

**Required Fields:**
- `visaNumber`, `visaType`
- `issuingCountry`, `destinationCountry`
- `firstName`, `lastName`, `dateOfBirth`, `nationality`
- `issueDate`, `expiryDate`
- `personType`, `status`

**Business Rules:**
- Visa number must be unique
- Expiry date must be after issue date

---

## Error Codes

| Code | Description | Status |
|------|-------------|--------|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `NOT_FOUND` | Resource not found | 404 |
| `DOMAIN_ERROR` | Business rule violation | 422 |
| `INTERNAL_ERROR` | Server error | 500 |

## Validation Errors

When validation fails, the response includes detailed field-level errors:

```json
{
  "error": "Validation failed for fields: email, firstName",
  "code": "VALIDATION_ERROR",
  "validationErrors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "firstName",
      "message": "First name is required"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## Authentication

Currently the API is open. For production, implement:
- JWT-based authentication
- Role-based access control (RBAC)
- API key authentication for service-to-service calls

## Pagination

For large datasets, implement pagination:

```http
GET /api/employees?page=1&limit=20
```

Response:
```json
{
  "employees": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

## Filtering Best Practices

1. **Multiple Filters**: Combine filters with `&`
   ```
   /api/employees?department=Engineering&status=ACTIVE
   ```

2. **Search**: Use `search` for fuzzy matching across multiple fields
   ```
   /api/employees?search=John
   ```

3. **Exact Match**: Use specific filters for exact matching
   ```
   /api/employees?email=john@example.com
   ```

## Examples

### JavaScript/TypeScript

```typescript
// Fetch all active employees
const response = await fetch('http://localhost:3001/api/employees?status=ACTIVE')
const data = await response.json()

// Create employee
const response = await fetch('http://localhost:3001/api/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    status: 'ACTIVE'
  })
})

const employee = await response.json()
```

### cURL

```bash
# Get all employees
curl http://localhost:3001/api/employees

# Create employee
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","status":"ACTIVE"}'

# Update employee
curl -X PATCH http://localhost:3001/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"department":"Sales"}'

# Delete employee (soft)
curl -X DELETE "http://localhost:3001/api/employees/1?soft=true"
```

## Postman Collection

Import the API into Postman for testing:

1. Create new collection: "HR Management API"
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:3001/api`
3. Import endpoints from this documentation

## Support

For API issues or questions:
- GitHub Issues: https://github.com/your-repo/issues
- Documentation: [ARCHITECTURE.md](ARCHITECTURE.md)
- Migration Guide: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
