import { ValidationException } from '../exceptions'

/**
 * PhoneNumber value object
 * Encapsulates phone number validation, formatting, and business rules
 * Immutable once created
 */
export class PhoneNumber {
  private readonly _value: string
  private readonly _countryCode: string
  private readonly _formatted: string

  private constructor(value: string, countryCode: string) {
    this._value = value
    this._countryCode = countryCode
    this._formatted = this.format(value, countryCode)
  }

  /**
   * Factory method to create a PhoneNumber instance
   * Validates the phone number before creation
   */
  static create(phoneNumber: string, countryCode: string = '+1'): PhoneNumber {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      throw ValidationException.fromFieldError('phoneNumber', 'Phone number cannot be empty')
    }

    const cleanedNumber = this.cleanPhoneNumber(phoneNumber)

    if (!this.isValidFormat(cleanedNumber)) {
      throw ValidationException.fromFieldError('phoneNumber', 'Invalid phone number format')
    }

    if (!this.isValidCountryCode(countryCode)) {
      throw ValidationException.fromFieldError('countryCode', 'Invalid country code')
    }

    return new PhoneNumber(cleanedNumber, countryCode)
  }

  /**
   * Removes all non-digit characters from phone number
   */
  private static cleanPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '')
  }

  /**
   * Validates phone number format (basic validation for digits only)
   */
  private static isValidFormat(phone: string): boolean {
    // Basic validation: 7-15 digits
    return /^\d{7,15}$/.test(phone)
  }

  /**
   * Validates country code format
   */
  private static isValidCountryCode(code: string): boolean {
    return /^\+\d{1,4}$/.test(code)
  }

  /**
   * Formats the phone number for display
   */
  private format(number: string, countryCode: string): string {
    // Example formatting for US numbers (+1)
    if (countryCode === '+1' && number.length === 10) {
      return `${countryCode} (${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`
    }

    // Default format
    return `${countryCode} ${number}`
  }

  /**
   * Gets the raw phone number (digits only)
   */
  get value(): string {
    return this._value
  }

  /**
   * Gets the country code
   */
  get countryCode(): string {
    return this._countryCode
  }

  /**
   * Gets the formatted phone number
   */
  get formatted(): string {
    return this._formatted
  }

  /**
   * Gets the full phone number with country code (no formatting)
   */
  get fullNumber(): string {
    return `${this._countryCode}${this._value}`
  }

  /**
   * Checks if this phone number equals another phone number
   */
  equals(other: PhoneNumber): boolean {
    if (!other) return false
    return this._value === other._value && this._countryCode === other._countryCode
  }

  /**
   * String representation (formatted)
   */
  toString(): string {
    return this._formatted
  }

  /**
   * JSON serialization
   */
  toJSON(): { value: string; countryCode: string; formatted: string } {
    return {
      value: this._value,
      countryCode: this._countryCode,
      formatted: this._formatted
    }
  }
}
