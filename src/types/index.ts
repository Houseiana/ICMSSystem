export interface User {
  id: number
  email: string
  name?: string
  createdAt: string
  updatedAt: string
  posts?: Post[]
}

export interface Post {
  id: number
  title: string
  content?: string
  published: boolean
  authorId: number
  author?: User
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: number
  username: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Employee {
  id: number
  empId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department: string
  position: string
  salary?: number
  hireDate: string
  status: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  createdAt: string
  updatedAt: string
}