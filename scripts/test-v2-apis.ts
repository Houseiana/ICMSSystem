/**
 * Test script for V2 APIs (Clean Architecture endpoints)
 */

const BASE_URL = 'http://localhost:3001/api/v2'

async function testV2APIs() {
  console.log('Testing V2 APIs (Clean Architecture)\n')

  // Test Employee Creation (simplified schema)
  const employeeData = {
    firstName: 'John',
    lastName: 'Doe',
    email: `john.doe.${Date.now()}@example.com`,
    status: 'ACTIVE'
  }

  console.log('1. Creating employee with minimal required fields...')
  console.log('POST /api/v2/employees')
  console.log('Data:', JSON.stringify(employeeData, null, 2))

  try {
    const createResponse = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    })

    const createResult = await createResponse.json()

    if (createResponse.ok) {
      console.log('✅ SUCCESS - Employee created')
      console.log('Response:', JSON.stringify(createResult, null, 2))

      const employeeId = createResult.id

      // Test Get by ID
      console.log(`\n2. Getting employee by ID (${employeeId})...`)
      const getResponse = await fetch(`${BASE_URL}/employees/${employeeId}`)
      const getResult = await getResponse.json()

      if (getResponse.ok) {
        console.log('✅ SUCCESS - Employee retrieved')
        console.log('Full Name:', getResult.fullName)
      } else {
        console.log('❌ FAILED -', getResult.error)
      }

      // Test Update
      console.log(`\n3. Updating employee department...`)
      const updateResponse = await fetch(`${BASE_URL}/employees/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: 'Engineering' })
      })
      const updateResult = await updateResponse.json()

      if (updateResponse.ok) {
        console.log('✅ SUCCESS - Employee updated')
        console.log('Department:', updateResult.department)
      } else {
        console.log('❌ FAILED -', updateResult.error)
      }

      // Test Get All
      console.log(`\n4. Getting all employees...`)
      const getAllResponse = await fetch(`${BASE_URL}/employees?includeStats=true`)
      const getAllResult = await getAllResponse.json()

      if (getAllResponse.ok) {
        console.log('✅ SUCCESS - Employees list retrieved')
        console.log('Total employees:', getAllResult.total)
        if (getAllResult.stats) {
          console.log('Stats:', getAllResult.stats)
        }
      } else {
        console.log('❌ FAILED -', getAllResult.error)
      }

      // Test Delete (soft)
      console.log(`\n5. Soft deleting employee...`)
      const deleteResponse = await fetch(`${BASE_URL}/employees/${employeeId}?soft=true`, {
        method: 'DELETE'
      })
      const deleteResult = await deleteResponse.json()

      if (deleteResponse.ok) {
        console.log('✅ SUCCESS - Employee soft deleted')
        console.log(deleteResult.message)
      } else {
        console.log('❌ FAILED -', deleteResult.error)
      }

    } else {
      console.log('❌ FAILED - Could not create employee')
      console.log('Status:', createResponse.status)
      console.log('Error:', JSON.stringify(createResult, null, 2))
    }

  } catch (error) {
    console.error('❌ ERROR:', error instanceof Error ? error.message : error)
  }
}

testV2APIs().catch(console.error)
