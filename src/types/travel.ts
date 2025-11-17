/**
 * Travel Management System - TypeScript Type Definitions
 */

export type TravelRequestStatus =
  | 'REQUEST'
  | 'PLANNING'
  | 'CONFIRMING'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'CANCELLED'

export type PersonType = 'EMPLOYEE' | 'STAKEHOLDER' | 'EMPLOYER' | 'TASK_HELPER'

export type NotificationPreference = 'ALL' | 'MINIMAL' | 'NONE'

export type CommunicationType = 'EMAIL' | 'WHATSAPP' | 'SMS' | 'BOTH'

export type ContentType =
  | 'FLIGHT_DETAILS'
  | 'PRIVATE_JET_DETAILS'
  | 'HOTEL_DETAILS'
  | 'EVENT_DETAILS'
  | 'FULL_ITINERARY'
  | 'PASSENGER_LIST'
  | 'TRIP_BRIEF'
  | 'CUSTOM'

export type EventType =
  | 'TICKET'
  | 'PARK'
  | 'TOUR'
  | 'RESTAURANT'
  | 'MEETING'
  | 'CONFERENCE'
  | 'SPECIAL_GUIDE'
  | 'MUSEUM'
  | 'SHOW'
  | 'OTHER'

export type VisaStatus =
  | 'NEEDS_VISA'
  | 'HAS_VISA'
  | 'UNDER_PROCESS'
  | 'NOT_REQUIRED'

// Person Details
export interface PersonDetails {
  id: number
  fullName: string
  firstName?: string
  lastName?: string
  email: string | null
  phone: string | null
  type: PersonType
  nationality?: string | null
  dateOfBirth?: Date | null
}

// Travel Request
export interface TravelRequest {
  id: number
  requestNumber: string
  createdById: number | null
  status: TravelRequestStatus
  requestDate: Date
  tripStartDate: Date | null
  tripEndDate: Date | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  destinations?: TripDestination[]
  flights?: TripFlight[]
  privateJets?: TripPrivateJet[]
  trains?: TripTrain[]
  rentalCarsSelfDrive?: TripRentalCarSelfDrive[]
  carsWithDriver?: TripCarWithDriver[]
  embassyServices?: TripEmbassyService[]
  hotels?: TripHotel[]
  events?: TripEvent[]
  passengers?: TripPassenger[]
  communications?: TripCommunication[]
  statusHistory?: TripStatusHistory[]
}

// Destination
export interface TripDestination {
  id: number
  travelRequestId: number
  country: string
  city: string
  orderSequence: number | null
  createdAt: Date
}

// Flight
export interface TripFlight {
  id: number
  travelRequestId: number
  flightNumber: string | null
  airline: string | null
  departureAirport: string | null
  arrivalAirport: string | null
  departureDate: Date | null
  departureTime: string | null
  arrivalDate: Date | null
  arrivalTime: string | null
  class: string | null
  price: number | null
  bookingReference: string | null
  terminal: string | null
  gate: string | null
  seatNumbers: string | null
  baggageAllowance: string | null
  mealPreference: string | null
  status: string
  notes: string | null
  // New flight enhancements
  aircraftModel: string | null
  specialRequests: string | null
  tripType: string | null // ONE_WAY, ROUND_TRIP
  fareTermsConditions: string | null
  // Flight change tracking
  changeStatus: string | null // NO_CHANGE, CHANGE_REQUESTED, CHANGED
  changeDate: Date | null
  changePrice: number | null
  changedDepartureDate: Date | null
  changedDepartureTime: string | null
  changedArrivalDate: Date | null
  changedArrivalTime: string | null
  changeLeg: string | null // OUTBOUND, RETURN, BOTH
  createdAt: Date
  passengers?: TripFlightPassenger[]
}

export interface TripFlightPassenger {
  id: number
  tripFlightId: number
  personType: PersonType
  personId: number
  seatNumber: string | null
  mealPreference: string | null
  specialAssistance: string | null
  createdAt: Date
}

// Private Jet
export interface TripPrivateJet {
  id: number
  travelRequestId: number
  aircraftType: string | null
  operator: string | null
  tailNumber: string | null
  departureAirport: string | null
  arrivalAirport: string | null
  departureDate: Date | null
  departureTime: string | null
  arrivalDate: Date | null
  arrivalTime: string | null
  passengerCapacity: number | null
  amenities: string | null
  cateringDetails: string | null
  bookingReference: string | null
  status: string
  notes: string | null
  createdAt: Date
  passengers?: TripPrivateJetPassenger[]
}

