/**
 * FamilyMember entity interface
 * Represents family member details for Employee
 */
export interface IFamilyMember {
  id: number

  // Personal Details
  firstName: string
  middleName?: string | null
  lastName: string
  dateOfBirth?: Date | null
  placeOfBirth?: string | null
  gender?: string | null
  nationality?: string | null
  occupation?: string | null
  employer?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null

  // Identification
  nationalId?: string | null
  passportNumber?: string | null

  // Health Information
  bloodGroup?: string | null
  medicalConditions?: string | null
  allergies?: string | null

  // Relationship Information
  relationshipType: string // FATHER, MOTHER, SPOUSE, CHILD, SIBLING, GUARDIAN
  isDependent: boolean
  isEmergencyContact: boolean
  dateOfMarriage?: Date | null // Only applicable for SPOUSE relationship

  // Employee Relations
  employeeAsFatherId?: number | null
  employeeAsMotherId?: number | null
  employeeAsSpouseId?: number | null
  employeeAsChildId?: number | null

  // System Fields
  createdAt: Date
  updatedAt: Date
}

/**
 * DTO for creating/updating family member
 */
export interface CreateFamilyMemberDTO {
  firstName: string
  lastName: string
  middleName?: string
  nationality?: string
  dateOfBirth?: Date
  placeOfBirth?: string
  relationshipType: 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD' | 'SIBLING' | 'GUARDIAN'
  dateOfMarriage?: Date // For SPOUSE only
  isDependent?: boolean
  isEmergencyContact?: boolean
}
