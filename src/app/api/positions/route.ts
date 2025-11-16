import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return predefined positions list
    // Note: Position model doesn't exist in schema, using hardcoded list
    return NextResponse.json([
      { id: 1, title: 'CEO', description: 'Chief Executive Officer', level: 'Executive', minSalary: 150000, maxSalary: 300000 },
      { id: 2, title: 'CTO', description: 'Chief Technology Officer', level: 'Executive', minSalary: 140000, maxSalary: 280000 },
      { id: 3, title: 'CFO', description: 'Chief Financial Officer', level: 'Executive', minSalary: 140000, maxSalary: 280000 },
      { id: 4, title: 'COO', description: 'Chief Operations Officer', level: 'Executive', minSalary: 140000, maxSalary: 280000 },
      { id: 5, title: 'Senior Manager', description: 'Senior Management Position', level: 'Senior', minSalary: 80000, maxSalary: 150000 },
      { id: 6, title: 'Manager', description: 'Management Position', level: 'Manager', minSalary: 60000, maxSalary: 100000 },
      { id: 7, title: 'Senior Developer', description: 'Senior Software Developer', level: 'Senior', minSalary: 70000, maxSalary: 120000 },
      { id: 8, title: 'Developer', description: 'Software Developer', level: 'Mid', minSalary: 50000, maxSalary: 80000 },
      { id: 9, title: 'Junior Developer', description: 'Junior Software Developer', level: 'Junior', minSalary: 35000, maxSalary: 55000 },
      { id: 10, title: 'HR Manager', description: 'Human Resources Manager', level: 'Manager', minSalary: 55000, maxSalary: 85000 },
      { id: 11, title: 'HR Specialist', description: 'Human Resources Specialist', level: 'Mid', minSalary: 40000, maxSalary: 65000 },
      { id: 12, title: 'Finance Manager', description: 'Finance Manager', level: 'Manager', minSalary: 60000, maxSalary: 90000 },
      { id: 13, title: 'Accountant', description: 'Accountant', level: 'Mid', minSalary: 40000, maxSalary: 65000 },
      { id: 14, title: 'Marketing Manager', description: 'Marketing Manager', level: 'Manager', minSalary: 55000, maxSalary: 85000 },
      { id: 15, title: 'Marketing Specialist', description: 'Marketing Specialist', level: 'Mid', minSalary: 40000, maxSalary: 65000 },
      { id: 16, title: 'Sales Manager', description: 'Sales Manager', level: 'Manager', minSalary: 55000, maxSalary: 85000 },
      { id: 17, title: 'Sales Representative', description: 'Sales Representative', level: 'Mid', minSalary: 35000, maxSalary: 60000 },
      { id: 18, title: 'Operations Manager', description: 'Operations Manager', level: 'Manager', minSalary: 55000, maxSalary: 85000 },
      { id: 19, title: 'Operations Coordinator', description: 'Operations Coordinator', level: 'Mid', minSalary: 40000, maxSalary: 60000 },
      { id: 20, title: 'Executive Assistant', description: 'Executive Assistant for Senior Management', level: 'Mid', minSalary: 45000, maxSalary: 70000 },
      { id: 21, title: 'Private Secretary', description: 'Private Secretary', level: 'Mid', minSalary: 40000, maxSalary: 65000 },
      { id: 22, title: 'House Manager', description: 'Private House Manager', level: 'Manager', minSalary: 50000, maxSalary: 80000 },
      { id: 23, title: 'House Staff', description: 'Private House Staff', level: 'Junior', minSalary: 30000, maxSalary: 45000 }
    ])
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json({ error: 'Failed to fetch positions' }, { status: 500 })
  }
}