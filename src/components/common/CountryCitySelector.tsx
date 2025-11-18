'use client'

import { useState, useEffect } from 'react'
import { getCountryNames, getCitiesForCountry } from '@/data/countries-cities'

interface CountryCitySelectorProps {
  country: string
  city: string
  onCountryChange: (country: string) => void
  onCityChange: (city: string) => void
  countryLabel?: string
  cityLabel?: string
  countryPlaceholder?: string
  cityPlaceholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function CountryCitySelector({
  country,
  city,
  onCountryChange,
  onCityChange,
  countryLabel = 'Country',
  cityLabel = 'City',
  countryPlaceholder = 'Select country...',
  cityPlaceholder = 'Select city...',
  required = false,
  disabled = false,
  className = ''
}: CountryCitySelectorProps) {
  const [countries] = useState<string[]>(getCountryNames())
  const [cities, setCities] = useState<string[]>([])

  // Update cities when country changes
  useEffect(() => {
    if (country) {
      const countryCities = getCitiesForCountry(country)
      setCities(countryCities)

      // Clear city if it's not in the new country's city list
      if (city && !countryCities.includes(city)) {
        onCityChange('')
      }
    } else {
      setCities([])
      onCityChange('')
    }
  }, [country])

  const handleCountryChange = (value: string) => {
    onCountryChange(value)
    // City will be cleared by useEffect
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* Country Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {countryLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
          disabled={disabled}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">{countryPlaceholder}</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* City Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {cityLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={disabled || !country || cities.length === 0}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">{cityPlaceholder}</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {country && cities.length === 0 && (
          <p className="text-xs text-gray-500 mt-1">No cities available for this country</p>
        )}
      </div>
    </div>
  )
}
