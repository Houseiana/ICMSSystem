import { ValidationException } from '../exceptions'

/**
 * Email value object
 * Encapsulates email validation and business rules
 * Immutable once created
 */
export class Email {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  /**
   * Factory method to create an Email instance
   * Validates the email format before creation
   */
  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw ValidationException.fromFieldError('email', 'Email cannot be empty')
    }

    const trimmedEmail = email.trim().toLowerCase()

    if (!this.isValidFormat(trimmedEmail)) {
      throw ValidationException.fromFieldError('email', 'Invalid email format')
    }

    if (trimmedEmail.length > 255) {
      throw ValidationException.fromFieldError('email', 'Email cannot exceed 255 characters')
    }

    return new Email(trimmedEmail)
  }

  /**
   * Validates email format using regex
   */
  private static isValidFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Gets the email value
   */
  get value(): string {
    return this._value
  }

  /**
   * Gets the domain part of the email
   */
  get domain(): string {
    return this._value.split('@')[1]
  }

  /**
   * Gets the local part of the email (before @)
   */
  get localPart(): string {
    return this._value.split('@')[0]
  }

  /**
   * Checks if this email equals another email
   */
  equals(other: Email): boolean {
    if (!other) return false
    return this._value === other._value
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value
  }

  /**
   * JSON serialization
   */
  toJSON(): string {
    return this._value
  }
}
