import { ValidationException } from '../exceptions'

/**
 * Address value object
 * Encapsulates address validation and business rules
 * Composite value object containing multiple fields
 * Immutable once created
 */
export class Address {
  private readonly _street: string
  private readonly _city: string
  private readonly _state: string
  private readonly _postalCode: string
  private readonly _country: string
  private readonly _addressLine2?: string

  private constructor(
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string,
    addressLine2?: string
  ) {
    this._street = street
    this._city = city
    this._state = state
    this._postalCode = postalCode
    this._country = country
    this._addressLine2 = addressLine2
  }

  /**
   * Factory method to create an Address instance
   * Validates all address components before creation
   */
  static create(params: AddressParams): Address {
    const errors: Array<{ field: string; message: string }> = []

    // Validate street
    if (!params.street || params.street.trim().length === 0) {
      errors.push({ field: 'street', message: 'Street address is required' })
    } else if (params.street.length > 255) {
      errors.push({ field: 'street', message: 'Street address cannot exceed 255 characters' })
    }

    // Validate city
    if (!params.city || params.city.trim().length === 0) {
      errors.push({ field: 'city', message: 'City is required' })
    } else if (params.city.length > 100) {
      errors.push({ field: 'city', message: 'City cannot exceed 100 characters' })
    }

    // Validate state
    if (!params.state || params.state.trim().length === 0) {
      errors.push({ field: 'state', message: 'State/Province is required' })
    } else if (params.state.length > 100) {
      errors.push({ field: 'state', message: 'State/Province cannot exceed 100 characters' })
    }

    // Validate postal code
    if (!params.postalCode || params.postalCode.trim().length === 0) {
      errors.push({ field: 'postalCode', message: 'Postal code is required' })
    } else if (!this.isValidPostalCode(params.postalCode, params.country)) {
      errors.push({ field: 'postalCode', message: 'Invalid postal code format' })
    }

    // Validate country
    if (!params.country || params.country.trim().length === 0) {
      errors.push({ field: 'country', message: 'Country is required' })
    } else if (params.country.length > 100) {
      errors.push({ field: 'country', message: 'Country cannot exceed 100 characters' })
    }

    // Validate optional addressLine2
    if (params.addressLine2 && params.addressLine2.length > 255) {
      errors.push({ field: 'addressLine2', message: 'Address line 2 cannot exceed 255 characters' })
    }

    if (errors.length > 0) {
      throw ValidationException.fromFieldErrors(errors)
    }

    return new Address(
      params.street.trim(),
      params.city.trim(),
      params.state.trim(),
      params.postalCode.trim(),
      params.country.trim(),
      params.addressLine2?.trim()
    )
  }

  /**
   * Validates postal code based on country
   */
  private static isValidPostalCode(postalCode: string, country: string): boolean {
    const cleanCode = postalCode.replace(/\s/g, '')

    // Basic validation patterns for common countries
    const patterns: Record<string, RegExp> = {
      'USA': /^\d{5}(-\d{4})?$/,
      'United States': /^\d{5}(-\d{4})?$/,
      'US': /^\d{5}(-\d{4})?$/,
      'Canada': /^[A-Z]\d[A-Z]\d[A-Z]\d$/i,
      'CA': /^[A-Z]\d[A-Z]\d[A-Z]\d$/i,
      'UK': /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
      'United Kingdom': /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    }

    const pattern = patterns[country]
    if (pattern) {
      return pattern.test(cleanCode)
    }

    // Generic validation for other countries (3-10 alphanumeric characters)
    return /^[A-Z0-9]{3,10}$/i.test(cleanCode)
  }

  /**
   * Gets the street address
   */
  get street(): string {
    return this._street
  }

  /**
   * Gets the city
   */
  get city(): string {
    return this._city
  }

  /**
   * Gets the state/province
   */
  get state(): string {
    return this._state
  }

  /**
   * Gets the postal code
   */
  get postalCode(): string {
    return this._postalCode
  }

  /**
   * Gets the country
   */
  get country(): string {
    return this._country
  }

  /**
   * Gets the optional address line 2
   */
  get addressLine2(): string | undefined {
    return this._addressLine2
  }

  /**
   * Gets the full address as a single formatted string
   */
  get fullAddress(): string {
    const parts = [
      this._street,
      this._addressLine2,
      this._city,
      this._state,
      this._postalCode,
      this._country
    ].filter(Boolean)

    return parts.join(', ')
  }

  /**
   * Checks if this address equals another address
   */
  equals(other: Address): boolean {
    if (!other) return false
    return (
      this._street === other._street &&
      this._city === other._city &&
      this._state === other._state &&
      this._postalCode === other._postalCode &&
      this._country === other._country &&
      this._addressLine2 === other._addressLine2
    )
  }

  /**
   * String representation (full address)
   */
  toString(): string {
    return this.fullAddress
  }

  /**
   * JSON serialization
   */
  toJSON(): AddressJSON {
    return {
      street: this._street,
      city: this._city,
      state: this._state,
      postalCode: this._postalCode,
      country: this._country,
      addressLine2: this._addressLine2,
      fullAddress: this.fullAddress
    }
  }
}

/**
 * Parameters for creating an Address
 */
export interface AddressParams {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  addressLine2?: string
}

/**
 * JSON representation of Address
 */
export interface AddressJSON {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  addressLine2?: string
  fullAddress: string
}
