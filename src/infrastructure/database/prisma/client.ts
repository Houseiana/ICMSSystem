import { PrismaClient } from '@prisma/client'

/**
 * Prisma client singleton
 * Ensures only one instance of PrismaClient exists
 * Prevents connection pooling issues in development
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

/**
 * Gracefully disconnect Prisma on application shutdown
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect()
}
