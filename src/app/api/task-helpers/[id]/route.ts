import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskHelperId = parseInt(params.id)

    const taskHelper = await prisma.taskHelper.findUnique({
      where: { id: taskHelperId },
      include: {
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true
          }
        },
        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            workType: true,
            status: true
          }
        }
      }
    })

    if (!taskHelper) {
      return NextResponse.json(
        { error: 'Task helper not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(taskHelper)
  } catch (error) {
    console.error('Error fetching task helper:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task helper' },
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
    const taskHelperId = parseInt(params.id)

    const {
      firstName,
      middleName,
      lastName,
      preferredName,
      dateOfBirth,
      placeOfBirth,
      gender,
      maritalStatus,
      bloodGroup,
      nationality,
      religion,
      languages,

      primaryEmail,
      personalEmail,
      workEmail,
      primaryPhone,
      mobilePhone,
      whatsappNumber,
      homePhone,
      workPhone,
      skypeId,
      telegramId,
      preferredContact,

      currentAddress,
      permanentAddress,
      city,
      state,
      postalCode,
      country,
      coordinates,

      nationalId,
      passportNumber,
      passportExpiry,
      passportIssuingCountry,
      drivingLicense,
      licenseExpiry,
      visaStatus,
      visaType,
      visaNumber,
      visaValidFrom,
      visaValidTo,
      visaCategory,
      visaEntries,

      emergencyContact1Name,
      emergencyContact1Relation,
      emergencyContact1Phone,
      emergencyContact1Address,
      emergencyContact2Name,
      emergencyContact2Relation,
      emergencyContact2Phone,
      emergencyContact2Address,

      workType,
      workLocation,
      jobTitle,
      department,
      workDescription,
      skills,
      specializations,

      degreeOfCooperation,
      availability,
      timeZone,
      bestTimeToCall,
      workingHours,

      highestEducation,
      university,
      graduationYear,
      fieldOfStudy,
      certifications,
      previousExperience,

      paymentType,
      hourlyRate,
      dailyRate,
      monthlyRate,
      currency,
      paymentMethod,
      bankAccount,
      bankName,
      paymentNotes,

      giftsReceived,
      benefitsProvided,
      bonusHistory,

      overallRating,
      reliability,
      quality,
      communication,
      punctuality,

      medicalConditions,
      allergies,
      medications,
      healthInsurance,

      contractType,
      contractStart,
      contractEnd,
      contractTerms,
      confidentialityAgreement,

      backgroundCheck,
      references,
      previousEmployers,
      criminalRecord,

      personalInterests,
      workPreferences,
      culturalConsiderations,
      personalNotes,
      managerNotes,

      status,
      lastContactDate,
      nextReviewDate,
      supervisorId,

      // Document URLs
      photoUrl,
      qidDocumentUrl,
      passportDocumentUrl
    } = body

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Check if task helper exists
    const existingTaskHelper = await prisma.taskHelper.findUnique({
      where: { id: taskHelperId }
    })

    if (!existingTaskHelper) {
      return NextResponse.json(
        { error: 'Task helper not found' },
        { status: 404 }
      )
    }

    // Check for duplicate email (excluding current task helper)
    if (primaryEmail && primaryEmail !== existingTaskHelper.primaryEmail) {
      const duplicateHelper = await prisma.taskHelper.findUnique({
        where: { primaryEmail }
      })

      if (duplicateHelper) {
        return NextResponse.json(
          { error: 'Another task helper with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Generate full name
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')

    const taskHelper = await prisma.taskHelper.update({
      where: { id: taskHelperId },
      data: {
        firstName,
        middleName,
        lastName,
        fullName,
        preferredName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        placeOfBirth,
        gender,
        maritalStatus,
        bloodGroup,
        nationality,
        religion,
        languages: languages ? JSON.stringify(languages) : null,

        primaryEmail,
        personalEmail,
        workEmail,
        primaryPhone,
        mobilePhone,
        whatsappNumber,
        homePhone,
        workPhone,
        skypeId,
        telegramId,
        preferredContact: preferredContact || 'PHONE',

        currentAddress,
        permanentAddress,
        city,
        state,
        postalCode,
        country,
        coordinates,

        nationalId,
        passportNumber,
        passportExpiry: passportExpiry ? new Date(passportExpiry) : null,
        passportIssuingCountry,
        drivingLicense,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
        visaStatus,
        visaType,
        visaNumber,
        visaValidFrom: visaValidFrom ? new Date(visaValidFrom) : null,
        visaValidTo: visaValidTo ? new Date(visaValidTo) : null,
        visaCategory,
        visaEntries,

        emergencyContact1Name,
        emergencyContact1Relation,
        emergencyContact1Phone,
        emergencyContact1Address,
        emergencyContact2Name,
        emergencyContact2Relation,
        emergencyContact2Phone,
        emergencyContact2Address,

        workType: workType || 'INTERNAL',
        workLocation,
        jobTitle,
        department,
        workDescription,
        skills: skills ? JSON.stringify(skills) : null,
        specializations: specializations ? JSON.stringify(specializations) : null,

        degreeOfCooperation: degreeOfCooperation || 'HIGH',
        availability: availability ? JSON.stringify(availability) : null,
        timeZone,
        bestTimeToCall,
        workingHours: workingHours ? JSON.stringify(workingHours) : null,

        highestEducation,
        university,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        fieldOfStudy,
        certifications: certifications ? JSON.stringify(certifications) : null,
        previousExperience,

        paymentType,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        dailyRate: dailyRate ? parseFloat(dailyRate) : null,
        monthlyRate: monthlyRate ? parseFloat(monthlyRate) : null,
        currency: currency || 'USD',
        paymentMethod,
        bankAccount,
        bankName,
        paymentNotes,

        giftsReceived: giftsReceived ? JSON.stringify(giftsReceived) : null,
        benefitsProvided: benefitsProvided ? JSON.stringify(benefitsProvided) : null,
        bonusHistory: bonusHistory ? JSON.stringify(bonusHistory) : null,

        overallRating: overallRating ? parseFloat(overallRating) : null,
        reliability: reliability ? parseFloat(reliability) : null,
        quality: quality ? parseFloat(quality) : null,
        communication: communication ? parseFloat(communication) : null,
        punctuality: punctuality ? parseFloat(punctuality) : null,

        medicalConditions,
        allergies,
        medications,
        healthInsurance: healthInsurance || false,

        contractType,
        contractStart: contractStart ? new Date(contractStart) : null,
        contractEnd: contractEnd ? new Date(contractEnd) : null,
        contractTerms,
        confidentialityAgreement: confidentialityAgreement || false,

        backgroundCheck: backgroundCheck || false,
        references: references ? JSON.stringify(references) : null,
        previousEmployers: previousEmployers ? JSON.stringify(previousEmployers) : null,
        criminalRecord: criminalRecord || false,

        personalInterests: personalInterests ? JSON.stringify(personalInterests) : null,
        workPreferences,
        culturalConsiderations,
        personalNotes,
        managerNotes,

        status: status || 'ACTIVE',
        lastContactDate: lastContactDate ? new Date(lastContactDate) : null,
        nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null,
        supervisorId,

        // Document URLs
        photoUrl,
        qidDocumentUrl,
        passportDocumentUrl
      },
      include: {
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true
          }
        },
        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            workType: true,
            status: true
          }
        }
      }
    })

    return NextResponse.json(taskHelper)
  } catch (error) {
    console.error('Update task helper error:', error)
    return NextResponse.json(
      { error: 'Failed to update task helper' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskHelperId = parseInt(params.id)

    // Check if task helper exists
    const existingTaskHelper = await prisma.taskHelper.findUnique({
      where: { id: taskHelperId }
    })

    if (!existingTaskHelper) {
      return NextResponse.json(
        { error: 'Task helper not found' },
        { status: 404 }
      )
    }

    // Delete the task helper
    await prisma.taskHelper.delete({
      where: { id: taskHelperId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete task helper error:', error)
    return NextResponse.json(
      { error: 'Failed to delete task helper' },
      { status: 500 }
    )
  }
}