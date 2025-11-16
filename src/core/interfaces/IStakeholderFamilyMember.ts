/**
 * StakeholderFamilyMember entity interface
 * Represents family member details for Stakeholder
 */
export interface IStakeholderFamilyMember {
  id: number

  // Related Stakeholder
  stakeholderAsFatherId?: number | null
  stakeholderAsMotherId?: number | null
  stakeholderAsSpouseId?: number | null

  // Personal Details
  firstName: string
  lastName: string
  nationality?: string | null
  dateOfBirth?: Date | null
  placeOfBirth?: string | null

  // Spouse-specific field
  dateOfMarriage?: Date | null // Only for spouse relationship

  // Relationship Type
  relationshipType: string // FATHER, MOTHER, SPOUSE

  // System Fields
  createdAt: Date
  updatedAt: Date
}

/**
 * DTO for creating/updating stakeholder family member
 */
export interface CreateStakeholderFamilyMemberDTO {
  firstName: string
  lastName: string
  nationality?: string
  dateOfBirth?: Date
  placeOfBirth?: string
  relationshipType: 'FATHER' | 'MOTHER' | 'SPOUSE'
  dateOfMarriage?: Date // For SPOUSE only
}
