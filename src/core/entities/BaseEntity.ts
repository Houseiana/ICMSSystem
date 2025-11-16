/**
 * Base entity class
 * All domain entities should extend this class
 * Provides common properties and methods for all entities
 */
export abstract class BaseEntity {
  protected readonly _id: number
  protected readonly _createdAt: Date
  protected _updatedAt: Date

  constructor(id: number, createdAt: Date = new Date(), updatedAt: Date = new Date()) {
    this._id = id
    this._createdAt = createdAt
    this._updatedAt = updatedAt
  }

  /**
   * Gets the entity ID
   */
  get id(): number {
    return this._id
  }

  /**
   * Gets the creation timestamp
   */
  get createdAt(): Date {
    return this._createdAt
  }

  /**
   * Gets the last update timestamp
   */
  get updatedAt(): Date {
    return this._updatedAt
  }

  /**
   * Marks the entity as updated
   */
  protected touch(): void {
    this._updatedAt = new Date()
  }

  /**
   * Checks if this entity equals another entity
   * Two entities are equal if they have the same ID and type
   */
  equals(other: BaseEntity): boolean {
    if (!other) return false
    if (this.constructor !== other.constructor) return false
    return this._id === other._id
  }

  /**
   * Checks if the entity is new (not persisted yet)
   */
  isNew(): boolean {
    return this._id === 0 || this._id === null || this._id === undefined
  }
}