export interface TripPrivateJetPassenger {
  id: number
  tripPrivateJetId: number
  personType: PersonType
  personId: number
  dietaryRequirements: string | null
  specialRequests: string | null
  createdAt: Date
}

// Train
export interface TripTrain {
  id: number
  travelRequestId: number
  trainNumber: string | null
  route: string | null
  departureStation: string | null
  arrivalStation: string | null
  departureDate: Date | null
  departureTime: string | null
  arrivalDate: Date | null
  arrivalTime: string | null
  class: string | null
  bookingReference: string | null
  status: string
  notes: string | null
  createdAt: Date
  passengers?: TripTrainPassenger[]
}

export interface TripTrainPassenger {
  id: number
  tripTrainId: number
  personType: PersonType
  personId: number
  seatNumber: string | null
  createdAt: Date
}

// Rental Car Self-Drive
export interface TripRentalCarSelfDrive {
  id: number
  travelRequestId: number
  driverPersonType: string
  driverPersonId: number
  carType: string | null
  carModel: string | null
  rentalCompany: string | null
  pickupLocation: string | null
  pickupDate: Date | null
  pickupTime: string | null
  returnLocation: string | null
  returnDate: Date | null
  returnTime: string | null
  insuranceType: string | null
  bookingReference: string | null
  status: string
  notes: string | null
  createdAt: Date
}

// Car With Driver
export interface TripCarWithDriver {
  id: number
  travelRequestId: number
  carType: string | null
  rentalCompany: string | null
  driverName: string | null
  driverPhone: string | null
  numberOfPassengers: number | null
  pickupLocation: string | null
  pickupDate: Date | null
  pickupTime: string | null
  returnLocation: string | null
  returnDate: Date | null
  returnTime: string | null
  bookingReference: string | null
  status: string
  notes: string | null
  createdAt: Date
  passengers?: TripCarPassenger[]
}

export interface TripCarPassenger {
  id: number
  tripCarId: number
  personType: PersonType
  personId: number
  createdAt: Date
}

// Embassy Service
export interface TripEmbassyService {
  id: number
  travelRequestId: number
  submissionDate: Date | null
  arrivalContactPerson: string | null
  arrivalContactPhone: string | null
  arrivalContactEmail: string | null
  sameDepartureContact: boolean
  departureContactPerson: string | null
  departureContactPhone: string | null
  departureContactEmail: string | null
  passengersArrivalCount: number | null
  passengersDepartureCount: number | null
  arrivalFlightId: number | null
  departureFlightId: number | null
  arrivalTime: string | null
  departureTime: string | null
  status: string
  notes: string | null
  createdAt: Date
  passengers?: TripEmbassyPassenger[]
  arrivalFlight?: TripFlight
  departureFlight?: TripFlight
}

export interface TripEmbassyPassenger {
  id: number
  embassyServiceId: number
  personType: PersonType
  personId: number
  serviceType: string
  createdAt: Date
}

// Hotel
export interface TripHotel {
  id: number
  travelRequestId: number
  hotelName: string
  address: string | null
  city: string | null
  country: string | null
  phone: string | null
  email: string | null
  checkInDate: Date | null
  checkOutDate: Date | null
  confirmationNumber: string | null
  status: string
  notes: string | null
  createdAt: Date
  rooms?: TripHotelRoom[]
}

export interface TripHotelRoom {
  id: number
  tripHotelId: number
  unitCategory: string // Suite, Room, Apartment, Penthouse, etc.
  roomNumber: string | null
  bathrooms: number | null
  hasPantry: boolean
  guestNumbers: number | null
  bedType: string | null // Twin bed, King bed
  connectedToRoom: string | null
  pricePerNight: number | null
  includesBreakfast: boolean
  createdAt: Date
  assignments?: TripRoomAssignment[]
}

export interface TripRoomAssignment {
  id: number
  tripHotelRoomId: number
  personType: PersonType
  personId: number
  createdAt: Date
}

