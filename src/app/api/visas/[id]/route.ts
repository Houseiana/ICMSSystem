import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma/client'
import { fetchPersonDetails } from '@/lib/utils/personHelper'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visaId = parseInt(params.id)

    const visa = await prisma.visa.findUnique({
      where: { id: visaId },
    })

    if (!visa) {
      return NextResponse.json(
        { error: 'Visa not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(visa)
  } catch (error) {
    console.error('Error fetching visa:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visa' },
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
    const visaId = parseInt(params.id)

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
      isActive,
      archiveReason,
      lastModifiedBy
    } = body

    // For archiving operations, we might only send isActive and archiveReason
    const isArchiveOperation = isActive !== undefined && Object.keys(body).length <= 3

    if (!isArchiveOperation && (!personName || !destinationCountry || !visaStatus)) {
      return NextResponse.json(
        { error: 'Person name, destination country, and visa status are required' },
        { status: 400 }
      )
    }

    // Check if visa exists
    const existingVisa = await prisma.visa.findUnique({
      where: { id: visaId }
    })

    if (!existingVisa) {
      return NextResponse.json(
        { error: 'Visa not found' },
        { status: 404 }
      )
    }

    // For archive operations, only update specific fields
    const updateData: any = {}

    if (isArchiveOperation) {
      if (isActive !== undefined) updateData.isActive = isActive
      if (archiveReason !== undefined) updateData.archiveReason = archiveReason
      if (lastModifiedBy !== undefined) updateData.lastModifiedBy = lastModifiedBy
    } else {
      // Full update for normal operations
      updateData.personType = personType || existingVisa.personType
      updateData.personId = personId ? parseInt(personId) : existingVisa.personId
      updateData.personName = personName || existingVisa.personName
      updateData.personEmail = personEmail !== undefined ? personEmail : existingVisa.personEmail
      updateData.personNationality = personNationality !== undefined ? personNationality : existingVisa.personNationality
      updateData.destinationCountry = destinationCountry || existingVisa.destinationCountry
      updateData.countryIcon = countryIcon !== undefined ? countryIcon : existingVisa.countryIcon
      updateData.countryFullName = countryFullName !== undefined ? countryFullName : existingVisa.countryFullName
      updateData.visaStatus = visaStatus || existingVisa.visaStatus
      updateData.visaNumber = visaNumber !== undefined ? visaNumber : existingVisa.visaNumber
      updateData.issuanceDate = issuanceDate ? new Date(issuanceDate) : existingVisa.issuanceDate
      updateData.expiryDate = expiryDate ? new Date(expiryDate) : existingVisa.expiryDate
      updateData.issuanceLocation = issuanceLocation !== undefined ? issuanceLocation : existingVisa.issuanceLocation
      updateData.visaLength = visaLength ? parseInt(visaLength) : existingVisa.visaLength
      updateData.lengthType = lengthType || existingVisa.lengthType
      updateData.maxStayDuration = maxStayDuration ? parseInt(maxStayDuration) : existingVisa.maxStayDuration
      updateData.stayDurationType = stayDurationType || existingVisa.stayDurationType
      updateData.visaCategory = visaCategory !== undefined ? visaCategory : existingVisa.visaCategory
      updateData.visaType = visaType !== undefined ? visaType : existingVisa.visaType
      updateData.entries = entries || existingVisa.entries
      updateData.applicationDate = applicationDate ? new Date(applicationDate) : existingVisa.applicationDate
      updateData.applicationRef = applicationRef !== undefined ? applicationRef : existingVisa.applicationRef
      updateData.processingTime = processingTime ? parseInt(processingTime) : existingVisa.processingTime
      updateData.applicationFee = applicationFee ? parseFloat(applicationFee) : existingVisa.applicationFee
      updateData.feeCurrency = feeCurrency || existingVisa.feeCurrency
      updateData.documentsSubmitted = documentsSubmitted ? JSON.stringify(documentsSubmitted) : existingVisa.documentsSubmitted
      updateData.documentsRequired = documentsRequired ? JSON.stringify(documentsRequired) : existingVisa.documentsRequired
      updateData.photoRequired = photoRequired !== undefined ? photoRequired : existingVisa.photoRequired
      updateData.biometricsRequired = biometricsRequired !== undefined ? biometricsRequired : existingVisa.biometricsRequired
      updateData.interviewRequired = interviewRequired !== undefined ? interviewRequired : existingVisa.interviewRequired
      updateData.embassy = embassy !== undefined ? embassy : existingVisa.embassy
      updateData.embassyLocation = embassyLocation !== undefined ? embassyLocation : existingVisa.embassyLocation
      updateData.embassyContact = embassyContact !== undefined ? embassyContact : existingVisa.embassyContact
      updateData.appointmentDate = appointmentDate ? new Date(appointmentDate) : existingVisa.appointmentDate
      updateData.appointmentTime = appointmentTime !== undefined ? appointmentTime : existingVisa.appointmentTime
      updateData.purposeOfTravel = purposeOfTravel !== undefined ? purposeOfTravel : existingVisa.purposeOfTravel
      updateData.plannedDepartureDate = plannedDepartureDate ? new Date(plannedDepartureDate) : existingVisa.plannedDepartureDate
      updateData.plannedReturnDate = plannedReturnDate ? new Date(plannedReturnDate) : existingVisa.plannedReturnDate
      updateData.accommodationDetails = accommodationDetails !== undefined ? accommodationDetails : existingVisa.accommodationDetails
      updateData.sponsorInformation = sponsorInformation !== undefined ? sponsorInformation : existingVisa.sponsorInformation
      updateData.invitationLetter = invitationLetter !== undefined ? invitationLetter : existingVisa.invitationLetter
      updateData.financialProof = financialProof !== undefined ? financialProof : existingVisa.financialProof
      updateData.bankStatement = bankStatement !== undefined ? bankStatement : existingVisa.bankStatement
      updateData.sponsorSupport = sponsorSupport !== undefined ? sponsorSupport : existingVisa.sponsorSupport
      updateData.insuranceCoverage = insuranceCoverage !== undefined ? insuranceCoverage : existingVisa.insuranceCoverage
      updateData.insuranceProvider = insuranceProvider !== undefined ? insuranceProvider : existingVisa.insuranceProvider
      updateData.previousVisas = previousVisas ? JSON.stringify(previousVisas) : existingVisa.previousVisas
      updateData.refusedBefore = refusedBefore !== undefined ? refusedBefore : existingVisa.refusedBefore
      updateData.refusalReason = refusalReason !== undefined ? refusalReason : existingVisa.refusalReason
      updateData.bannedCountries = bannedCountries ? JSON.stringify(bannedCountries) : existingVisa.bannedCountries
      updateData.applicationStatus = applicationStatus || existingVisa.applicationStatus
      updateData.processingStage = processingStage !== undefined ? processingStage : existingVisa.processingStage
      updateData.expectedDecision = expectedDecision ? new Date(expectedDecision) : existingVisa.expectedDecision
      updateData.actualDecision = actualDecision ? new Date(actualDecision) : existingVisa.actualDecision
      updateData.decisionDetails = decisionDetails !== undefined ? decisionDetails : existingVisa.decisionDetails
      updateData.rejectionReason = rejectionReason !== undefined ? rejectionReason : existingVisa.rejectionReason
      updateData.appealPossible = appealPossible !== undefined ? appealPossible : existingVisa.appealPossible
      updateData.appealDeadline = appealDeadline ? new Date(appealDeadline) : existingVisa.appealDeadline
      updateData.reapplicationDate = reapplicationDate ? new Date(reapplicationDate) : existingVisa.reapplicationDate
      updateData.collectionMethod = collectionMethod !== undefined ? collectionMethod : existingVisa.collectionMethod
      updateData.collectionLocation = collectionLocation !== undefined ? collectionLocation : existingVisa.collectionLocation
      updateData.courierTracking = courierTracking !== undefined ? courierTracking : existingVisa.courierTracking
      updateData.passportStatus = passportStatus || existingVisa.passportStatus
      updateData.renewalEligible = renewalEligible !== undefined ? renewalEligible : existingVisa.renewalEligible
      updateData.renewalBefore = renewalBefore ? new Date(renewalBefore) : existingVisa.renewalBefore
      updateData.renewalProcess = renewalProcess !== undefined ? renewalProcess : existingVisa.renewalProcess
      updateData.specialRequirements = specialRequirements !== undefined ? specialRequirements : existingVisa.specialRequirements
      updateData.medicalRequirements = medicalRequirements !== undefined ? medicalRequirements : existingVisa.medicalRequirements
      updateData.vaccinationRequired = vaccinationRequired !== undefined ? vaccinationRequired : existingVisa.vaccinationRequired
      updateData.quarantineRequired = quarantineRequired !== undefined ? quarantineRequired : existingVisa.quarantineRequired
      updateData.covidRequirements = covidRequirements !== undefined ? covidRequirements : existingVisa.covidRequirements
      updateData.internalNotes = internalNotes !== undefined ? internalNotes : existingVisa.internalNotes
      updateData.assignedOfficer = assignedOfficer !== undefined ? assignedOfficer : existingVisa.assignedOfficer
      updateData.priority = priority || existingVisa.priority
      updateData.tags = tags ? JSON.stringify(tags) : existingVisa.tags
      updateData.isActive = isActive !== undefined ? isActive : existingVisa.isActive
      updateData.archiveReason = archiveReason !== undefined ? archiveReason : existingVisa.archiveReason
      updateData.lastModifiedBy = lastModifiedBy !== undefined ? lastModifiedBy : existingVisa.lastModifiedBy
    }

    const visa = await prisma.visa.update({
      where: { id: visaId },
      data: updateData,
    })

    return NextResponse.json(visa)
  } catch (error) {
    console.error('Update visa error:', error)
    return NextResponse.json(
      { error: 'Failed to update visa' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visaId = parseInt(params.id)

    // Check if visa exists
    const existingVisa = await prisma.visa.findUnique({
      where: { id: visaId }
    })

    if (!existingVisa) {
      return NextResponse.json(
        { error: 'Visa not found' },
        { status: 404 }
      )
    }

    // Delete the visa
    await prisma.visa.delete({
      where: { id: visaId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete visa error:', error)
    return NextResponse.json(
      { error: 'Failed to delete visa' },
      { status: 500 }
    )
  }
}