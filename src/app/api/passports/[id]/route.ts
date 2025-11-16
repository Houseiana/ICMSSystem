import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const passport = await prisma.passport.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        locationHistory: {
          orderBy: { changeDate: 'desc' }
        }
      }
    })

    if (!passport) {
      return NextResponse.json(
        { error: 'Passport not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(passport)
  } catch (error) {
    console.error('Error fetching passport:', error)
    return NextResponse.json(
      { error: 'Failed to fetch passport' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const passportId = parseInt(params.id)

    // Check if passport exists
    const existingPassport = await prisma.passport.findUnique({
      where: { id: passportId }
    })

    if (!existingPassport) {
      return NextResponse.json(
        { error: 'Passport not found' },
        { status: 404 }
      )
    }

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
      passportType,

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
      status,
      isActive,

      // Physical Passport Location Tracking
      currentLocation,
      locationDetails,
      locationNotes,

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
      availablePages,
      lastStampDate,
      lastStampCountry,

      // Renewal Information
      renewalEligible,
      renewalBefore,
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
      sanctionsCheck,

      // Location Change Tracking (for history)
      changeReason,
      receivedBy,
      handedBy,
      deliveryDate,
      deliveryTime,

      lastModifiedBy
    } = body

    // Check location change and create history if needed
    let shouldCreateLocationHistory = false
    if (currentLocation && existingPassport.currentLocation !== currentLocation) {
      shouldCreateLocationHistory = true
    }

    // Update passport
    const updatedPassport = await prisma.passport.update({
      where: { id: passportId },
      data: {
        // Owner Information
        ownerType,
        ownerId: ownerId ? parseInt(ownerId) : undefined,
        ownerName,
        ownerEmail,
        ownerNationality,

        // Passport Information
        passportNumber,
        issuingCountry,
        countryIcon,
        issuanceDate: issuanceDate ? new Date(issuanceDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        issueLocation,
        passportType,

        // Personal Information (from passport)
        firstNameOnPassport,
        lastNameOnPassport,
        fullNameOnPassport,
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
        lastLocationUpdate: shouldCreateLocationHistory ? new Date() : undefined,

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
        availablePages,
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

        lastModifiedBy
      },
      include: {
        locationHistory: {
          orderBy: { changeDate: 'desc' },
          take: 5
        }
      }
    })

    // Create location history entry if location changed
    if (shouldCreateLocationHistory) {
      // Combine delivery date and time into a single DateTime
      let actualDeliveryDateTime = null
      if (deliveryDate) {
        const dateTime = deliveryTime ? `${deliveryDate}T${deliveryTime}:00` : `${deliveryDate}T00:00:00`
        actualDeliveryDateTime = new Date(dateTime)
      }

      await prisma.passportLocationHistory.create({
        data: {
          passportId: passportId,
          fromLocation: existingPassport.currentLocation,
          toLocation: currentLocation,
          changeReason: changeReason || 'Location updated',
          changedBy: lastModifiedBy,
          receivedBy: receivedBy || null,
          handedBy: handedBy || null,
          actualDelivery: actualDeliveryDateTime,
          deliveryConfirmed: !!(receivedBy && actualDeliveryDateTime),
          signedBy: receivedBy || null,
          notes: locationNotes || `Location changed from ${existingPassport.currentLocation} to ${currentLocation}`,
          urgency: 'NORMAL'
        }
      })
    }

    return NextResponse.json(updatedPassport)
  } catch (error) {
    console.error('Update passport error:', error)
    return NextResponse.json(
      { error: 'Failed to update passport' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const passportId = parseInt(params.id)

    // Check if passport exists
    const existingPassport = await prisma.passport.findUnique({
      where: { id: passportId }
    })

    if (!existingPassport) {
      return NextResponse.json(
        { error: 'Passport not found' },
        { status: 404 }
      )
    }

    // Delete passport (this will cascade delete location history)
    await prisma.passport.delete({
      where: { id: passportId }
    })

    return NextResponse.json(
      { message: 'Passport deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete passport error:', error)
    return NextResponse.json(
      { error: 'Failed to delete passport' },
      { status: 500 }
    )
  }
}