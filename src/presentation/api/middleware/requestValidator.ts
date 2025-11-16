import { NextRequest } from 'next/server'
import { ValidationException } from '@core/exceptions'

/**
 * Request Validator Middleware
 * Provides common validation utilities for HTTP requests
 */
export class RequestValidator {
  /**
   * Validates that a request has a JSON body
   * @param request - The Next.js request object
   * @throws ValidationException if body is invalid
   */
  static async validateJsonBody(request: NextRequest): Promise<any> {
    try {
      const body = await request.json()

      if (!body || typeof body !== 'object') {
        throw ValidationException.fromFieldError('body', 'Request body must be a valid JSON object')
      }

      return body
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      throw ValidationException.fromFieldError('body', 'Invalid JSON in request body')
    }
  }

  /**
   * Validates and parses an ID parameter
   * @param id - The ID parameter (string or number)
   * @throws ValidationException if ID is invalid
   */
  static validateId(id: string | number): number {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id

    if (isNaN(numericId) || numericId <= 0) {
      throw ValidationException.fromFieldError('id', 'ID must be a positive integer')
    }

    return numericId
  }

  /**
   * Validates required fields in an object
   * @param data - The object to validate
   * @param requiredFields - Array of required field names
   * @throws ValidationException if any required fields are missing
   */
  static validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
    const errors: Array<{ field: string; message: string }> = []

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push({
          field,
          message: `${field} is required`
        })
      }
    }

    if (errors.length > 0) {
      throw ValidationException.fromFieldErrors(errors)
    }
  }

  /**
   * Validates that a value is a valid date
   * @param value - The value to validate
   * @param fieldName - The field name for error messages
   * @throws ValidationException if date is invalid
   */
  static validateDate(value: any, fieldName: string): Date {
    const date = new Date(value)

    if (isNaN(date.getTime())) {
      throw ValidationException.fromFieldError(fieldName, `${fieldName} must be a valid date`)
    }

    return date
  }

  /**
   * Validates that a value is a valid number
   * @param value - The value to validate
   * @param fieldName - The field name for error messages
   * @param options - Validation options (min, max)
   * @throws ValidationException if number is invalid
   */
  static validateNumber(
    value: any,
    fieldName: string,
    options?: { min?: number; max?: number }
  ): number {
    const num = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(num)) {
      throw ValidationException.fromFieldError(fieldName, `${fieldName} must be a valid number`)
    }

    if (options?.min !== undefined && num < options.min) {
      throw ValidationException.fromFieldError(
        fieldName,
        `${fieldName} must be at least ${options.min}`
      )
    }

    if (options?.max !== undefined && num > options.max) {
      throw ValidationException.fromFieldError(
        fieldName,
        `${fieldName} must be at most ${options.max}`
      )
    }

    return num
  }

  /**
   * Validates that a value is within an allowed set
   * @param value - The value to validate
   * @param fieldName - The field name for error messages
   * @param allowedValues - Array of allowed values
   * @throws ValidationException if value is not in allowed set
   */
  static validateEnum(value: any, fieldName: string, allowedValues: string[]): string {
    if (!allowedValues.includes(value)) {
      throw ValidationException.fromFieldError(
        fieldName,
        `${fieldName} must be one of: ${allowedValues.join(', ')}`
      )
    }

    return value
  }

  /**
   * Sanitizes a string by trimming whitespace
   * @param value - The value to sanitize
   * @returns Trimmed string or undefined if null/empty
   */
  static sanitizeString(value: any): string | undefined {
    if (value === null || value === undefined) {
      return undefined
    }

    const trimmed = String(value).trim()
    return trimmed.length > 0 ? trimmed : undefined
  }
}
