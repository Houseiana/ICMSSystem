import { prisma } from './prisma'
import { hashPassword } from './auth'

export async function seedDatabase() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'admin' }
    })

    if (!existingAdmin) {
      const hashedPassword = await hashPassword('admin123')

      await prisma.admin.create({
        data: {
          username: 'admin',
          email: 'admin@icms.com',
          password: hashedPassword,
          role: 'HR',
          isActive: true
        }
      })

      console.log('✅ Demo admin created successfully')
      console.log('Username: admin')
      console.log('Password: admin123')
    } else {
      console.log('✅ Demo admin already exists')
    }

    return true
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return false
  }
}