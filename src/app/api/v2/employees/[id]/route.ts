/**
 * Employee API Routes by ID (Version 2 - Clean Architecture)
 */

import { NextRequest } from 'next/server'
import { EmployeeController } from '@presentation/api/controllers'

/**
 * GET /api/v2/employees/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  return await EmployeeController.getById(request, id)
}

/**
 * PATCH /api/v2/employees/:id
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  return await EmployeeController.update(request, id)
}

/**
 * DELETE /api/v2/employees/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  return await EmployeeController.delete(request, id)
}
