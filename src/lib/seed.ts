import { prisma } from './prisma'
import { hashPassword } from './auth'

export async function seedDatabase() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: 'mo29qr85' }
    })

    if (!existingAdmin) {
      const hashedPassword = await hashPassword('theline')

      await prisma.admin.create({
        data: {
          username: 'mo29qr85',
          email: 'mo29qr85@icms.com',
          password: hashedPassword,
          role: 'HR',
          isActive: true
        }
      })

      console.log('✅ Admin created successfully')
      console.log('Username: mo29qr85')
      console.log('Password: theline')
    } else {
      console.log('✅ Admin already exists')
    }

    // Create Departments
    const departments = [
      { name: 'Human Resources', code: 'HR', description: 'Human Resources Department' },
      { name: 'Information Technology', code: 'IT', description: 'IT Department' },
      { name: 'Finance', code: 'FIN', description: 'Finance Department' },
      { name: 'Marketing', code: 'MKT', description: 'Marketing Department' },
      { name: 'Sales', code: 'SALES', description: 'Sales Department' },
      { name: 'Operations', code: 'OPS', description: 'Operations Department' },
      { name: 'Senior Management Offices', code: 'SMO', description: 'Senior Management Offices Department' },
      { name: 'Private House', code: 'PH', description: 'Private House Department' }
    ]

    for (const dept of departments) {
      const existingDept = await prisma.department.findUnique({
        where: { code: dept.code }
      })

      if (!existingDept) {
        await prisma.department.create({
          data: dept
        })
        console.log(`✅ Department created: ${dept.name}`)
      }
    }

    // Create Positions
    const positions = [
      { title: 'CEO', description: 'Chief Executive Officer', level: 'Executive', minSalary: 150000, maxSalary: 300000 },
      { title: 'CTO', description: 'Chief Technology Officer', level: 'Executive', minSalary: 140000, maxSalary: 280000 },
      { title: 'CFO', description: 'Chief Financial Officer', level: 'Executive', minSalary: 140000, maxSalary: 280000 },
      { title: 'COO', description: 'Chief Operations Officer', level: 'Executive', minSalary: 140000, maxSalary: 280000 },
      { title: 'Senior Manager', description: 'Senior Management Position', level: 'Senior', minSalary: 80000, maxSalary: 150000 },
      { title: 'Manager', description: 'Management Position', level: 'Manager', minSalary: 60000, maxSalary: 100000 },
      { title: 'Senior Developer', description: 'Senior Software Developer', level: 'Senior', minSalary: 70000, maxSalary: 120000 },
      { title: 'Developer', description: 'Software Developer', level: 'Mid', minSalary: 50000, maxSalary: 80000 },
      { title: 'Junior Developer', description: 'Junior Software Developer', level: 'Junior', minSalary: 35000, maxSalary: 55000 },
      { title: 'HR Manager', description: 'Human Resources Manager', level: 'Manager', minSalary: 55000, maxSalary: 85000 },
      { title: 'HR Specialist', description: 'Human Resources Specialist', level: 'Mid', minSalary: 40000, maxSalary: 65000 },
      { title: 'Finance Manager', description: 'Finance Manager', level: 'Manager', minSalary: 60000, maxSalary: 90000 },
      { title: 'Accountant', description: 'Accountant', level: 'Mid', minSalary: 40000, maxSalary: 65000 },
      { title: 'Marketing Manager', description: 'Marketing Manager', level: 'Manager', minSalary: 55000, maxSalary: 85000 },
      { title: 'Marketing Specialist', description: 'Marketing Specialist', level: 'Mid', minSalary: 40000, maxSalary: 65000 },
      { title: 'Sales Manager', description: 'Sales Manager', level: 'Manager', minSalary: 55000, maxSalary: 85000 },
      { title: 'Sales Representative', description: 'Sales Representative', level: 'Mid', minSalary: 35000, maxSalary: 60000 },
      { title: 'Operations Manager', description: 'Operations Manager', level: 'Manager', minSalary: 55000, maxSalary: 85000 },
      { title: 'Operations Coordinator', description: 'Operations Coordinator', level: 'Mid', minSalary: 40000, maxSalary: 60000 },
      { title: 'Executive Assistant', description: 'Executive Assistant for Senior Management', level: 'Mid', minSalary: 45000, maxSalary: 70000 },
      { title: 'Private Secretary', description: 'Private Secretary', level: 'Mid', minSalary: 40000, maxSalary: 65000 },
      { title: 'House Manager', description: 'Private House Manager', level: 'Manager', minSalary: 50000, maxSalary: 80000 },
      { title: 'House Staff', description: 'Private House Staff', level: 'Junior', minSalary: 30000, maxSalary: 45000 }
    ]

    for (const position of positions) {
      const existingPosition = await prisma.position.findFirst({
        where: { title: position.title }
      })

      if (!existingPosition) {
        await prisma.position.create({
          data: position
        })
        console.log(`✅ Position created: ${position.title}`)
      }
    }

    console.log('✅ Database seeded successfully')
    return true
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return false
  }
}