import { NextResponse } from 'next/server'
import { ValidationException, NotFoundException, DomainException } from '@core/exceptions'

/**
 * Error Handler Middleware
 * Centralizes error handling across all controllers
 * Maps domain exceptions to appropriate HTTP responses
 */
export class ErrorHandler {
  /**
   * Handles errors and returns appropriate HTTP responses
   * @param error - The error to handle
   * @param context - Optional context for logging
   */
  static handle(error: unknown, context?: string): NextResponse {
    // Log error with context
    if (context) {
      console.error(`[${context}] Error:`, error)
    } else {
      console.error('Error:', error)
    }

    // Validation Exception - 400 Bad Request
    if (error instanceof ValidationException) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          validationErrors: error.errors,
          timestamp: error.timestamp.toISOString()
        },
        { status: 400 }
      )
    }

    // Not Found Exception - 404 Not Found
    if (error instanceof NotFoundException) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          entityName: error.entityName,
          entityId: error.entityId,
          timestamp: error.timestamp.toISOString()
        },
        { status: 404 }
      )
    }

    // Domain Exception - 422 Unprocessable Entity
    if (error instanceof DomainException) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          timestamp: error.timestamp.toISOString()
        },
        { status: 422 }
      )
    }

    // Generic Error - 500 Internal Server Error
    const message = error instanceof Error ? error.message : 'Unknown error'
    const stack = error instanceof Error ? error.stack : undefined

    // Only log stack traces in development
    if (process.env.NODE_ENV === 'development' && stack) {
      console.error('Stack trace:', stack)
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { details: message }),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }

  /**
   * Wraps an async handler function with error handling
   * @param handler - The async handler function
   * @param context - Optional context for logging
   */
  static async wrap(
    handler: () => Promise<NextResponse>,
    context?: string
  ): Promise<NextResponse> {
    try {
      return await handler()
    } catch (error) {
      return this.handle(error, context)
    }
  }
}

/**
 * HTTP Status Codes Enum
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500
}
