# Travel Management System - API Documentation

Complete REST API documentation for the Travel Management System.

## Base URL
```
/api/travel
```

---

## 1. Travel Requests

### List All Travel Requests
```http
GET /api/travel/requests
```

**Query Parameters:**
- `status` (optional): Filter by status (REQUEST, PLANNING, CONFIRMING, EXECUTING, COMPLETED, CANCELLED)
- `startDate` (optional): Filter by trip start date (ISO string)
- `endDate` (optional): Filter by trip end date (ISO string)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### Create Travel Request
```http
POST /api/travel/requests
```

**Body:**
```json
{
  "createdById": 1,
  "tripStartDate": "2024-03-01",
  "tripEndDate": "2024-03-10",
  "notes": "Business trip to Dubai"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "requestNumber": "TR-1234567890",
    "status": "REQUEST",
    ...
  }
}
```

### Get Single Travel Request
```http
GET /api/travel/requests/:id
```

### Update Travel Request
```http
PUT /api/travel/requests/:id
```

**Body:**
```json
{
  "tripStartDate": "2024-03-01",
  "tripEndDate": "2024-03-15",
  "status": "PLANNING",
  "changedById": 1,
  "statusChangeNotes": "Updated trip dates"
}
```

### Delete Travel Request
```http
DELETE /api/travel/requests/:id
```

---

## 2. Passengers

### List Passengers
```http
GET /api/travel/passengers?travelRequestId=1
```

**Required Query Parameters:**
- `travelRequestId`: ID of the travel request

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "personType": "EMPLOYEE",
      "personId": 5,
      "isMainPassenger": true,
      "visaStatus": "HAS_VISA",
      "notificationPreference": "ALL",
      "receiveFlightDetails": true,
      "receiveHotelDetails": true,
      "receiveEventDetails": true,
      "receiveItinerary": true,
      "personDetails": {
        "id": 5,
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "type": "EMPLOYEE"
      }
    }
  ],
  "count": 1
}
```

### Add Passenger
```http
POST /api/travel/passengers
```

**Body:**
```json
{
  "travelRequestId": 1,
  "personType": "EMPLOYEE",
  "personId": 5,
  "isMainPassenger": true,
  "visaStatus": "HAS_VISA",
  "visaId": 10,
  "passportId": 15,
  "notificationPreference": "ALL",
  "receiveFlightDetails": true,
  "receiveHotelDetails": true,
  "receiveEventDetails": true,
  "receiveItinerary": true
}
```

### Update Passenger
```http
PUT /api/travel/passengers/:id
```

### Remove Passenger
```http
DELETE /api/travel/passengers/:id
```

---

## 3. Flights

### List Flights
```http
GET /api/travel/flights?travelRequestId=1
```

**Query Parameters:**
- `travelRequestId` (optional): Filter by travel request
- `status` (optional): Filter by status

### Create Flight
```http
POST /api/travel/flights
```

**Body:**
```json
{
  "travelRequestId": 1,
  "flightNumber": "QR123",
  "airline": "Qatar Airways",
  "departureAirport": "DOH",
  "arrivalAirport": "DXB",
  "departureDate": "2024-03-01T10:00:00Z",
  "departureTime": "10:00",
  "arrivalDate": "2024-03-01T11:30:00Z",
  "arrivalTime": "11:30",
  "class": "Business",
  "bookingReference": "ABC123",
  "status": "CONFIRMED",
  "passengers": [
    {
      "personType": "EMPLOYEE",
      "personId": 5,
      "seatNumber": "1A",
      "mealPreference": "Vegetarian"
    }
  ]
}
```

### Get/Update/Delete Flight
```http
GET /api/travel/flights/:id
PUT /api/travel/flights/:id
DELETE /api/travel/flights/:id
```

---

## 4. Hotels

### List Hotels
```http
GET /api/travel/hotels?travelRequestId=1
```

**Query Parameters:**
- `travelRequestId` (optional)
- `status` (optional)
- `city` (optional)

### Create Hotel
```http
POST /api/travel/hotels
```

**Body:**
```json
{
  "travelRequestId": 1,
  "hotelName": "Burj Al Arab",
  "address": "Jumeirah St",
  "city": "Dubai",
  "country": "UAE",
  "phone": "+971...",
  "email": "reservations@burjalarab.com",
  "checkInDate": "2024-03-01",
  "checkOutDate": "2024-03-05",
  "confirmationNumber": "CONF123",
  "status": "CONFIRMED",
  "rooms": [
    {
      "roomCategory": "Deluxe Suite",
      "numberOfRooms": 2,
      "pricePerNight": 500,
      "assignments": [
        {
          "personType": "EMPLOYEE",
          "personId": 5,
          "roomNumber": "1201"
        }
      ]
    }
  ]
}
```

### Get/Update/Delete Hotel
```http
GET /api/travel/hotels/:id
PUT /api/travel/hotels/:id
DELETE /api/travel/hotels/:id
```

---

## 5. Events & Activities

### List Events
```http
GET /api/travel/events?travelRequestId=1
```

**Query Parameters:**
- `travelRequestId` (optional)
- `eventType` (optional): TICKET, PARK, TOUR, RESTAURANT, MEETING, CONFERENCE, SPECIAL_GUIDE, MUSEUM, SHOW, OTHER
- `status` (optional)

### Create Event
```http
POST /api/travel/events
```

**Body:**
```json
{
  "travelRequestId": 1,
  "eventType": "TOUR",
  "eventName": "Desert Safari",
  "description": "Evening desert safari with BBQ dinner",
  "location": "Arabian Desert",
  "city": "Dubai",
  "country": "UAE",
  "eventDate": "2024-03-02",
  "startTime": "15:00",
  "endTime": "21:00",
  "durationHours": 6,
  "pricePerPerson": 150,
  "totalPrice": 300,
  "currency": "USD",
  "bookingReference": "SAFARI123",
  "contactPerson": "Ahmed",
  "contactPhone": "+971...",
  "status": "CONFIRMED"
}
```

### Get/Update/Delete Event
```http
GET /api/travel/events/:id
PUT /api/travel/events/:id
DELETE /api/travel/events/:id
```

---

## 6. Send Details to Passengers ⭐

### Send Travel Details
```http
POST /api/travel/passengers/send-details
```

**Body:**
```json
{
  "travelRequestId": 1,
  "passengerIds": [1, 2, 3],
  "contentTypes": [
    "FLIGHT_DETAILS",
    "HOTEL_DETAILS",
    "EVENT_DETAILS",
    "FULL_ITINERARY"
  ],
  "communicationType": "BOTH",
  "customMessage": "Please find your travel details attached. Safe travels!"
}
```

**Content Types:**
- `FLIGHT_DETAILS` - Flight information
- `PRIVATE_JET_DETAILS` - Private jet information
- `HOTEL_DETAILS` - Hotel booking information
- `EVENT_DETAILS` - Events and activities
- `FULL_ITINERARY` - Complete trip itinerary
- `PASSENGER_LIST` - List of all passengers
- `TRIP_BRIEF` - Brief trip summary
- `CUSTOM` - Custom message

**Communication Types:**
- `EMAIL` - Send via email only
- `WHATSAPP` - Send via WhatsApp only
- `BOTH` - Send via both email and WhatsApp

**Response:**
```json
{
  "success": true,
  "message": "Sent details to 3 recipient(s)",
  "data": {
    "communicationsSent": 6,
    "errors": 0,
    "details": {
      "communications": [...],
      "errors": []
    }
  }
}
```

**Passenger Preferences Respected:**
- Passengers with `notificationPreference: "NONE"` will be skipped
- Passengers with `notificationPreference: "MINIMAL"` only receive essential updates
- Individual content preferences are checked (`receiveFlightDetails`, `receiveHotelDetails`, etc.)

---

## 7. Person Search

### Search Across All Entity Types
```http
GET /api/persons/search?q=john&limit=10
```

**Query Parameters:**
- `q` (required): Search term (minimum 2 characters)
- `limit` (optional): Results per entity type (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "fullName": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "type": "EMPLOYEE"
    },
    {
      "id": 12,
      "fullName": "John Smith",
      "email": "jsmith@company.com",
      "phone": "+9876543210",
      "type": "STAKEHOLDER"
    }
  ],
  "count": 2
}
```

