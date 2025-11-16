import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerType = searchParams.get('ownerType')
    const ownerId = searchParams.get('ownerId')

    let whereClause = {}

    if (ownerType && ownerId) {
      whereClause = {
        ownerType,
        ownerId: parseInt(ownerId)
      }
    }

    const passports = await prisma.passport.findMany({
      where: whereClause,
      include: {
        locationHistory: {
          orderBy: { changeDate: 'desc' },
          take: 5 // Last 5 location changes
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(passports)
  } catch (error) {
    console.error('Error fetching passports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch passports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      // Owner Information
      ownerType,
      ownerId,
      ownerName,
      ownerEmail,
      ownerNationality,

      // Passport Information
      passportNumber,
      issuingCountry,
      countryIcon,
      issuanceDate,
      expiryDate,
      issueLocation,
      passportType = 'REGULAR',

      // Personal Information (from passport)
      firstNameOnPassport,
      lastNameOnPassport,
      fullNameOnPassport,
      dateOfBirth,
      placeOfBirth,
      gender,
      height,
      eyeColor,

      // Passport Status
      status = 'ACTIVE',
      isActive = true,

      // Physical Passport Location Tracking
      currentLocation = 'WITH_OWNER',
      locationDetails,
      locationNotes,

      // Representative Information
      withMainRepresentative = false,
      mainRepresentativeName,
      mainRepresentativeContact,
      mainRepresentativeNotes,

      withMinorRepresentative = false,
      minorRepresentativeName,
      minorRepresentativeContact,
      minorRepresentativeNotes,

      // Security Features
      machineReadableZone,
      chipEnabled = false,
      biometricData = false,
      securityFeatures,

      // Visa Pages & Stamps
      totalPages = 32,
      usedPages = 0,
      availablePages,
      lastStampDate,
      lastStampCountry,

      // Renewal Information
      renewalEligible = false,
      renewalBefore,
      renewalProcess,
      renewalLocation,
      renewalFee,
      renewalFeeCurrency = 'USD',

      // Emergency Information
      emergencyContact,
      bloodType,
      medicalConditions,
      emergencyNotes,

      // Documents & Verification
      photoPath,
      scannedCopyPath,
      verificationStatus = 'PENDING',
      verifiedBy,
      verificationDate,
      verificationNotes,

      // Travel Information
      lastTravelDate,
      frequentDestinations,
      travelRestrictions,
      visaHistory,

      // Administrative
      submittedBy,
      reviewedBy,
      approvedBy,
      rejectionReason,

      // Internal Notes
      publicNotes,
      privateNotes,
      alerts,
      tags,

      // Compliance & Legal
      legalIssues,
      restrictions,
      watchlistStatus,
      sanctionsCheck = false,

      createdBy
    } = body

    // Validation
    if (!ownerType || !ownerId || !ownerName || !passportNumber || !issuingCountry || !issuanceDate || !expiryDate || !firstNameOnPassport || !lastNameOnPassport) {
      return NextResponse.json(
        { error: 'Required fields: ownerType, ownerId, ownerName, passportNumber, issuingCountry, issuanceDate, expiryDate, firstNameOnPassport, lastNameOnPassport' },
        { status: 400 }
      )
    }

    // Check for existing passport number
    const existingPassport = await prisma.passport.findFirst({
      where: {
        passportNumber: passportNumber
      }
    })

    if (existingPassport) {
      return NextResponse.json(
        { error: 'Passport number already exists' },
        { status: 409 }
      )
    }

    // Create passport record
    const passport = await prisma.passport.create({
      data: {
        // Owner Information
        ownerType,
        ownerId: parseInt(ownerId),
        ownerName,
        ownerEmail,
        ownerNationality,

        // Passport Information
        passportNumber,
        issuingCountry,
        countryIcon,
        issuanceDate: new Date(issuanceDate),
        expiryDate: new Date(expiryDate),
        issueLocation,
        passportType,

        // Personal Information (from passport)
        firstNameOnPassport,
        lastNameOnPassport,
        fullNameOnPassport: fullNameOnPassport || `${firstNameOnPassport} ${lastNameOnPassport}`,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        placeOfBirth,
        gender,
        height,
        eyeColor,

        // Passport Status
        status,
        isActive,

        // Physical Passport Location Tracking
        currentLocation,
        locationDetails,
        locationNotes,
        lastLocationUpdate: new Date(),

        // Representative Information
        withMainRepresentative,
        mainRepresentativeName,
        mainRepresentativeContact,
        mainRepresentativeNotes,

        withMinorRepresentative,
        minorRepresentativeName,
        minorRepresentativeContact,
        minorRepresentativeNotes,

        // Security Features
        machineReadableZone,
        chipEnabled,
        biometricData,
        securityFeatures,

        // Visa Pages & Stamps
        totalPages,
        usedPages,
        availablePages: availablePages || (totalPages - usedPages),
        lastStampDate: lastStampDate ? new Date(lastStampDate) : null,
        lastStampCountry,

        // Renewal Information
        renewalEligible,
        renewalBefore: renewalBefore ? new Date(renewalBefore) : null,
        renewalProcess,
        renewalLocation,
        renewalFee,
        renewalFeeCurrency,

        // Emergency Information
        emergencyContact,
        bloodType,
        medicalConditions,
        emergencyNotes,

        // Documents & Verification
        photoPath,
        scannedCopyPath,
        verificationStatus,
        verifiedBy,
        verificationDate: verificationDate ? new Date(verificationDate) : null,
        verificationNotes,

        // Travel Information
        lastTravelDate: lastTravelDate ? new Date(lastTravelDate) : null,
        frequentDestinations,
        travelRestrictions,
        visaHistory,

        // Administrative
        submittedBy,
        reviewedBy,
        approvedBy,
        rejectionReason,

        // Internal Notes
        publicNotes,
        privateNotes,
        alerts,
        tags,

        // Compliance & Legal
        legalIssues,
        restrictions,
        watchlistStatus,
        sanctionsCheck,

        createdBy
      },
      include: {
        locationHistory: true
      }
    })

    // Create initial location history entry
    await prisma.passportLocationHistory.create({
      data: {
        passportId: passport.id,
        toLocation: currentLocation,
        changeReason: 'Initial passport registration',
        changedBy: createdBy,
        notes: `Initial location set to ${currentLocation}`,
        deliveryConfirmed: true
      }
    })

    return NextResponse.json(passport, { status: 201 })
  } catch (error) {
    console.error('Create passport error:', error)
    return NextResponse.json(
      { error: 'Failed to create passport' },
      { status: 500 }
    )
  }
}