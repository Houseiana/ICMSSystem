import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workType = searchParams.get('workType')
    const status = searchParams.get('status') || 'ACTIVE'
    const country = searchParams.get('country')

    const where: any = {
      status
    }

    if (workType) {
      where.workType = workType
    }

    if (country) {
      where.country = country
    }

    const taskHelpers = await prisma.taskHelper.findMany({
      where,
      orderBy: [
        { workType: 'asc' },
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })

    return NextResponse.json(taskHelpers)
  } catch (error) {
    console.error('Error fetching task helpers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task helpers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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

    // Generate full name
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')

    // Check for existing helper with same email (if provided)
    if (primaryEmail) {
      const existingHelper = await prisma.taskHelper.findUnique({
        where: { primaryEmail }
      })

      if (existingHelper) {
        return NextResponse.json(
          { error: 'Task helper with this email already exists' },
          { status: 409 }
        )
      }
    }

    const taskHelper = await prisma.taskHelper.create({
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
      }
    })

    return NextResponse.json(taskHelper)
  } catch (error) {
    console.error('Create task helper error:', error)
    return NextResponse.json(
      { error: 'Failed to create task helper' },
      { status: 500 }
    )
  }
}