Searches across:
- Employees
- Stakeholders
- Employers
- Task Helpers

---

## Person Types

All passenger-related fields use polymorphic references:

```typescript
personType: "EMPLOYEE" | "STAKEHOLDER" | "EMPLOYER" | "TASK_HELPER"
personId: number
```

---

## Status Workflow

Travel Request statuses follow this workflow:

```
REQUEST → PLANNING → CONFIRMING → EXECUTING → COMPLETED
                                                    ↓
                                               CANCELLED
```

When updating status, a record is automatically created in `TripStatusHistory`.

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

---

## Data Formats

**Dates:**
- Use ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`
- All dates are stored in UTC

**Times:**
- Use 24-hour format: `HH:mm` (e.g., "14:30")

**Currencies:**
- Default: USD
- ISO 4217 currency codes

---

## Integration Notes

### Email/WhatsApp Integration
The send-details endpoint creates communication records with `status: "PENDING"`.

**To integrate:**
1. Listen for new `TripCommunication` records
2. Send via your email service (SendGrid, AWS SES, Resend, etc.)
3. Update record status to `SENT` or `FAILED`
4. Store error message if failed

### Visa Checking
When adding passengers, the system can check for existing visa records.

**To integrate:**
1. Query `Visa` table by passport/person details
2. Check visa validity dates
3. Update `visaStatus`, `visaId`, `visaValidityStart`, `visaValidityEnd`

---

## Next Steps

Additional endpoints that can be added:
- Private Jets CRUD
- Trains CRUD
- Rental Cars CRUD
- Cars with Driver CRUD
- Embassy Services CRUD
- Communication Templates
- Trip Notifications
- Status History
- Itinerary PDF Generation
