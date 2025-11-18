/**
 * Comprehensive list of major private jet airports worldwide
 * Organized by region for better navigation
 */

export interface PrivateJetAirport {
  code: string
  name: string
  city: string
  country: string
  region: string
}

export const PRIVATE_JET_AIRPORTS: PrivateJetAirport[] = [
  // NORTH AMERICA - United States
  { code: 'TEB', name: 'Teterboro Airport', city: 'Teterboro', country: 'United States', region: 'North America' },
  { code: 'VNY', name: 'Van Nuys Airport', city: 'Los Angeles', country: 'United States', region: 'North America' },
  { code: 'LUK', name: 'Cincinnati Municipal Lunken Airport', city: 'Cincinnati', country: 'United States', region: 'North America' },
  { code: 'HPN', name: 'Westchester County Airport', city: 'White Plains', country: 'United States', region: 'North America' },
  { code: 'FRG', name: 'Republic Airport', city: 'Farmingdale', country: 'United States', region: 'North America' },
  { code: 'BED', name: 'Laurence G. Hanscom Field', city: 'Bedford', country: 'United States', region: 'North America' },
  { code: 'PDK', name: 'DeKalb-Peachtree Airport', city: 'Atlanta', country: 'United States', region: 'North America' },
  { code: 'APA', name: 'Centennial Airport', city: 'Denver', country: 'United States', region: 'North America' },
  { code: 'SDL', name: 'Scottsdale Airport', city: 'Scottsdale', country: 'United States', region: 'North America' },
  { code: 'DAL', name: 'Dallas Love Field', city: 'Dallas', country: 'United States', region: 'North America' },
  { code: 'HOU', name: 'William P. Hobby Airport', city: 'Houston', country: 'United States', region: 'North America' },
  { code: 'FXE', name: 'Fort Lauderdale Executive Airport', city: 'Fort Lauderdale', country: 'United States', region: 'North America' },
  { code: 'OPA', name: 'Opa-locka Executive Airport', city: 'Miami', country: 'United States', region: 'North America' },
  { code: 'TMB', name: 'Kendall-Tamiami Executive Airport', city: 'Miami', country: 'United States', region: 'North America' },
  { code: 'SNA', name: 'John Wayne Airport', city: 'Orange County', country: 'United States', region: 'North America' },
  { code: 'BUR', name: 'Hollywood Burbank Airport', city: 'Burbank', country: 'United States', region: 'North America' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', region: 'North America' },
  { code: 'SJC', name: 'Norman Y. Mineta San José International Airport', city: 'San José', country: 'United States', region: 'North America' },
  { code: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'United States', region: 'North America' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', region: 'North America' },

  // EUROPE - United Kingdom
  { code: 'LCY', name: 'London City Airport', city: 'London', country: 'United Kingdom', region: 'Europe' },
  { code: 'LTN', name: 'London Luton Airport', city: 'London', country: 'United Kingdom', region: 'Europe' },
  { code: 'BQH', name: 'London Biggin Hill Airport', city: 'London', country: 'United Kingdom', region: 'Europe' },
  { code: 'FAB', name: 'Farnborough Airport', city: 'Farnborough', country: 'United Kingdom', region: 'Europe' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', region: 'Europe' },
  { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', region: 'Europe' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', region: 'Europe' },

  // EUROPE - France
  { code: 'LBG', name: 'Le Bourget Airport', city: 'Paris', country: 'France', region: 'Europe' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', region: 'Europe' },
  { code: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France', region: 'Europe' },
  { code: 'CEQ', name: 'Cannes-Mandelieu Airport', city: 'Cannes', country: 'France', region: 'Europe' },
  { code: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'France', region: 'Europe' },

  // EUROPE - Germany
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', region: 'Europe' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', region: 'Europe' },
  { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', region: 'Europe' },

  // EUROPE - Switzerland
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', region: 'Europe' },
  { code: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', region: 'Europe' },
  { code: 'ACH', name: 'St. Gallen-Altenrhein Airport', city: 'St. Gallen', country: 'Switzerland', region: 'Europe' },

  // EUROPE - Other
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', region: 'Europe' },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', region: 'Europe' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', region: 'Europe' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'Italy', region: 'Europe' },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', region: 'Europe' },
  { code: 'LIN', name: 'Milan Linate Airport', city: 'Milan', country: 'Italy', region: 'Europe' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', region: 'Europe' },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', region: 'Europe' },

  // MIDDLE EAST
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East' },
  { code: 'DWC', name: 'Al Maktoum International Airport', city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East' },
  { code: 'SHJ', name: 'Sharjah International Airport', city: 'Sharjah', country: 'United Arab Emirates', region: 'Middle East' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', region: 'Middle East' },
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', region: 'Middle East' },
  { code: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain', region: 'Middle East' },
  { code: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman', region: 'Middle East' },
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', region: 'Middle East' },
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', region: 'Middle East' },
  { code: 'DMM', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia', region: 'Middle East' },
  { code: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan', region: 'Middle East' },
  { code: 'BEY', name: 'Rafic Hariri International Airport', city: 'Beirut', country: 'Lebanon', region: 'Middle East' },
  { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel', region: 'Middle East' },

  // ASIA - China & Hong Kong
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', region: 'Asia' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', region: 'Asia' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', region: 'Asia' },
  { code: 'CAN', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', country: 'China', region: 'Asia' },

  // ASIA - Singapore & Southeast Asia
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', region: 'Asia' },
  { code: 'SZB', name: 'Sultan Abdul Aziz Shah Airport', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', region: 'Asia' },
  { code: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand', region: 'Asia' },
  { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia', region: 'Asia' },

  // ASIA - Japan
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', region: 'Asia' },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', region: 'Asia' },
  { code: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan', region: 'Asia' },

  // ASIA - India
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', region: 'Asia' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', region: 'Asia' },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India', region: 'Asia' },

  // OCEANIA
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia', region: 'Oceania' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', region: 'Oceania' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', region: 'Oceania' },

  // SOUTH AMERICA
  { code: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', region: 'South America' },
  { code: 'GIG', name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil', region: 'South America' },
  { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina', region: 'South America' },

  // CARIBBEAN
  { code: 'SXM', name: 'Princess Juliana International Airport', city: 'Philipsburg', country: 'Sint Maarten', region: 'Caribbean' },
  { code: 'ANU', name: 'V.C. Bird International Airport', city: 'St. John\'s', country: 'Antigua', region: 'Caribbean' },
  { code: 'BGI', name: 'Grantley Adams International Airport', city: 'Bridgetown', country: 'Barbados', region: 'Caribbean' }
]

// Helper function to get all airport codes and names for dropdown
export const getPrivateJetAirports = (): Array<{ code: string; label: string }> => {
  return PRIVATE_JET_AIRPORTS.map(airport => ({
    code: airport.code,
    label: `${airport.name} (${airport.code}) - ${airport.city}, ${airport.country}`
  })).sort((a, b) => a.label.localeCompare(b.label))
}

// Helper function to search airports
export const searchPrivateJetAirports = (query: string): PrivateJetAirport[] => {
  const lowerQuery = query.toLowerCase()
  return PRIVATE_JET_AIRPORTS.filter(airport =>
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.country.toLowerCase().includes(lowerQuery)
  )
}

// Helper function to get airport by code
export const getAirportByCode = (code: string): PrivateJetAirport | undefined => {
  return PRIVATE_JET_AIRPORTS.find(airport => airport.code === code)
}

// Helper function to get airports by region
export const getAirportsByRegion = (region: string): PrivateJetAirport[] => {
  return PRIVATE_JET_AIRPORTS.filter(airport => airport.region === region)
}

// Get all unique regions
export const getRegions = (): string[] => {
  return Array.from(new Set(PRIVATE_JET_AIRPORTS.map(a => a.region))).sort()
}
