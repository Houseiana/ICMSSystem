/**
 * Base repository interface
 * Defines common CRUD operations for all repositories
 * Generic type T represents the entity type
 */
export interface IBaseRepository<T> {
  /**
   * Finds an entity by its ID
   * @param id - The entity ID
   * @returns The entity if found, null otherwise
   */
  findById(id: number): Promise<T | null>

  /**
   * Finds all entities
   * @returns Array of all entities
   */
  findAll(): Promise<T[]>

  /**
   * Creates a new entity
   * @param entity - The entity to create
   * @returns The created entity with generated ID
   */
  create(entity: T): Promise<T>

  /**
   * Updates an existing entity
   * @param id - The entity ID
   * @param entity - The entity data to update
   * @returns The updated entity
   */
  update(id: number, entity: Partial<T>): Promise<T>

  /**
   * Deletes an entity by its ID
   * @param id - The entity ID
   * @returns True if deleted, false otherwise
   */
  delete(id: number): Promise<boolean>

  /**
   * Checks if an entity exists by its ID
   * @param id - The entity ID
   * @returns True if exists, false otherwise
   */
  exists(id: number): Promise<boolean>

  /**
   * Counts total number of entities
   * @returns Total count
   */
  count(): Promise<number>
}
