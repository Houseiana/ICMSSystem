import { BaseEntity } from './BaseEntity'

/**
 * Domain event interface
 * Represents something that happened in the domain
 */
export interface DomainEvent {
  occurredOn: Date
  eventType: string
  aggregateId: number
}

/**
 * Aggregate root class
 * Entities that are aggregate roots should extend this class
 * Aggregate roots are responsible for maintaining consistency boundaries
 * and publishing domain events
 */
export abstract class AggregateRoot extends BaseEntity {
  private _domainEvents: DomainEvent[] = []

  /**
   * Gets all domain events
   */
  get domainEvents(): ReadonlyArray<DomainEvent> {
    return [...this._domainEvents]
  }

  /**
   * Adds a domain event
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  /**
   * Clears all domain events
   * Should be called after events have been dispatched
   */
  clearDomainEvents(): void {
    this._domainEvents = []
  }

  /**
   * Checks if there are pending domain events
   */
  hasDomainEvents(): boolean {
    return this._domainEvents.length > 0
  }
}
