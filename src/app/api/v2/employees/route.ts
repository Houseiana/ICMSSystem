/**
 * Employee API Routes (Version 2 - Clean Architecture)
 * Uses the new controller-based architecture
 */

import { NextRequest } from 'next/server'
import { EmployeeController } from '@presentation/api/controllers'

/**
 * GET /api/v2/employees
 * Get all employees with optional filtering
 */
export async function GET(request: NextRequest) {
  return await EmployeeController.getAll(request)
}

/**
 * POST /api/v2/employees
 * Create a new employee
 */
export async function POST(request: NextRequest) {
  return await EmployeeController.create(request)
}
