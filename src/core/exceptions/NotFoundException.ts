import { DomainException } from './DomainException'

/**
 * Exception thrown when a requested entity is not found
 */
export class NotFoundException extends DomainException {
  public readonly entityName: string
  public readonly entityId: string | number

  constructor(
    entityName: string,
    entityId: string | number,
    message?: string
  ) {
    const defaultMessage = message || `${entityName} with id ${entityId} not found`
    super(defaultMessage, 'NOT_FOUND')
    this.entityName = entityName
    this.entityId = entityId
  }

  /**
   * Creates a NotFoundException with a custom criteria description
   */
  static withCriteria(
    entityName: string,
    criteria: string
  ): NotFoundException {
    const exception = new NotFoundException(
      entityName,
      'N/A',
      `${entityName} not found with criteria: ${criteria}`
    )
    return exception
  }

  /**
   * Converts the exception to a plain object for serialization
   */
  toJSON() {
    return {
      ...super.toJSON(),
      entityName: this.entityName,
      entityId: this.entityId
    }
  }
}
