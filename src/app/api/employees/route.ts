import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check database connectivity first
    try {
      await prisma.$connect()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        {
          error: 'Database not available. Please configure DATABASE_URL environment variable.',
          details: 'Employee listing requires a working database connection.'
        },
        { status: 503 }
      )
    }

    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check database connectivity first
    try {
      await prisma.$connect()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        {
          error: 'Database not available. Please configure DATABASE_URL environment variable.',
          details: 'Employee creation requires a working database connection.'
        },
        { status: 503 }
      )
    }
    const {
      // Basic Information
      empId,
      firstName,
      middleName,
      lastName,
      preferredName,
      email,
      personalEmail,
      phone,
      alternatePhone,
      dateOfBirth,
      placeOfBirth,
      gender,
      maritalStatus,
      bloodGroup,
      nationality,
      religion,
      languages,

      // Address Information
      currentAddress,
      permanentAddress,
      city,
      state,
      postalCode,
      country,

      // Identification Documents
      nationalId,
      passportNumber,
      passportExpiry,
      drivingLicense,
      licenseExpiry,
      visaStatus,
      visaExpiry,

      // Document URLs
      photoUrl,
      qidDocumentUrl,
      passportDocumentUrl,

      // Emergency Contacts
      emergencyContact1Name,
      emergencyContact1Relation,
      emergencyContact1Phone,
      emergencyContact1Address,
      emergencyContact2Name,
      emergencyContact2Relation,
      emergencyContact2Phone,
      emergencyContact2Address,

      // Education & Qualifications
      highestEducation,
      university,
      graduationYear,
      fieldOfStudy,
      certifications,
      skills,

      // Employment Details
      department,
      position,
      employerId,
      salary,
      currency,
      bankAccount,
      bankName,
      bankBranch,
      taxId,
      socialSecurityNumber,
      hireDate,
      confirmationDate,
      status,
      employeeType,
      workLocation,

      // Medical Information
      medicalConditions,
      allergies,
      medications,

      // Family Information
      fatherFirstName,
      fatherMiddleName,
      fatherLastName,
      fatherDateOfBirth,
      fatherPlaceOfBirth,
      fatherNationality,
      fatherOccupation,
      fatherPhone,
      fatherNationalId,

      motherFirstName,
      motherMiddleName,
      motherLastName,
      motherDateOfBirth,
      motherPlaceOfBirth,
      motherNationality,
      motherOccupation,
      motherPhone,
      motherNationalId,

      spouseFirstName,
      spouseMiddleName,
      spouseLastName,
      spouseDateOfBirth,
      spousePlaceOfBirth,
      spouseNationality,
      spouseOccupation,
      spouseEmployer,
      spousePhone,
      spouseNationalId,

      // Children Information
      children
    } = body

    if (!empId || !firstName || !lastName || !email || !department || !position || !hireDate) {
      return NextResponse.json(
        { error: 'Required fields: empId, firstName, lastName, email, department, position, hireDate' },
        { status: 400 }
      )
    }

    // Check for existing employee
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [
          { empId },
          { email }
        ]
      }
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee ID or email already exists' },
        { status: 409 }
      )
    }


    // Prepare family member data
    const familyMembers = []

    // Father information
    if (fatherFirstName && fatherLastName) {
      familyMembers.push({
        firstName: fatherFirstName,
        middleName: fatherMiddleName,
        lastName: fatherLastName,
        dateOfBirth: fatherDateOfBirth ? new Date(fatherDateOfBirth) : null,
        placeOfBirth: fatherPlaceOfBirth,
        nationality: fatherNationality,
        occupation: fatherOccupation,
        phone: fatherPhone,
        nationalId: fatherNationalId,
        relationshipType: 'FATHER'
      })
    }

    // Mother information
    if (motherFirstName && motherLastName) {
      familyMembers.push({
        firstName: motherFirstName,
        middleName: motherMiddleName,
        lastName: motherLastName,
        dateOfBirth: motherDateOfBirth ? new Date(motherDateOfBirth) : null,
        placeOfBirth: motherPlaceOfBirth,
        nationality: motherNationality,
        occupation: motherOccupation,
        phone: motherPhone,
        nationalId: motherNationalId,
        relationshipType: 'MOTHER'
      })
    }

    // Spouse information
    if (spouseFirstName && spouseLastName && maritalStatus === 'MARRIED') {
      familyMembers.push({
        firstName: spouseFirstName,
        middleName: spouseMiddleName,
        lastName: spouseLastName,
        dateOfBirth: spouseDateOfBirth ? new Date(spouseDateOfBirth) : null,
        placeOfBirth: spousePlaceOfBirth,
        nationality: spouseNationality,
        occupation: spouseOccupation,
        employer: spouseEmployer,
        phone: spousePhone,
        nationalId: spouseNationalId,
        relationshipType: 'SPOUSE'
      })
    }

    // Children information
    if (children && Array.isArray(children)) {
      for (const child of children) {
        if (child.firstName && child.lastName) {
          familyMembers.push({
            firstName: child.firstName,
            middleName: child.middleName,
            lastName: child.lastName,
            dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth) : null,
            placeOfBirth: child.placeOfBirth,
            nationality: child.nationality,
            gender: child.gender,
            bloodGroup: child.bloodGroup,
            isDependent: child.isDependent || true,
            relationshipType: 'CHILD'
          })
        }
      }
    }

    // Create employee with all information
    const employee = await prisma.employee.create({
      data: {
        empId,
        firstName,
        middleName,
        lastName,
        preferredName,
        email,
        personalEmail,
        phone,
        alternatePhone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        placeOfBirth,
        gender,
        maritalStatus,
        bloodGroup,
        nationality,
        religion,
        languages,
        currentAddress,
        permanentAddress,
        city,
        state,
        postalCode,
        country,
        nationalId,
        passportNumber,
        passportExpiry: passportExpiry ? new Date(passportExpiry) : null,
        drivingLicense,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
        visaStatus,
        visaExpiry: visaExpiry ? new Date(visaExpiry) : null,
        photoUrl,
        qidDocumentUrl,
        passportDocumentUrl,
        emergencyContact1Name,
        emergencyContact1Relation,
        emergencyContact1Phone,
        emergencyContact1Address,
        emergencyContact2Name,
        emergencyContact2Relation,
        emergencyContact2Phone,
        emergencyContact2Address,
        highestEducation,
        university,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        fieldOfStudy,
        certifications,
        skills,
        department,
        position,
        employerId: employerId ? parseInt(employerId) : null,
        salary: salary ? parseFloat(salary) : null,
        currency: currency || 'USD',
        bankAccount,
        bankName,
        bankBranch,
        taxId,
        socialSecurityNumber,
        hireDate: new Date(hireDate),
        confirmationDate: confirmationDate ? new Date(confirmationDate) : null,
        status: status || 'ACTIVE',
        employeeType: employeeType || 'FULL_TIME',
        workLocation: workLocation || 'OFFICE',
        medicalConditions,
        allergies,
        medications
      },
      include: {
        employer: true
      }
    })

    // Create family members and link them
    for (const familyMember of familyMembers) {
      const createdFamilyMember = await prisma.familyMember.create({
        data: familyMember
      })

      // Link family member to employee based on relationship type
      if (familyMember.relationshipType === 'FATHER') {
        await prisma.employee.update({
          where: { id: employee.id },
          data: {
            father: {
              connect: { id: createdFamilyMember.id }
            }
          }
        })
      } else if (familyMember.relationshipType === 'MOTHER') {
        await prisma.employee.update({
          where: { id: employee.id },
          data: {
            mother: {
              connect: { id: createdFamilyMember.id }
            }
          }
        })
      } else if (familyMember.relationshipType === 'SPOUSE') {
        await prisma.employee.update({
          where: { id: employee.id },
          data: {
            spouse: {
              connect: { id: createdFamilyMember.id }
            }
          }
        })
      } else if (familyMember.relationshipType === 'CHILD') {
        // Update the family member to link to employee as child
        await prisma.familyMember.update({
          where: { id: createdFamilyMember.id },
          data: {
            employeeAsChildId: employee.id
          }
        })
      }
    }

    // Fetch the complete employee record with family information
    const completeEmployee = await prisma.employee.findUnique({
      where: { id: employee.id },
      include: {
        employer: true,
        father: true,
        mother: true,
        spouse: true,
        children: true
      }
    })

    return NextResponse.json(completeEmployee, { status: 201 })
  } catch (error) {
    console.error('Create employee error:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}