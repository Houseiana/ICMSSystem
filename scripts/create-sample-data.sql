-- Sample Data for Testing
-- Run this to populate the database with test data

-- Insert Sample Employees
INSERT INTO "Employee" (
  "empId", "firstName", "lastName", "fullName", "email",
  "phone", "status", "department", "position", "employmentType",
  "dateOfBirth", "nationality", "gender", "maritalStatus",
  "createdAt", "updatedAt"
) VALUES
(
  'EMP001', 'John', 'Doe', 'John Doe', 'john.doe@company.com',
  '+1234567890', 'ACTIVE', 'Engineering', 'Senior Developer', 'Full-time',
  '1990-01-15', 'USA', 'Male', 'SINGLE',
  NOW(), NOW()
),
(
  'EMP002', 'Jane', 'Smith', 'Jane Smith', 'jane.smith@company.com',
  '+1234567891', 'ACTIVE', 'Sales', 'Sales Manager', 'Full-time',
  '1988-03-20', 'USA', 'Female', 'MARRIED',
  NOW(), NOW()
),
(
  'EMP003', 'Mike', 'Johnson', 'Mike Johnson', 'mike.johnson@company.com',
  '+1234567892', 'ON_LEAVE', 'HR', 'HR Specialist', 'Full-time',
  '1992-07-10', 'Canada', 'Male', 'SINGLE',
  NOW(), NOW()
);

-- Insert Sample Employers (Companies)
INSERT INTO "Employer" (
  "employerType", "companyName", "tradingName", "fullName",
  "registrationNumber", "email", "phone", "industry",
  "status", "relationshipType",
  "createdAt", "updatedAt"
) VALUES
(
  'COMPANY', 'Tech Corp Inc', 'TechCo', 'Tech Corp Inc',
  'REG12345', 'info@techcorp.com', '+1234567890', 'Technology',
  'ACTIVE', 'CLIENT',
  NOW(), NOW()
),
(
  'COMPANY', 'Finance Solutions Ltd', 'FinSol', 'Finance Solutions Ltd',
  'REG12346', 'contact@finsol.com', '+1234567891', 'Finance',
  'ACTIVE', 'VENDOR',
  NOW(), NOW()
);

-- Insert Sample Employers (Individuals)
INSERT INTO "Employer" (
  "employerType", "firstName", "lastName", "fullName",
  "email", "phone", "profession",
  "status", "relationshipType",
  "createdAt", "updatedAt"
) VALUES
(
  'INDIVIDUAL', 'Robert', 'Williams', 'Robert Williams',
  'robert.williams@example.com', '+1234567892', 'Consultant',
  'ACTIVE', 'PARTNER',
  NOW(), NOW()
);

-- Insert Sample Passports
INSERT INTO "Passport" (
  "passportNumber", "issuingCountry", "nationality",
  "firstName", "lastName", "fullName",
  "dateOfBirth", "gender",
  "issueDate", "expiryDate",
  "issuingAuthority", "personType",
  "status",
  "createdAt", "updatedAt"
) VALUES
(
  'P12345678', 'USA', 'USA',
  'John', 'Doe', 'John Doe',
  '1990-01-15', 'Male',
  '2020-01-01', '2030-01-01',
  'US Passport Agency', 'EMPLOYEE',
  'ACTIVE',
  NOW(), NOW()
),
(
  'P87654321', 'Canada', 'Canada',
  'Mike', 'Johnson', 'Mike Johnson',
  '1992-07-10', 'Male',
  '2021-06-01', '2031-06-01',
  'Canadian Passport Office', 'EMPLOYEE',
  'ACTIVE',
  NOW(), NOW()
);

-- Insert Sample Visas
INSERT INTO "Visa" (
  "visaNumber", "visaType", "visaCategory",
  "issuingCountry", "destinationCountry",
  "firstName", "lastName", "fullName",
  "dateOfBirth", "nationality",
  "issueDate", "expiryDate",
  "entryType", "numberOfEntries",
  "personType", "purposeOfVisit",
  "status",
  "createdAt", "updatedAt"
) VALUES
(
  'V12345678', 'Work Visa', 'H-1B',
  'USA', 'USA',
  'Rajesh', 'Kumar', 'Rajesh Kumar',
  '1985-05-15', 'India',
  '2024-01-01', '2027-01-01',
  'Multiple', 999,
  'EMPLOYEE', 'Employment',
  'ACTIVE',
  NOW(), NOW()
);

-- Verify insertions
SELECT 'Employees' AS table_name, COUNT(*) AS count FROM "Employee"
UNION ALL
SELECT 'Employers', COUNT(*) FROM "Employer"
UNION ALL
SELECT 'Passports', COUNT(*) FROM "Passport"
UNION ALL
SELECT 'Visas', COUNT(*) FROM "Visa";
