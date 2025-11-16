import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const destinationCountry = searchParams.get('destinationCountry')
    const visaStatus = searchParams.get('visaStatus')
    const personType = searchParams.get('personType')
    const applicationStatus = searchParams.get('applicationStatus')

    const where: any = {}

    if (destinationCountry) {
      where.destinationCountry = destinationCountry
    }

    if (visaStatus) {
      where.visaStatus = visaStatus
    }

    if (personType) {
      where.personType = personType
    }

    if (applicationStatus) {
      where.applicationStatus = applicationStatus
    }

    const visas = await prisma.visa.findMany({
      where,
      orderBy: [
        { destinationCountry: 'asc' },
        { personName: 'asc' }
      ],
    })

    return NextResponse.json(visas)
  } catch (error) {
    console.error('Error fetching visas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      personType,
      personId,
      personName,
      personEmail,
      personNationality,
      destinationCountry,
      countryIcon,
      countryFullName,
      visaStatus,
      visaNumber,
      issuanceDate,
      expiryDate,
      issuanceLocation,
      visaLength,
      lengthType,
      maxStayDuration,
      stayDurationType,
      visaCategory,
      visaType,
      entries,
      applicationDate,
      applicationRef,
      processingTime,
      applicationFee,
      feeCurrency,
      documentsSubmitted,
      documentsRequired,
      photoRequired,
      biometricsRequired,
      interviewRequired,
      embassy,
      embassyLocation,
      embassyContact,
      appointmentDate,
      appointmentTime,
      purposeOfTravel,
      plannedDepartureDate,
      plannedReturnDate,
      accommodationDetails,
      sponsorInformation,
      invitationLetter,
      financialProof,
      bankStatement,
      sponsorSupport,
      insuranceCoverage,
      insuranceProvider,
      previousVisas,
      refusedBefore,
      refusalReason,
      bannedCountries,
      applicationStatus,
      processingStage,
      expectedDecision,
      actualDecision,
      decisionDetails,
      rejectionReason,
      appealPossible,
      appealDeadline,
      reapplicationDate,
      collectionMethod,
      collectionLocation,
      courierTracking,
      passportStatus,
      renewalEligible,
      renewalBefore,
      renewalProcess,
      specialRequirements,
      medicalRequirements,
      vaccinationRequired,
      quarantineRequired,
      covidRequirements,
      internalNotes,
      assignedOfficer,
      priority,
      tags,
      createdBy
    } = body

    if (!personType || !personId || !personName || !destinationCountry || !visaStatus) {
      return NextResponse.json(
        { error: 'Person type, person ID, person name, destination country, and visa status are required' },
        { status: 400 }
      )
    }

    // Allow multiple visa records for the same person and country (for historical tracking)

    const visa = await prisma.visa.create({
      data: {
        personType,
        personId: parseInt(personId),
        personName,
        personEmail,
        personNationality,
        destinationCountry,
        countryIcon,
        countryFullName,
        visaStatus,
        visaNumber,
        issuanceDate: issuanceDate ? new Date(issuanceDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        issuanceLocation,
        visaLength: visaLength ? parseInt(visaLength) : null,
        lengthType: lengthType || 'DAYS',
        maxStayDuration: maxStayDuration ? parseInt(maxStayDuration) : null,
        stayDurationType: stayDurationType || 'DAYS',
        visaCategory,
        visaType,
        entries: entries || 'SINGLE',
        applicationDate: applicationDate ? new Date(applicationDate) : null,
        applicationRef,
        processingTime: processingTime ? parseInt(processingTime) : null,
        applicationFee: applicationFee ? parseFloat(applicationFee) : null,
        feeCurrency: feeCurrency || 'USD',
        documentsSubmitted: documentsSubmitted ? JSON.stringify(documentsSubmitted) : null,
        documentsRequired: documentsRequired ? JSON.stringify(documentsRequired) : null,
        photoRequired: photoRequired ?? true,
        biometricsRequired: biometricsRequired ?? false,
        interviewRequired: interviewRequired ?? false,
        embassy,
        embassyLocation,
        embassyContact,
        appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
        appointmentTime,
        purposeOfTravel,
        plannedDepartureDate: plannedDepartureDate ? new Date(plannedDepartureDate) : null,
        plannedReturnDate: plannedReturnDate ? new Date(plannedReturnDate) : null,
        accommodationDetails,
        sponsorInformation,
        invitationLetter: invitationLetter ?? false,
        financialProof,
        bankStatement: bankStatement ?? false,
        sponsorSupport: sponsorSupport ?? false,
        insuranceCoverage: insuranceCoverage ?? false,
        insuranceProvider,
        previousVisas: previousVisas ? JSON.stringify(previousVisas) : null,
        refusedBefore: refusedBefore ?? false,
        refusalReason,
        bannedCountries: bannedCountries ? JSON.stringify(bannedCountries) : null,
        applicationStatus: applicationStatus || 'DRAFT',
        processingStage,
        expectedDecision: expectedDecision ? new Date(expectedDecision) : null,
        actualDecision: actualDecision ? new Date(actualDecision) : null,
        decisionDetails,
        rejectionReason,
        appealPossible: appealPossible ?? false,
        appealDeadline: appealDeadline ? new Date(appealDeadline) : null,
        reapplicationDate: reapplicationDate ? new Date(reapplicationDate) : null,
        collectionMethod,
        collectionLocation,
        courierTracking,
        passportStatus: passportStatus || 'WITH_APPLICANT',
        renewalEligible: renewalEligible ?? false,
        renewalBefore: renewalBefore ? new Date(renewalBefore) : null,
        renewalProcess,
        specialRequirements,
        medicalRequirements,
        vaccinationRequired: vaccinationRequired ?? false,
        quarantineRequired: quarantineRequired ?? false,
        covidRequirements,
        internalNotes,
        assignedOfficer,
        priority: priority || 'NORMAL',
        tags: tags ? JSON.stringify(tags) : null,
        createdBy
      }
    })

    return NextResponse.json(visa)
  } catch (error) {
    console.error('Create visa error:', error)
    return NextResponse.json(
      { error: 'Failed to create visa' },
      { status: 500 }
    )
  }
}