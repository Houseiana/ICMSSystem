import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        directReports: {
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
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Extract all comprehensive employee data
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

    // Get existing employee with family information
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        father: true,
        mother: true,
        spouse: true,
        children: true
      }
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Update employee main information
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(params.id) },
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
        department,
        position,
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
      }
    })

    // Handle family member updates
    // Update or create father
    if (fatherFirstName && fatherLastName) {
      if (existingEmployee.father) {
        await prisma.familyMember.update({
          where: { id: existingEmployee.father.id },
          data: {
            firstName: fatherFirstName,
            middleName: fatherMiddleName,
            lastName: fatherLastName,
            dateOfBirth: fatherDateOfBirth ? new Date(fatherDateOfBirth) : null,
            placeOfBirth: fatherPlaceOfBirth,
            nationality: fatherNationality,
            occupation: fatherOccupation,
            phone: fatherPhone,
            nationalId: fatherNationalId
          }
        })
      } else {
        const newFather = await prisma.familyMember.create({
          data: {
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
          }
        })
        await prisma.employee.update({
          where: { id: parseInt(params.id) },
          data: { father: { connect: { id: newFather.id } } }
        })
      }
    }

    // Update or create mother
    if (motherFirstName && motherLastName) {
      if (existingEmployee.mother) {
        await prisma.familyMember.update({
          where: { id: existingEmployee.mother.id },
          data: {
            firstName: motherFirstName,
            middleName: motherMiddleName,
            lastName: motherLastName,
            dateOfBirth: motherDateOfBirth ? new Date(motherDateOfBirth) : null,
            placeOfBirth: motherPlaceOfBirth,
            nationality: motherNationality,
            occupation: motherOccupation,
            phone: motherPhone,
            nationalId: motherNationalId
          }
        })
      } else {
        const newMother = await prisma.familyMember.create({
          data: {
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
          }
        })
        await prisma.employee.update({
          where: { id: parseInt(params.id) },
          data: { mother: { connect: { id: newMother.id } } }
        })
      }
    }

    // Update or create spouse (if married)
    if (spouseFirstName && spouseLastName && maritalStatus === 'MARRIED') {
      if (existingEmployee.spouse) {
        await prisma.familyMember.update({
          where: { id: existingEmployee.spouse.id },
          data: {
            firstName: spouseFirstName,
            middleName: spouseMiddleName,
            lastName: spouseLastName,
            dateOfBirth: spouseDateOfBirth ? new Date(spouseDateOfBirth) : null,
            placeOfBirth: spousePlaceOfBirth,
            nationality: spouseNationality,
            occupation: spouseOccupation,
            employer: spouseEmployer,
            phone: spousePhone,
            nationalId: spouseNationalId
          }
        })
      } else {
        const newSpouse = await prisma.familyMember.create({
          data: {
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
          }
        })
        await prisma.employee.update({
          where: { id: parseInt(params.id) },
          data: { spouse: { connect: { id: newSpouse.id } } }
        })
      }
    }

    // Handle children updates
    if (children && Array.isArray(children)) {
      // First, remove existing children that are no longer in the list
      const existingChildren = existingEmployee.children || []

      // Delete children that are no longer present
      for (const existingChild of existingChildren) {
        const stillExists = children.some(child => child.id === existingChild.id)
        if (!stillExists) {
          await prisma.familyMember.delete({
            where: { id: existingChild.id }
          })
        }
      }

      // Update or create children
      for (const child of children) {
        if (child.firstName && child.lastName) {
          if (child.id && existingChildren.some(ec => ec.id === parseInt(child.id))) {
            // Update existing child
            await prisma.familyMember.update({
              where: { id: parseInt(child.id) },
              data: {
                firstName: child.firstName,
                middleName: child.middleName,
                lastName: child.lastName,
                dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth) : null,
                placeOfBirth: child.placeOfBirth,
                nationality: child.nationality,
                gender: child.gender,
                bloodGroup: child.bloodGroup,
                isDependent: child.isDependent || true
              }
            })
          } else {
            // Create new child
            await prisma.familyMember.create({
              data: {
                firstName: child.firstName,
                middleName: child.middleName,
                lastName: child.lastName,
                dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth) : null,
                placeOfBirth: child.placeOfBirth,
                nationality: child.nationality,
                gender: child.gender,
                bloodGroup: child.bloodGroup,
                isDependent: child.isDependent || true,
                relationshipType: 'CHILD',
                employeeAsChildId: parseInt(params.id)
              }
            })
          }
        }
      }
    }

    // Fetch complete updated employee data
    const completeEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        father: true,
        mother: true,
        spouse: true,
        children: true
      }
    })

    return NextResponse.json(completeEmployee)
  } catch (error) {
    console.error('Error updating employee:', error)
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.employee.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}