/**
 * StakeholderTravelHistory entity interface
 * Represents travel history records for Stakeholder
 */
export interface IStakeholderTravelHistory {
  id: number

  // Related Stakeholder
  stakeholderId: number

  // Travel Details
  country: string // Destination country
  dateOfEntry: Date // Date entered the country
  dateOfExit?: Date | null // Date left the country (null if still there)
  purposeOfTravel?: string | null // Reason for travel (Business, Tourism, Family, etc.)
  accompanyingPerson?: string | null // Name of person traveling with

  // Additional Information
  city?: string | null // City visited
  accommodation?: string | null // Hotel/place of stay
  notes?: string | null // Additional notes

  // System Fields
  createdAt: Date
  updatedAt: Date
}

/**
 * DTO for creating/updating stakeholder travel history
 */
export interface CreateStakeholderTravelHistoryDTO {
  country: string
  dateOfEntry: Date
  dateOfExit?: Date
  purposeOfTravel?: string
  accompanyingPerson?: string
  city?: string
  accommodation?: string
  notes?: string
}
