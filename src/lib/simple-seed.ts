import { prisma } from './prisma'
import { hashPassword } from './auth'

export async function simpleSeedDatabase() {
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
    }

    // Create basic departments
    const departments = [
      { name: 'Human Resources', code: 'HR', description: 'Manages employee relations and policies' },
      { name: 'Information Technology', code: 'IT', description: 'Technology infrastructure and development' },
      { name: 'Finance', code: 'FIN', description: 'Financial planning and accounting' },
      { name: 'Marketing', code: 'MKT', description: 'Brand promotion and market analysis' },
      { name: 'Operations', code: 'OPS', description: 'Daily business operations and logistics' },
    ]

    for (const dept of departments) {
      const existing = await prisma.department.findFirst({
        where: { code: dept.code }
      })

      if (!existing) {
        await prisma.department.create({
          data: dept
        })
      }
    }
    console.log('✅ Departments seeded successfully')

    // Create basic positions
    const positions = [
      { title: 'Software Engineer', level: 'Mid', description: 'Develops and maintains software applications', minSalary: 70000, maxSalary: 120000 },
      { title: 'HR Specialist', level: 'Mid', description: 'Handles employee relations and HR processes', minSalary: 55000, maxSalary: 80000 },
      { title: 'Financial Analyst', level: 'Mid', description: 'Analyzes financial data and market trends', minSalary: 60000, maxSalary: 90000 },
      { title: 'Marketing Coordinator', level: 'Junior', description: 'Supports marketing campaigns and activities', minSalary: 40000, maxSalary: 60000 },
      { title: 'Operations Manager', level: 'Senior', description: 'Manages daily operations and processes', minSalary: 75000, maxSalary: 110000 },
    ]

    for (const position of positions) {
      const existing = await prisma.position.findFirst({
        where: { title: position.title }
      })

      if (!existing) {
        await prisma.position.create({
          data: position
        })
      }
    }
    console.log('✅ Positions seeded successfully')

    return true
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return false
  }
}