import { DomainException } from './DomainException'

/**
 * Exception thrown when validation fails
 * Contains detailed information about validation errors
 */
export class ValidationException extends DomainException {
  public readonly errors: ValidationError[]

  constructor(
    message: string,
    errors: ValidationError[] = []
  ) {
    super(message, 'VALIDATION_ERROR')
    this.errors = errors
  }

  /**
   * Creates a ValidationException from a single field error
   */
  static fromFieldError(field: string, message: string): ValidationException {
    return new ValidationException(
      `Validation failed for field: ${field}`,
      [{ field, message }]
    )
  }

  /**
   * Creates a ValidationException from multiple field errors
   */
  static fromFieldErrors(errors: ValidationError[]): ValidationException {
    const fields = errors.map(e => e.field).join(', ')
    return new ValidationException(
      `Validation failed for fields: ${fields}`,
      errors
    )
  }

  /**
   * Converts the exception to a plain object for serialization
   */
  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors
    }
  }
}

/**
 * Represents a single validation error for a field
 */
export interface ValidationError {
  field: string
  message: string
  value?: any
}
