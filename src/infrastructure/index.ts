/**
 * Infrastructure layer barrel export
 * Provides centralized access to all infrastructure modules
 */

// Database
export { prisma, disconnectPrisma } from './database/prisma/client'

// Repositories
export * from './database/repositories'

// Repository Factory
export { RepositoryFactory } from './database/repositories/RepositoryFactory'
