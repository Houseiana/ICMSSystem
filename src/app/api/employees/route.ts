import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        position: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        father: true,
        mother: true,
        spouse: true,
        children: true
      },
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

    // Find or create department
    let departmentRecord = await prisma.department.findFirst({
      where: { name: department }
    })

    if (!departmentRecord) {
      departmentRecord = await prisma.department.create({
        data: {
          name: department,
          code: department.toUpperCase().replace(/\s+/g, '_'),
          description: `${department} department`
        }
      })
    }

    // Find or create position
    let positionRecord = await prisma.position.findFirst({
      where: { title: position }
    })

    if (!positionRecord) {
      positionRecord = await prisma.position.create({
        data: {
          title: position,
          description: `${position} position`,
          level: 'Mid'
        }
      })
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
        departmentId: departmentRecord.id,
        positionId: positionRecord.id,
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
        department: true,
        position: true
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
        department: true,
        position: true,
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