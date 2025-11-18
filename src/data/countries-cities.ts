/**
 * Comprehensive list of countries and their major cities
 */

export interface Country {
  name: string
  code: string
  cities: string[]
}

export const COUNTRIES: Country[] = [
  {
    name: 'Afghanistan',
    code: 'AF',
    cities: ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Jalalabad']
  },
  {
    name: 'Albania',
    code: 'AL',
    cities: ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Fier']
  },
  {
    name: 'Algeria',
    code: 'DZ',
    cities: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida']
  },
  {
    name: 'Argentina',
    code: 'AR',
    cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata']
  },
  {
    name: 'Australia',
    code: 'AU',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra']
  },
  {
    name: 'Austria',
    code: 'AT',
    cities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck']
  },
  {
    name: 'Bahrain',
    code: 'BH',
    cities: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'Isa Town']
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    cities: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet']
  },
  {
    name: 'Belgium',
    code: 'BE',
    cities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges']
  },
  {
    name: 'Brazil',
    code: 'BR',
    cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte']
  },
  {
    name: 'Canada',
    code: 'CA',
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg']
  },
  {
    name: 'China',
    code: 'CN',
    cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hong Kong', 'Hangzhou', 'Xi\'an']
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
    cities: ['Prague', 'Brno', 'Ostrava', 'Pilsen', 'Liberec']
  },
  {
    name: 'Denmark',
    code: 'DK',
    cities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg']
  },
  {
    name: 'Egypt',
    code: 'EG',
    cities: ['Cairo', 'Alexandria', 'Giza', 'Sharm El-Sheikh', 'Luxor', 'Aswan', 'Hurghada']
  },
  {
    name: 'Finland',
    code: 'FI',
    cities: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu']
  },
  {
    name: 'France',
    code: 'FR',
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux']
  },
  {
    name: 'Germany',
    code: 'DE',
    cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund']
  },
  {
    name: 'Greece',
    code: 'GR',
    cities: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa']
  },
  {
    name: 'India',
    code: 'IN',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
  },
  {
    name: 'Indonesia',
    code: 'ID',
    cities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Bali']
  },
  {
    name: 'Iran',
    code: 'IR',
    cities: ['Tehran', 'Mashhad', 'Isfahan', 'Karaj', 'Shiraz', 'Tabriz']
  },
  {
    name: 'Iraq',
    code: 'IQ',
    cities: ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Najaf', 'Karbala']
  },
  {
    name: 'Ireland',
    code: 'IE',
    cities: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford']
  },
  {
    name: 'Israel',
    code: 'IL',
    cities: ['Jerusalem', 'Tel Aviv', 'Haifa', 'Beersheba', 'Netanya']
  },
  {
    name: 'Italy',
    code: 'IT',
    cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna', 'Genoa']
  },
  {
    name: 'Japan',
    code: 'JP',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe']
  },
  {
    name: 'Jordan',
    code: 'JO',
    cities: ['Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Petra']
  },
  {
    name: 'Kenya',
    code: 'KE',
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']
  },
  {
    name: 'Kuwait',
    code: 'KW',
    cities: ['Kuwait City', 'Hawalli', 'Salmiya', 'Jahra', 'Farwaniya']
  },
  {
    name: 'Lebanon',
    code: 'LB',
    cities: ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Jounieh']
  },
  {
    name: 'Malaysia',
    code: 'MY',
    cities: ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Shah Alam']
  },
  {
    name: 'Mexico',
    code: 'MX',
    cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Cancún', 'Tijuana']
  },
  {
    name: 'Morocco',
    code: 'MA',
    cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir']
  },
  {
    name: 'Netherlands',
    code: 'NL',
    cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven']
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    cities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Queenstown']
  },
  {
    name: 'Nigeria',
    code: 'NG',
    cities: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt']
  },
  {
    name: 'Norway',
    code: 'NO',
    cities: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen']
  },
  {
    name: 'Oman',
    code: 'OM',
    cities: ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur']
  },
  {
    name: 'Pakistan',
    code: 'PK',
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Multan', 'Peshawar']
  },
  {
    name: 'Palestine',
    code: 'PS',
    cities: ['Gaza', 'Ramallah', 'Hebron', 'Nablus', 'Bethlehem']
  },
  {
    name: 'Philippines',
    code: 'PH',
    cities: ['Manila', 'Quezon City', 'Davao', 'Cebu City', 'Makati']
  },
  {
    name: 'Poland',
    code: 'PL',
    cities: ['Warsaw', 'Krakow', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk']
  },
  {
    name: 'Portugal',
    code: 'PT',
    cities: ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Funchal']
  },
  {
    name: 'Qatar',
    code: 'QA',
    cities: ['Doha', 'Al Wakrah', 'Al Rayyan', 'Umm Salal', 'Al Khor', 'Lusail']
  },
  {
    name: 'Russia',
    code: 'RU',
    cities: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Sochi']
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Taif', 'Abha']
  },
  {
    name: 'Singapore',
    code: 'SG',
    cities: ['Singapore']
  },
  {
    name: 'South Africa',
    code: 'ZA',
    cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth']
  },
  {
    name: 'South Korea',
    code: 'KR',
    cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju']
  },
  {
    name: 'Spain',
    code: 'ES',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Málaga', 'Bilbao', 'Granada']
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
    cities: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo']
  },
  {
    name: 'Sweden',
    code: 'SE',
    cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås']
  },
  {
    name: 'Switzerland',
    code: 'CH',
    cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne']
  },
  {
    name: 'Syria',
    code: 'SY',
    cities: ['Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama']
  },
  {
    name: 'Taiwan',
    code: 'TW',
    cities: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan', 'Hsinchu']
  },
  {
    name: 'Thailand',
    code: 'TH',
    cities: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Krabi', 'Koh Samui']
  },
  {
    name: 'Tunisia',
    code: 'TN',
    cities: ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte']
  },
  {
    name: 'Turkey',
    code: 'TR',
    cities: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep']
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Al Ain']
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Liverpool', 'Bristol', 'Leeds']
  },
  {
    name: 'United States',
    code: 'US',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'San Francisco', 'Las Vegas', 'Washington DC', 'Boston', 'Seattle']
  },
  {
    name: 'Vietnam',
    code: 'VN',
    cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Nha Trang', 'Hoi An']
  },
  {
    name: 'Yemen',
    code: 'YE',
    cities: ['Sana\'a', 'Aden', 'Taiz', 'Hodeidah', 'Ibb']
  }
]

// Helper function to get cities for a specific country
export const getCitiesForCountry = (countryName: string): string[] => {
  const country = COUNTRIES.find(c => c.name === countryName)
  return country ? country.cities : []
}

// Helper function to get all country names
export const getCountryNames = (): string[] => {
  return COUNTRIES.map(c => c.name).sort()
}

// Helper function to search countries
export const searchCountries = (query: string): Country[] => {
  const lowerQuery = query.toLowerCase()
  return COUNTRIES.filter(c => c.name.toLowerCase().includes(lowerQuery))
}

// Helper function to search cities across all countries
export const searchCities = (query: string): Array<{ city: string; country: string }> => {
  const lowerQuery = query.toLowerCase()
  const results: Array<{ city: string; country: string }> = []

  COUNTRIES.forEach(country => {
    country.cities.forEach(city => {
      if (city.toLowerCase().includes(lowerQuery)) {
        results.push({ city, country: country.name })
      }
    })
  })

  return results
}
