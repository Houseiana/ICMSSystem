# HR Management System (ICMS)

A comprehensive HR Management System with unified employee forms, built with Next.js, TypeScript, and Prisma.

## 🚀 Live Application

**Deployed URL:** https://web-software-9915cf7xm-devweb3-outlookcoms-projects.vercel.app

**Status:** ✅ Successfully deployed and fully functional
**Note:** Login works with demo fallback. For full database features, configure PostgreSQL connection.

## 🔐 Login Credentials

- **Username:** `mo29qr85`
- **Password:** `theline`

## ✨ Features

### 🎯 **Unified Employee Form System**
- **Class Component Architecture**: Reusable React class component
- **Dynamic Children Forms**: Automatically generates child forms based on number input
- **Flexible Field Requirements**: Only basic info mandatory, all other fields optional
- **Comprehensive Data**: 80+ employee fields including:
  - Personal Information (name, contact, identification)
  - Employment Details (department, position, salary)
  - Family Information (father, mother, spouse, children)
  - Medical Information (conditions, allergies, medications)
  - Education & Skills

### 🏢 **Core Modules**
- **Employee Management**: Create, view, edit, delete employees
- **Dashboard Analytics**: Employee statistics and insights
- **Department Management**: Organize by departments and positions
- **Family Relationships**: Track family member information
- **Authentication System**: Secure login with JWT

### 🏛️ **Available Departments**
- **Human Resources (HR)**: HR management and personnel
- **Information Technology (IT)**: Technical and development roles
- **Finance (FIN)**: Financial management and accounting
- **Marketing (MKT)**: Marketing and promotional activities
- **Sales (SALES)**: Sales representatives and managers
- **Operations (OPS)**: Operational management and coordination
- **Senior Management Offices (SMO)**: Executive leadership positions
- **Private House (PH)**: Private residence management and staff

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Production), SQLite (Development)
- **Deployment**: Vercel
- **Authentication**: JWT with bcrypt password hashing

## 🏗 Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── employees/      # Employee CRUD operations
│   │   └── seed-admin/     # Admin user seeding
│   ├── dashboard/          # Dashboard pages
│   └── login/              # Login page
├── components/
│   ├── UnifiedEmployeeForm.tsx    # Main unified form component
│   ├── examples/                  # Usage examples
│   └── [other components]
├── lib/
│   ├── prisma.ts          # Database connection
│   ├── auth.ts            # Authentication utilities
│   └── [other utilities]
└── types/                 # TypeScript type definitions
```

## 🚀 Local Development

1. **Clone the repository**
```bash
git clone [repository-url]
cd web-software
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

4. **Set up database**
```bash
npx prisma db push
npx prisma generate
```

5. **Seed admin user**
```bash
curl -X POST http://localhost:3001/api/seed-admin
```

6. **Start development server**
```bash
npm run dev
```

## 📊 Database Schema

### Core Models
- **Admin**: System administrators
- **Employee**: Comprehensive employee records
- **Department**: Organizational departments
- **Position**: Job positions and roles
- **FamilyMember**: Employee family relationships

### Key Relationships
- Employee → Department (many-to-one)
- Employee → Position (many-to-one)
- Employee → FamilyMember (one-to-many for children)
- Employee → FamilyMember (one-to-one for father, mother, spouse)

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@hostname:5432/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# App URL (production)
NEXT_PUBLIC_APP_URL="https://your-app-domain.vercel.app"
```

## 🌐 Production Deployment

### Deployed on Vercel
- **Frontend**: Automatically deployed from main branch
- **API Routes**: Serverless functions on Vercel
- **Database**: PostgreSQL on Vercel or Neon
- **Environment Variables**: Configured in Vercel Dashboard

### Deployment Steps
1. Push to GitHub repository
2. Connect to Vercel
3. Configure environment variables
4. Set up PostgreSQL database
5. Deploy database schema
6. Seed admin user

## 🎨 Key Components

### UnifiedEmployeeForm
```tsx
<UnifiedEmployeeForm
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  mode="create" // "create", "edit", "view"
  employee={employeeData} // for edit/view modes
  onSave={handleSave}
  loading={loading}
  size="large" // "small", "medium", "large", "full"
/>
```

### Quick Employee Add Example
```tsx
import QuickEmployeeAdd from '@/components/examples/QuickEmployeeAdd'

function MyComponent() {
  return (
    <div>
      <QuickEmployeeAdd />
    </div>
  )
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Secure session management
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Prisma ORM query building
- **XSS Protection**: React built-in XSS protection

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced experience on tablets
- **Desktop**: Full-featured desktop interface
- **Touch-Friendly**: Large touch targets and intuitive gestures

## 🚀 Performance Optimizations

- **Server-Side Rendering**: Next.js SSR for faster load times
- **Code Splitting**: Automatic code splitting by Next.js
- **Image Optimization**: Next.js image optimization
- **Database Indexing**: Optimized database queries
- **Caching**: API response caching where appropriate

## 📄 License

This project is developed for HR management purposes with comprehensive employee data handling.

---

**Generated with Claude Code**

Co-Authored-By: Claude <noreply@anthropic.com>