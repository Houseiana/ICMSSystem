import { prisma } from './prisma'
import { hashPassword } from './auth'

export async function enhancedSeedDatabase() {
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

    // Seed Departments
    const departments = [
      { name: 'Human Resources', code: 'HR', description: 'Manages employee relations and policies' },
      { name: 'Information Technology', code: 'IT', description: 'Technology infrastructure and development' },
      { name: 'Finance', code: 'FIN', description: 'Financial planning and accounting' },
      { name: 'Marketing', code: 'MKT', description: 'Brand promotion and market analysis' },
      { name: 'Operations', code: 'OPS', description: 'Daily business operations and logistics' },
      { name: 'Sales', code: 'SAL', description: 'Customer acquisition and revenue generation' },
      { name: 'Customer Service', code: 'CS', description: 'Customer support and satisfaction' },
      { name: 'Research & Development', code: 'RND', description: 'Innovation and product development' },
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

    // Seed Positions
    const positions = [
      { title: 'Software Engineer', level: 'Mid', description: 'Develops and maintains software applications', minSalary: 70000, maxSalary: 120000 },
      { title: 'Senior Software Engineer', level: 'Senior', description: 'Lead developer with advanced technical skills', minSalary: 100000, maxSalary: 160000 },
      { title: 'Project Manager', level: 'Manager', description: 'Manages project timelines and resources', minSalary: 80000, maxSalary: 130000 },
      { title: 'HR Specialist', level: 'Mid', description: 'Handles employee relations and HR processes', minSalary: 55000, maxSalary: 80000 },
      { title: 'Financial Analyst', level: 'Mid', description: 'Analyzes financial data and market trends', minSalary: 60000, maxSalary: 90000 },
      { title: 'Marketing Coordinator', level: 'Junior', description: 'Supports marketing campaigns and activities', minSalary: 40000, maxSalary: 60000 },
      { title: 'Sales Representative', level: 'Junior', description: 'Sells products and services to customers', minSalary: 45000, maxSalary: 70000 },
      { title: 'Customer Support Agent', level: 'Junior', description: 'Provides customer service and support', minSalary: 35000, maxSalary: 50000 },
      { title: 'DevOps Engineer', level: 'Mid', description: 'Manages deployment and infrastructure', minSalary: 75000, maxSalary: 125000 },
      { title: 'UX/UI Designer', level: 'Mid', description: 'Designs user interfaces and experiences', minSalary: 65000, maxSalary: 100000 },
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
    console.error('❌ Error seeding enhanced database:', error)
    return false
  }
}