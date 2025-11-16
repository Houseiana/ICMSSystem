-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'HR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "empId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT,
    "preferredName" TEXT,
    "email" TEXT NOT NULL,
    "personalEmail" TEXT,
    "phone" TEXT,
    "alternatePhone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "bloodGroup" TEXT,
    "nationality" TEXT,
    "religion" TEXT,
    "languages" TEXT,
    "currentAddress" TEXT,
    "permanentAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "nationalId" TEXT,
    "passportNumber" TEXT,
    "passportExpiry" TIMESTAMP(3),
    "drivingLicense" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "visaStatus" TEXT,
    "visaExpiry" TIMESTAMP(3),
    "emergencyContact1Name" TEXT,
    "emergencyContact1Relation" TEXT,
    "emergencyContact1Phone" TEXT,
    "emergencyContact1Address" TEXT,
    "emergencyContact2Name" TEXT,
    "emergencyContact2Relation" TEXT,
    "emergencyContact2Phone" TEXT,
    "emergencyContact2Address" TEXT,
    "highestEducation" TEXT,
    "university" TEXT,
    "graduationYear" INTEGER,
    "fieldOfStudy" TEXT,
    "certifications" TEXT,
    "skills" TEXT,
    "department" TEXT,
    "position" TEXT,
    "managerId" INTEGER,
    "employerId" INTEGER,
    "salary" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "bankAccount" TEXT,
    "bankName" TEXT,
    "bankBranch" TEXT,
    "taxId" TEXT,
    "socialSecurityNumber" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "confirmationDate" TIMESTAMP(3),
    "terminationDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "employeeType" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "workLocation" TEXT,
    "medicalConditions" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "bloodGroupRh" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "gender" TEXT,
    "nationality" TEXT,
    "occupation" TEXT,
    "employer" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "nationalId" TEXT,
    "passportNumber" TEXT,
    "bloodGroup" TEXT,
    "medicalConditions" TEXT,
    "allergies" TEXT,
    "relationshipType" TEXT NOT NULL,
    "isDependent" BOOLEAN NOT NULL DEFAULT false,
    "isEmergencyContact" BOOLEAN NOT NULL DEFAULT false,
    "employeeAsFatherId" INTEGER,
    "employeeAsMotherId" INTEGER,
    "employeeAsSpouseId" INTEGER,
    "employeeAsChildId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" INTEGER,
    "oldValues" TEXT,
    "newValues" TEXT,
    "adminId" INTEGER,
    "employeeId" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stakeholder" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "preferredName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "alternatePhone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "gender" TEXT,
    "nationality" TEXT,
    "religion" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "nationalId" TEXT,
    "passportNumber" TEXT,
    "occupation" TEXT,
    "employer" TEXT,
    "workAddress" TEXT,
    "bloodGroup" TEXT,
    "medicalConditions" TEXT,
    "allergies" TEXT,
    "notes" TEXT,
    "tags" TEXT,
    "spouseId" INTEGER,
    "fatherId" INTEGER,
    "motherId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StakeholderRelationship" (
    "id" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "description" TEXT,
    "strength" INTEGER,
    "since" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StakeholderRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contractor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "timeZone" TEXT,
    "website" TEXT,
    "mainEmail" TEXT,
    "mainPhone" TEXT,
    "faxNumber" TEXT,
    "services" TEXT,
    "businessHours" TEXT,
    "languages" TEXT,
    "paymentMethods" TEXT,
    "starRating" INTEGER,
    "certifications" TEXT,
    "specialFeatures" TEXT,
    "establishedYear" INTEGER,
    "employeeCount" TEXT,
    "annualRevenue" TEXT,
    "contractType" TEXT,
    "contractStart" TIMESTAMP(3),
    "contractEnd" TIMESTAMP(3),
    "commissionRate" DOUBLE PRECISION,
    "creditTerms" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "tags" TEXT,
    "emergency24h" BOOLEAN NOT NULL DEFAULT false,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractorContact" (
    "id" SERIAL NOT NULL,
    "contractorId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "jobTitle" TEXT,
    "department" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "whatsapp" TEXT,
    "skype" TEXT,
    "preferredContact" TEXT NOT NULL DEFAULT 'EMAIL',
    "bestTimeToCall" TEXT,
    "languages" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "responsibilities" TEXT,
    "authority" TEXT,
    "workingHours" TEXT,
    "emergencyContact" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskHelper" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT,
    "preferredName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "bloodGroup" TEXT,
    "nationality" TEXT,
    "religion" TEXT,
    "languages" TEXT,
    "primaryEmail" TEXT,
    "personalEmail" TEXT,
    "workEmail" TEXT,
    "primaryPhone" TEXT,
    "mobilePhone" TEXT,
    "whatsappNumber" TEXT,
    "homePhone" TEXT,
    "workPhone" TEXT,
    "skypeId" TEXT,
    "telegramId" TEXT,
    "preferredContact" TEXT NOT NULL DEFAULT 'PHONE',
    "currentAddress" TEXT,
    "permanentAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "coordinates" TEXT,
    "nationalId" TEXT,
    "passportNumber" TEXT,
    "passportExpiry" TIMESTAMP(3),
    "drivingLicense" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "visaStatus" TEXT,
    "visaExpiry" TIMESTAMP(3),
    "emergencyContact1Name" TEXT,
    "emergencyContact1Relation" TEXT,
    "emergencyContact1Phone" TEXT,
    "emergencyContact1Address" TEXT,
    "emergencyContact2Name" TEXT,
    "emergencyContact2Relation" TEXT,
    "emergencyContact2Phone" TEXT,
    "emergencyContact2Address" TEXT,
    "workType" TEXT NOT NULL DEFAULT 'INTERNAL',
    "workLocation" TEXT,
    "jobTitle" TEXT,
    "department" TEXT,
    "workDescription" TEXT,
    "skills" TEXT,
    "specializations" TEXT,
    "degreeOfCooperation" TEXT NOT NULL DEFAULT 'HIGH',
    "availability" TEXT,
    "timeZone" TEXT,
    "bestTimeToCall" TEXT,
    "workingHours" TEXT,
    "highestEducation" TEXT,
    "university" TEXT,
    "graduationYear" INTEGER,
    "fieldOfStudy" TEXT,
    "certifications" TEXT,
    "previousExperience" TEXT,
    "paymentType" TEXT,
    "hourlyRate" DOUBLE PRECISION,
    "dailyRate" DOUBLE PRECISION,
    "monthlyRate" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "paymentMethod" TEXT,
    "bankAccount" TEXT,
    "bankName" TEXT,
    "paymentNotes" TEXT,
    "giftsReceived" TEXT,
    "benefitsProvided" TEXT,
    "bonusHistory" TEXT,
    "overallRating" DOUBLE PRECISION,
    "reliability" DOUBLE PRECISION,
    "quality" DOUBLE PRECISION,
    "communication" DOUBLE PRECISION,
    "punctuality" DOUBLE PRECISION,
    "medicalConditions" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "healthInsurance" BOOLEAN NOT NULL DEFAULT false,
    "contractType" TEXT,
    "contractStart" TIMESTAMP(3),
    "contractEnd" TIMESTAMP(3),
    "contractTerms" TEXT,
    "confidentialityAgreement" BOOLEAN NOT NULL DEFAULT false,
    "backgroundCheck" BOOLEAN NOT NULL DEFAULT false,
    "references" TEXT,
    "previousEmployers" TEXT,
    "criminalRecord" BOOLEAN NOT NULL DEFAULT false,
    "personalInterests" TEXT,
    "workPreferences" TEXT,
    "culturalConsiderations" TEXT,
    "personalNotes" TEXT,
    "managerNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "hireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastContactDate" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "supervisorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskHelper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visa" (
    "id" SERIAL NOT NULL,
    "personType" TEXT NOT NULL,
    "personId" INTEGER NOT NULL,
    "personName" TEXT NOT NULL,
    "personEmail" TEXT,
    "personNationality" TEXT,
    "destinationCountry" TEXT NOT NULL,
    "countryIcon" TEXT NOT NULL,
    "countryFullName" TEXT NOT NULL,
    "visaStatus" TEXT NOT NULL,
    "visaNumber" TEXT,
    "issuanceDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "issuanceLocation" TEXT,
    "visaLength" INTEGER,
    "lengthType" TEXT DEFAULT 'DAYS',
    "maxStayDuration" INTEGER,
    "stayDurationType" TEXT DEFAULT 'DAYS',
    "visaCategory" TEXT,
    "visaType" TEXT,
    "entries" TEXT DEFAULT 'SINGLE',
    "applicationDate" TIMESTAMP(3),
    "applicationRef" TEXT,
    "processingTime" INTEGER,
    "applicationFee" DOUBLE PRECISION,
    "feeCurrency" TEXT DEFAULT 'USD',
    "documentsSubmitted" TEXT,
    "documentsRequired" TEXT,
    "photoRequired" BOOLEAN NOT NULL DEFAULT true,
    "biometricsRequired" BOOLEAN NOT NULL DEFAULT false,
    "interviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "embassy" TEXT,
    "embassyLocation" TEXT,
    "embassyContact" TEXT,
    "appointmentDate" TIMESTAMP(3),
    "appointmentTime" TEXT,
    "purposeOfTravel" TEXT,
    "plannedDepartureDate" TIMESTAMP(3),
    "plannedReturnDate" TIMESTAMP(3),
    "accommodationDetails" TEXT,
    "sponsorInformation" TEXT,
    "invitationLetter" BOOLEAN NOT NULL DEFAULT false,
    "financialProof" TEXT,
    "bankStatement" BOOLEAN NOT NULL DEFAULT false,
    "sponsorSupport" BOOLEAN NOT NULL DEFAULT false,
    "insuranceCoverage" BOOLEAN NOT NULL DEFAULT false,
    "insuranceProvider" TEXT,
    "previousVisas" TEXT,
    "refusedBefore" BOOLEAN NOT NULL DEFAULT false,
    "refusalReason" TEXT,
    "bannedCountries" TEXT,
    "applicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "processingStage" TEXT,
    "expectedDecision" TIMESTAMP(3),
    "actualDecision" TIMESTAMP(3),
    "decisionDetails" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "archiveReason" TEXT,
    "rejectionReason" TEXT,
    "appealPossible" BOOLEAN NOT NULL DEFAULT false,
    "appealDeadline" TIMESTAMP(3),
    "reapplicationDate" TIMESTAMP(3),
    "collectionMethod" TEXT,
    "collectionLocation" TEXT,
    "courierTracking" TEXT,
    "passportStatus" TEXT DEFAULT 'WITH_APPLICANT',
    "renewalEligible" BOOLEAN NOT NULL DEFAULT false,
    "renewalBefore" TIMESTAMP(3),
    "renewalProcess" TEXT,
    "specialRequirements" TEXT,
    "medicalRequirements" TEXT,
    "vaccinationRequired" BOOLEAN NOT NULL DEFAULT false,
    "quarantineRequired" BOOLEAN NOT NULL DEFAULT false,
    "covidRequirements" TEXT,
    "internalNotes" TEXT,
    "assignedOfficer" TEXT,
    "priority" TEXT DEFAULT 'NORMAL',
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "lastModifiedBy" TEXT,

    CONSTRAINT "Visa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelHistory" (
    "id" SERIAL NOT NULL,
    "visaId" INTEGER NOT NULL,
    "tripPurpose" TEXT,
    "tripType" TEXT,
    "departureDate" TIMESTAMP(3),
    "arrivalDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),
    "departureCity" TEXT,
    "arrivalCity" TEXT,
    "transportMode" TEXT,
    "flightNumber" TEXT,
    "accommodationType" TEXT,
    "accommodationName" TEXT,
    "accommodationAddress" TEXT,
    "tripStatus" TEXT NOT NULL DEFAULT 'PLANNED',
    "entryPoint" TEXT,
    "exitPoint" TEXT,
    "entryStamp" BOOLEAN NOT NULL DEFAULT false,
    "exitStamp" BOOLEAN NOT NULL DEFAULT false,
    "plannedDuration" INTEGER,
    "actualDuration" INTEGER,
    "stayWithinLimits" BOOLEAN NOT NULL DEFAULT true,
    "reportedToAuthorities" BOOLEAN NOT NULL DEFAULT false,
    "travelingAlone" BOOLEAN NOT NULL DEFAULT true,
    "companions" TEXT,
    "estimatedCost" DOUBLE PRECISION,
    "actualCost" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'USD',
    "fundingSource" TEXT,
    "documents" TEXT,
    "insuranceDetails" TEXT,
    "emergencyContactLocal" TEXT,
    "emergencyContactHome" TEXT,
    "vaccinationsRequired" TEXT,
    "healthDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "quarantineRequired" BOOLEAN NOT NULL DEFAULT false,
    "quarantineDuration" INTEGER,
    "immigrationIssues" BOOLEAN NOT NULL DEFAULT false,
    "immigrationNotes" TEXT,
    "customsIssues" BOOLEAN NOT NULL DEFAULT false,
    "customsNotes" TEXT,
    "returnReason" TEXT,
    "extendedStay" BOOLEAN NOT NULL DEFAULT false,
    "extensionDetails" TEXT,
    "tripNotes" TEXT,
    "lessonsLearned" TEXT,
    "wouldRecommend" BOOLEAN,
    "overallRating" DOUBLE PRECISION,
    "createdBy" TEXT,
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employer" (
    "id" SERIAL NOT NULL,
    "employerType" TEXT NOT NULL DEFAULT 'COMPANY',
    "companyName" TEXT,
    "tradingName" TEXT,
    "legalName" TEXT,
    "companyType" TEXT,
    "industry" TEXT,
    "businessNature" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT,
    "preferredName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "gender" TEXT,
    "maritalStatus" TEXT,
    "nationality" TEXT,
    "profession" TEXT,
    "registrationNumber" TEXT,
    "taxId" TEXT,
    "vatNumber" TEXT,
    "licenseNumber" TEXT,
    "incorporationDate" TIMESTAMP(3),
    "primaryEmail" TEXT,
    "secondaryEmail" TEXT,
    "mainPhone" TEXT,
    "alternatePhone" TEXT,
    "faxNumber" TEXT,
    "website" TEXT,
    "headOfficeAddress" TEXT,
    "mailingAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "timeZone" TEXT,
    "establishedYear" INTEGER,
    "employeeCount" TEXT,
    "annualRevenue" TEXT,
    "marketCap" TEXT,
    "stockSymbol" TEXT,
    "publiclyListed" BOOLEAN NOT NULL DEFAULT false,
    "businessHours" TEXT,
    "operatingCountries" TEXT,
    "languages" TEXT,
    "currencies" TEXT,
    "creditRating" TEXT,
    "certifications" TEXT,
    "awards" TEXT,
    "accreditations" TEXT,
    "bankName" TEXT,
    "bankAddress" TEXT,
    "accountNumber" TEXT,
    "routingNumber" TEXT,
    "swiftCode" TEXT,
    "paymentTerms" TEXT,
    "relationshipType" TEXT,
    "relationshipStart" TIMESTAMP(3),
    "contractValue" DOUBLE PRECISION,
    "paymentHistory" TEXT,
    "ceoName" TEXT,
    "ceoEmail" TEXT,
    "hrContactName" TEXT,
    "hrContactEmail" TEXT,
    "hrContactPhone" TEXT,
    "financeContactName" TEXT,
    "financeContactEmail" TEXT,
    "legalStructure" TEXT,
    "regulatoryBody" TEXT,
    "complianceNotes" TEXT,
    "auditFirm" TEXT,
    "legalRepresentative" TEXT,
    "overallRating" DOUBLE PRECISION,
    "reliabilityRating" DOUBLE PRECISION,
    "qualityRating" DOUBLE PRECISION,
    "paymentRating" DOUBLE PRECISION,
    "communicationRating" DOUBLE PRECISION,
    "benefits" TEXT,
    "salaryRange" TEXT,
    "bonusStructure" TEXT,
    "pensionScheme" BOOLEAN NOT NULL DEFAULT false,
    "healthInsurance" BOOLEAN NOT NULL DEFAULT false,
    "workCulture" TEXT,
    "remoteWorkPolicy" TEXT,
    "diversityPolicy" TEXT,
    "trainingPrograms" TEXT,
    "careerDevelopment" TEXT,
    "csrActivities" TEXT,
    "environmentalPolicy" TEXT,
    "sustainabilityRating" TEXT,
    "charitableActivities" TEXT,
    "technologyStack" TEXT,
    "systemsUsed" TEXT,
    "digitalization" TEXT,
    "innovationIndex" DOUBLE PRECISION,
    "riskLevel" TEXT DEFAULT 'LOW',
    "riskFactors" TEXT,
    "creditLimit" DOUBLE PRECISION,
    "insuranceCoverage" DOUBLE PRECISION,
    "documents" TEXT,
    "contracts" TEXT,
    "proposals" TEXT,
    "reports" TEXT,
    "preferredContactMethod" TEXT DEFAULT 'EMAIL',
    "communicationSchedule" TEXT,
    "escalationProcess" TEXT,
    "keyDecisionMakers" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "onboardingStatus" TEXT,
    "lastInteraction" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "publicNotes" TEXT,
    "privateNotes" TEXT,
    "tags" TEXT,
    "alerts" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "lastModifiedBy" TEXT,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerContact" (
    "id" SERIAL NOT NULL,
    "employerId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT,
    "preferredName" TEXT,
    "jobTitle" TEXT,
    "department" TEXT,
    "level" TEXT,
    "workEmail" TEXT,
    "personalEmail" TEXT,
    "workPhone" TEXT,
    "mobilePhone" TEXT,
    "directLine" TEXT,
    "extension" TEXT,
    "whatsappNumber" TEXT,
    "skypeId" TEXT,
    "linkedinProfile" TEXT,
    "reportsTo" TEXT,
    "yearsAtCompany" INTEGER,
    "totalExperience" INTEGER,
    "education" TEXT,
    "certifications" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "responsibilities" TEXT,
    "decisionAuthority" TEXT,
    "budgetAuthority" DOUBLE PRECISION,
    "signatoryPower" BOOLEAN NOT NULL DEFAULT false,
    "preferredContact" TEXT NOT NULL DEFAULT 'EMAIL',
    "preferredTime" TEXT,
    "timeZone" TEXT,
    "workingHours" TEXT,
    "availabilityNotes" TEXT,
    "communicationStyle" TEXT,
    "languages" TEXT,
    "culturalNotes" TEXT,
    "personalInterests" TEXT,
    "relationshipStrength" TEXT DEFAULT 'NEUTRAL',
    "lastContact" TIMESTAMP(3),
    "contactFrequency" TEXT,
    "personalNotes" TEXT,
    "birthDate" TIMESTAMP(3),
    "isEmergencyContact" BOOLEAN NOT NULL DEFAULT false,
    "backupContact" TEXT,
    "outOfOfficeDelegate" TEXT,
    "responsivenessRating" DOUBLE PRECISION,
    "helpfulnessRating" DOUBLE PRECISION,
    "professionalismRating" DOUBLE PRECISION,
    "knowledgeRating" DOUBLE PRECISION,
    "influenceLevel" TEXT DEFAULT 'MEDIUM',
    "cooperationLevel" TEXT DEFAULT 'GOOD',
    "negotiationStyle" TEXT,
    "decisionMakingStyle" TEXT,
    "hasSystemAccess" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" TEXT,
    "securityClearance" TEXT,
    "ndaSigned" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "replacedBy" TEXT,
    "lastMeetingDate" TIMESTAMP(3),
    "meetingFrequency" TEXT,
    "preferredMeetingType" TEXT,
    "meetingNotes" TEXT,
    "specialRequirements" TEXT,
    "accessibilityNeeds" TEXT,
    "dietaryRestrictions" TEXT,
    "allergies" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "lastModifiedBy" TEXT,

    CONSTRAINT "EmployerContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passport" (
    "id" SERIAL NOT NULL,
    "ownerType" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "ownerNationality" TEXT,
    "passportNumber" TEXT NOT NULL,
    "issuingCountry" TEXT NOT NULL,
    "countryIcon" TEXT,
    "issuanceDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "issueLocation" TEXT,
    "passportType" TEXT DEFAULT 'REGULAR',
    "firstNameOnPassport" TEXT NOT NULL,
    "lastNameOnPassport" TEXT NOT NULL,
    "fullNameOnPassport" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "gender" TEXT,
    "height" TEXT,
    "eyeColor" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "currentLocation" TEXT NOT NULL DEFAULT 'WITH_OWNER',
    "locationDetails" TEXT,
    "lastLocationUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationNotes" TEXT,
    "withMainRepresentative" BOOLEAN NOT NULL DEFAULT false,
    "mainRepresentativeName" TEXT,
    "mainRepresentativeContact" TEXT,
    "mainRepresentativeNotes" TEXT,
    "withMinorRepresentative" BOOLEAN NOT NULL DEFAULT false,
    "minorRepresentativeName" TEXT,
    "minorRepresentativeContact" TEXT,
    "minorRepresentativeNotes" TEXT,
    "machineReadableZone" TEXT,
    "chipEnabled" BOOLEAN NOT NULL DEFAULT false,
    "biometricData" BOOLEAN NOT NULL DEFAULT false,
    "securityFeatures" TEXT,
    "totalPages" INTEGER DEFAULT 32,
    "usedPages" INTEGER DEFAULT 0,
    "availablePages" INTEGER,
    "lastStampDate" TIMESTAMP(3),
    "lastStampCountry" TEXT,
    "renewalEligible" BOOLEAN NOT NULL DEFAULT false,
    "renewalBefore" TIMESTAMP(3),
    "renewalProcess" TEXT,
    "renewalLocation" TEXT,
    "renewalFee" DOUBLE PRECISION,
    "renewalFeeCurrency" TEXT DEFAULT 'USD',
    "emergencyContact" TEXT,
    "bloodType" TEXT,
    "medicalConditions" TEXT,
    "emergencyNotes" TEXT,
    "photoPath" TEXT,
    "scannedCopyPath" TEXT,
    "verificationStatus" TEXT DEFAULT 'PENDING',
    "verifiedBy" TEXT,
    "verificationDate" TIMESTAMP(3),
    "verificationNotes" TEXT,
    "lastTravelDate" TIMESTAMP(3),
    "frequentDestinations" TEXT,
    "travelRestrictions" TEXT,
    "visaHistory" TEXT,
    "submittedBy" TEXT,
    "reviewedBy" TEXT,
    "approvedBy" TEXT,
    "rejectionReason" TEXT,
    "publicNotes" TEXT,
    "privateNotes" TEXT,
    "alerts" TEXT,
    "tags" TEXT,
    "legalIssues" TEXT,
    "restrictions" TEXT,
    "watchlistStatus" TEXT,
    "sanctionsCheck" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "lastModifiedBy" TEXT,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassportLocationHistory" (
    "id" SERIAL NOT NULL,
    "passportId" INTEGER NOT NULL,
    "fromLocation" TEXT,
    "toLocation" TEXT NOT NULL,
    "changeDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT,
    "changeReason" TEXT,
    "authorizedBy" TEXT,
    "receivedBy" TEXT,
    "handedBy" TEXT,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "estimatedDelivery" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    "deliveryConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "signedBy" TEXT,
    "photoEvidence" TEXT,
    "notes" TEXT,
    "urgency" TEXT DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PassportLocationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_empId_key" ON "Employee"("empId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_employeeAsFatherId_key" ON "FamilyMember"("employeeAsFatherId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_employeeAsMotherId_key" ON "FamilyMember"("employeeAsMotherId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_employeeAsSpouseId_key" ON "FamilyMember"("employeeAsSpouseId");

-- CreateIndex
CREATE UNIQUE INDEX "Stakeholder_email_key" ON "Stakeholder"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stakeholder_spouseId_key" ON "Stakeholder"("spouseId");

-- CreateIndex
CREATE UNIQUE INDEX "StakeholderRelationship_fromId_toId_relationshipType_key" ON "StakeholderRelationship"("fromId", "toId", "relationshipType");

-- CreateIndex
CREATE INDEX "Contractor_type_idx" ON "Contractor"("type");

-- CreateIndex
CREATE INDEX "Contractor_country_city_idx" ON "Contractor"("country", "city");

-- CreateIndex
CREATE UNIQUE INDEX "TaskHelper_primaryEmail_key" ON "TaskHelper"("primaryEmail");

-- CreateIndex
CREATE INDEX "TaskHelper_workType_idx" ON "TaskHelper"("workType");

-- CreateIndex
CREATE INDEX "TaskHelper_status_idx" ON "TaskHelper"("status");

-- CreateIndex
CREATE INDEX "TaskHelper_country_city_idx" ON "TaskHelper"("country", "city");

-- CreateIndex
CREATE INDEX "Visa_destinationCountry_idx" ON "Visa"("destinationCountry");

-- CreateIndex
CREATE INDEX "Visa_visaStatus_idx" ON "Visa"("visaStatus");

-- CreateIndex
CREATE INDEX "Visa_personType_personId_idx" ON "Visa"("personType", "personId");

-- CreateIndex
CREATE INDEX "Visa_applicationStatus_idx" ON "Visa"("applicationStatus");

-- CreateIndex
CREATE INDEX "Visa_expiryDate_idx" ON "Visa"("expiryDate");

-- CreateIndex
CREATE INDEX "Visa_isActive_idx" ON "Visa"("isActive");

-- CreateIndex
CREATE INDEX "TravelHistory_visaId_idx" ON "TravelHistory"("visaId");

-- CreateIndex
CREATE INDEX "TravelHistory_departureDate_idx" ON "TravelHistory"("departureDate");

-- CreateIndex
CREATE INDEX "TravelHistory_tripStatus_idx" ON "TravelHistory"("tripStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Employer_registrationNumber_key" ON "Employer"("registrationNumber");

-- CreateIndex
CREATE INDEX "Employer_employerType_idx" ON "Employer"("employerType");

-- CreateIndex
CREATE INDEX "Employer_industry_idx" ON "Employer"("industry");

-- CreateIndex
CREATE INDEX "Employer_relationshipType_idx" ON "Employer"("relationshipType");

-- CreateIndex
CREATE INDEX "Employer_status_idx" ON "Employer"("status");

-- CreateIndex
CREATE INDEX "Employer_country_city_idx" ON "Employer"("country", "city");

-- CreateIndex
CREATE INDEX "Employer_establishedYear_idx" ON "Employer"("establishedYear");

-- CreateIndex
CREATE INDEX "Employer_employeeCount_idx" ON "Employer"("employeeCount");

-- CreateIndex
CREATE INDEX "EmployerContact_department_idx" ON "EmployerContact"("department");

-- CreateIndex
CREATE INDEX "EmployerContact_level_idx" ON "EmployerContact"("level");

-- CreateIndex
CREATE INDEX "EmployerContact_isPrimary_idx" ON "EmployerContact"("isPrimary");

-- CreateIndex
CREATE INDEX "EmployerContact_status_idx" ON "EmployerContact"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Passport_passportNumber_key" ON "Passport"("passportNumber");

-- CreateIndex
CREATE INDEX "Passport_ownerType_ownerId_idx" ON "Passport"("ownerType", "ownerId");

-- CreateIndex
CREATE INDEX "Passport_passportNumber_idx" ON "Passport"("passportNumber");

-- CreateIndex
CREATE INDEX "Passport_issuingCountry_idx" ON "Passport"("issuingCountry");

-- CreateIndex
CREATE INDEX "Passport_expiryDate_idx" ON "Passport"("expiryDate");

-- CreateIndex
CREATE INDEX "Passport_status_idx" ON "Passport"("status");

-- CreateIndex
CREATE INDEX "Passport_currentLocation_idx" ON "Passport"("currentLocation");

-- CreateIndex
CREATE INDEX "Passport_isActive_idx" ON "Passport"("isActive");

-- CreateIndex
CREATE INDEX "PassportLocationHistory_passportId_idx" ON "PassportLocationHistory"("passportId");

-- CreateIndex
CREATE INDEX "PassportLocationHistory_changeDate_idx" ON "PassportLocationHistory"("changeDate");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_employeeAsFatherId_fkey" FOREIGN KEY ("employeeAsFatherId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_employeeAsMotherId_fkey" FOREIGN KEY ("employeeAsMotherId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_employeeAsSpouseId_fkey" FOREIGN KEY ("employeeAsSpouseId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_employeeAsChildId_fkey" FOREIGN KEY ("employeeAsChildId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_spouseId_fkey" FOREIGN KEY ("spouseId") REFERENCES "Stakeholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "Stakeholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD CONSTRAINT "Stakeholder_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Stakeholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderRelationship" ADD CONSTRAINT "StakeholderRelationship_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Stakeholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StakeholderRelationship" ADD CONSTRAINT "StakeholderRelationship_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Stakeholder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractorContact" ADD CONSTRAINT "ContractorContact_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskHelper" ADD CONSTRAINT "TaskHelper_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "TaskHelper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelHistory" ADD CONSTRAINT "TravelHistory_visaId_fkey" FOREIGN KEY ("visaId") REFERENCES "Visa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerContact" ADD CONSTRAINT "EmployerContact_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassportLocationHistory" ADD CONSTRAINT "PassportLocationHistory_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "Passport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