// Event
export interface TripEvent {
  id: number
  travelRequestId: number
  eventType: EventType
  eventName: string
  description: string | null
  location: string | null
  address: string | null
  city: string | null
  country: string | null
  eventDate: Date | null
  startTime: string | null
  endTime: string | null
  durationHours: number | null
  pricePerPerson: number | null
  totalPrice: number | null
  currency: string
  bookingReference: string | null
  contactPerson: string | null
  contactPhone: string | null
  contactEmail: string | null
  websiteUrl: string | null
  dressCode: string | null
  specialInstructions: string | null
  status: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
  participants?: TripEventParticipant[]
  attachments?: TripEventAttachment[]
}

export interface TripEventParticipant {
  id: number
  tripEventId: number
  personType: PersonType
  personId: number
  ticketNumber: string | null
  specialRequirements: string | null
  createdAt: Date
}

export interface TripEventAttachment {
  id: number
  tripEventId: number
  fileName: string
  fileType: string | null
  fileUrl: string
  fileSize: number | null
  uploadedById: number | null
  uploadedAt: Date
}

// Passenger
export interface TripPassenger {
  id: number
  travelRequestId: number
  personType: PersonType
  personId: number
  isMainPassenger: boolean
  visaStatus: VisaStatus | null
  visaId: number | null
  visaValidityStart: Date | null
  visaValidityEnd: Date | null
  passportId: number | null
  notificationPreference: NotificationPreference
  receiveFlightDetails: boolean
  receiveHotelDetails: boolean
  receiveEventDetails: boolean
  receiveItinerary: boolean
  createdAt: Date
  personDetails?: PersonDetails
}

// Communication
export interface TripCommunication {
  id: number
  travelRequestId: number
  recipientPersonType: PersonType | null
  recipientPersonId: number | null
  communicationType: CommunicationType
  contentType: ContentType | null
  subject: string | null
  message: string | null
  htmlContent: string | null
  sentAt: Date
  status: 'SENT' | 'FAILED' | 'PENDING'
  errorMessage: string | null
}

// Status History
export interface TripStatusHistory {
  id: number
  travelRequestId: number
  oldStatus: string | null
  newStatus: string | null
  changedById: number | null
  changeReason: string | null
  changedAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

export interface SendDetailsRequest {
  travelRequestId: number
  passengerIds: number[]
  contentTypes: ContentType[]
  communicationType: CommunicationType
  customMessage?: string
}

export interface SendDetailsResponse {
  communicationsSent: number
  errors: number
  details: {
    communications: TripCommunication[]
    errors: Array<{
      passengerId?: number
      type?: string
      reason?: string
      error?: string
    }>
  }
}

// Form Types
export interface TravelRequestFormData {
  tripStartDate: string
  tripEndDate: string
  notes?: string
  createdById?: number
}

export interface PassengerFormData {
  personType: PersonType
  personId: number
  isMainPassenger?: boolean
  visaStatus?: VisaStatus
  visaId?: number
  passportId?: number
  notificationPreference?: NotificationPreference
  receiveFlightDetails?: boolean
  receiveHotelDetails?: boolean
  receiveEventDetails?: boolean
  receiveItinerary?: boolean
}

export interface FlightFormData {
  flightNumber?: string
  airline?: string
  departureAirport?: string
  arrivalAirport?: string
  departureDate?: string
  departureTime?: string
  arrivalDate?: string
  arrivalTime?: string
  class?: string
  bookingReference?: string
  status?: string
  notes?: string
  passengers?: {
    personType: PersonType
    personId: number
    seatNumber?: string
    mealPreference?: string
    specialAssistance?: string
  }[]
}

export interface HotelFormData {
  hotelName: string
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  checkInDate?: string
  checkOutDate?: string
  confirmationNumber?: string
  status?: string
  notes?: string
  rooms?: {
    roomCategory: string
    numberOfRooms: number
    pricePerNight?: number
    assignments?: {
      personType: PersonType
      personId: number
      roomNumber?: string
    }[]
  }[]
}

export interface EventFormData {
  eventType: EventType
  eventName: string
  description?: string
  location?: string
  address?: string
  city?: string
  country?: string
  eventDate?: string
  startTime?: string
  endTime?: string
  durationHours?: number
  pricePerPerson?: number
  totalPrice?: number
  currency?: string
  bookingReference?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  websiteUrl?: string
  dressCode?: string
  specialInstructions?: string
  status?: string
  notes?: string
}
