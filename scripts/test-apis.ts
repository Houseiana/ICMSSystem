/**
 * Comprehensive API Test Script
 * Tests all CRUD operations for Employee, Employer, Passport, and Visa endpoints
 */

const BASE_URL = 'http://localhost:3001/api'

interface TestResult {
  endpoint: string
  method: string
  status: 'PASS' | 'FAIL'
  statusCode?: number
  error?: string
  data?: any
}

const results: TestResult[] = []

// Helper function to make API calls
async function apiCall(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<TestResult> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()

    return {
      endpoint,
      method,
      status: response.ok ? 'PASS' : 'FAIL',
      statusCode: response.status,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : JSON.stringify(data)
    }
  } catch (error) {
    return {
      endpoint,
      method,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test Employee APIs
async function testEmployeeAPIs() {
  console.log('\n=== Testing Employee APIs ===\n')

  // Test data
  const employeeData = {
    empId: `EMP${Date.now()}`,
    firstName: 'Test',
    lastName: 'Employee',
    email: `test.employee.${Date.now()}@example.com`,
    phone: '+1234567890',
    status: 'ACTIVE',
    department: 'Engineering',
    position: 'Developer',
    employmentType: 'Full-time'
  }

  // Create Employee
  const createResult = await apiCall('/employees', 'POST', employeeData)
  results.push(createResult)
  console.log(`✓ POST /employees: ${createResult.status} (${createResult.statusCode})`)

  if (createResult.status === 'PASS' && createResult.data) {
    const employeeId = createResult.data.id

    // Get Employee by ID
    const getResult = await apiCall(`/employees/${employeeId}`, 'GET')
    results.push(getResult)
    console.log(`✓ GET /employees/${employeeId}: ${getResult.status} (${getResult.statusCode})`)

    // Update Employee
    const updateResult = await apiCall(`/employees/${employeeId}`, 'PATCH', {
      department: 'Sales'
    })
    results.push(updateResult)
    console.log(`✓ PATCH /employees/${employeeId}: ${updateResult.status} (${updateResult.statusCode})`)

    // Get All Employees
    const getAllResult = await apiCall('/employees?includeStats=true', 'GET')
    results.push(getAllResult)
    console.log(`✓ GET /employees: ${getAllResult.status} (${getAllResult.statusCode})`)

    // Delete Employee (soft)
    const deleteResult = await apiCall(`/employees/${employeeId}?soft=true`, 'DELETE')
    results.push(deleteResult)
    console.log(`✓ DELETE /employees/${employeeId}: ${deleteResult.status} (${deleteResult.statusCode})`)
  } else {
    console.error('Failed to create employee:', createResult.error)
  }
}

// Test Employer APIs
async function testEmployerAPIs() {
  console.log('\n=== Testing Employer APIs ===\n')

  const employerData = {
    employerType: 'COMPANY',
    companyName: `Test Company ${Date.now()}`,
    tradingName: 'TestCo',
    registrationNumber: `REG${Date.now()}`,
    email: `company.${Date.now()}@example.com`,
    phone: '+0987654321',
    industry: 'Technology',
    status: 'ACTIVE',
    relationshipType: 'CLIENT'
  }

  const createResult = await apiCall('/employers', 'POST', employerData)
  results.push(createResult)
  console.log(`✓ POST /employers: ${createResult.status} (${createResult.statusCode})`)

  if (createResult.status === 'PASS' && createResult.data) {
    const employerId = createResult.data.id

    const getResult = await apiCall(`/employers/${employerId}`, 'GET')
    results.push(getResult)
    console.log(`✓ GET /employers/${employerId}: ${getResult.status} (${getResult.statusCode})`)

    const updateResult = await apiCall(`/employers/${employerId}`, 'PATCH', {
      industry: 'Finance'
    })
    results.push(updateResult)
    console.log(`✓ PATCH /employers/${employerId}: ${updateResult.status} (${updateResult.statusCode})`)

    const getAllResult = await apiCall('/employers?includeStats=true', 'GET')
    results.push(getAllResult)
    console.log(`✓ GET /employers: ${getAllResult.status} (${getAllResult.statusCode})`)
  }
}

// Test Passport APIs
async function testPassportAPIs() {
  console.log('\n=== Testing Passport APIs ===\n')

  const passportData = {
    passportNumber: `P${Date.now()}`,
    issuingCountry: 'USA',
    nationality: 'USA',
    firstName: 'Test',
    lastName: 'Passport',
    dateOfBirth: '1990-01-01T00:00:00.000Z',
    gender: 'Male',
    issueDate: '2020-01-01T00:00:00.000Z',
    expiryDate: '2030-01-01T00:00:00.000Z',
    personType: 'EMPLOYEE',
    status: 'ACTIVE'
  }

  const createResult = await apiCall('/passports', 'POST', passportData)
  results.push(createResult)
  console.log(`✓ POST /passports: ${createResult.status} (${createResult.statusCode})`)

  if (createResult.status === 'PASS' && createResult.data) {
    const passportId = createResult.data.id

    const getResult = await apiCall(`/passports/${passportId}`, 'GET')
    results.push(getResult)
    console.log(`✓ GET /passports/${passportId}: ${getResult.status} (${getResult.statusCode})`)

    const getAllResult = await apiCall('/passports?includeStats=true', 'GET')
    results.push(getAllResult)
    console.log(`✓ GET /passports: ${getAllResult.status} (${getAllResult.statusCode})`)

    const expiringResult = await apiCall('/passports/expiring?days=365', 'GET')
    results.push(expiringResult)
    console.log(`✓ GET /passports/expiring: ${expiringResult.status} (${expiringResult.statusCode})`)
  }
}

// Test Visa APIs
async function testVisaAPIs() {
  console.log('\n=== Testing Visa APIs ===\n')

  const visaData = {
    visaNumber: `V${Date.now()}`,
    visaType: 'Work Visa',
    issuingCountry: 'USA',
    destinationCountry: 'USA',
    firstName: 'Test',
    lastName: 'Visa',
    dateOfBirth: '1990-01-01T00:00:00.000Z',
    nationality: 'India',
    issueDate: '2024-01-01T00:00:00.000Z',
    expiryDate: '2027-01-01T00:00:00.000Z',
    personType: 'EMPLOYEE',
    status: 'ACTIVE'
  }

  const createResult = await apiCall('/visas', 'POST', visaData)
  results.push(createResult)
  console.log(`✓ POST /visas: ${createResult.status} (${createResult.statusCode})`)

  if (createResult.status === 'PASS' && createResult.data) {
    const visaId = createResult.data.id

    const getResult = await apiCall(`/visas/${visaId}`, 'GET')
    results.push(getResult)
    console.log(`✓ GET /visas/${visaId}: ${getResult.status} (${getResult.statusCode})`)

    const getAllResult = await apiCall('/visas?includeStats=true', 'GET')
    results.push(getAllResult)
    console.log(`✓ GET /visas: ${getAllResult.status} (${getAllResult.statusCode})`)

    const expiringResult = await apiCall('/visas/expiring?days=365', 'GET')
    results.push(expiringResult)
    console.log(`✓ GET /visas/expiring: ${expiringResult.status} (${expiringResult.statusCode})`)
  }
}

// Test validation errors
async function testValidationErrors() {
  console.log('\n=== Testing Validation Errors ===\n')

  // Missing required fields
  const invalidEmployee = {
    firstName: 'Test'
    // Missing lastName, email, empId
  }

  const result = await apiCall('/employees', 'POST', invalidEmployee)
  results.push(result)
  console.log(`✓ Validation Error Test: ${result.status === 'FAIL' ? 'PASS' : 'FAIL'} (${result.statusCode})`)
}

// Run all tests
async function runAllTests() {
  console.log('Starting API Tests...')
  console.log('Base URL:', BASE_URL)
  console.log('Make sure the dev server is running on port 3001!')

  await testEmployeeAPIs()
  await testEmployerAPIs()
  await testPassportAPIs()
  await testVisaAPIs()
  await testValidationErrors()

  // Summary
  console.log('\n=== Test Summary ===\n')
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length

  console.log(`Total Tests: ${results.length}`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(2)}%`)

  if (failed > 0) {
    console.log('\n=== Failed Tests ===\n')
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`❌ ${r.method} ${r.endpoint}`)
        console.log(`   Error: ${r.error}`)
      })
  }

  process.exit(failed > 0 ? 1 : 0)
}

runAllTests().catch(console.error)
