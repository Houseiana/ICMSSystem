/**
 * Base exception class for all domain-related errors
 * Extends the native Error class to provide consistent error handling
 */
export class DomainException extends Error {
  public readonly timestamp: Date
  public readonly code: string

  constructor(
    message: string,
    code: string = 'DOMAIN_ERROR'
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.timestamp = new Date()

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Converts the exception to a plain object for serialization
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    }
  }
}
