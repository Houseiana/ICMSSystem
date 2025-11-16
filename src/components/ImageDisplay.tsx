'use client'

import { useState } from 'react'
import { User, AlertCircle } from 'lucide-react'

interface ImageDisplayProps {
  src: string | null | undefined
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Enhanced image display component with:
 * - Dropbox URL conversion to direct download links
 * - Loading states
 * - Error handling with fallback
 * - Multiple size presets
 */
export default function ImageDisplay({
  src,
  alt = 'Profile Photo',
  size = 'md',
  className = ''
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Convert Dropbox share link to direct download link
  const getDirectImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null

    // Trim whitespace
    url = url.trim()

    // If it's a Dropbox link, convert it to direct download
    if (url.includes('dropbox.com')) {
      let directUrl = url

      // Handle different Dropbox URL formats:
      // 1. https://www.dropbox.com/s/xxxxx/filename?dl=0
      // 2. https://www.dropbox.com/scl/fi/xxxxx/filename?rlkey=xxxxx&dl=0
      // 3. https://dl.dropboxusercontent.com/xxxxx (already direct)

      // If already using dl.dropboxusercontent.com, return as is
      if (directUrl.includes('dl.dropboxusercontent.com')) {
        return directUrl
      }

      // For share links with /s/ or /scl/
      if (directUrl.includes('/s/') || directUrl.includes('/scl/')) {
        // Replace dl=0 with raw=1 for direct image access
        if (directUrl.includes('dl=0')) {
          directUrl = directUrl.replace('dl=0', 'raw=1')
        } else if (directUrl.includes('?')) {
          // Add raw=1 if there are already query params
          directUrl += '&raw=1'
        } else {
          // Add raw=1 as first query param
          directUrl += '?raw=1'
        }
      } else {
        // For other formats, try www.dropbox.com -> dl.dropboxusercontent.com
        directUrl = directUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com')

        // Ensure dl=1 parameter
        if (!directUrl.includes('dl=1')) {
          if (directUrl.includes('?')) {
            directUrl = directUrl.split('?')[0] + '?dl=1'
          } else {
            directUrl += '?dl=1'
          }
        }
      }

      return directUrl
    }

    return url
  }

  const directImageUrl = getDirectImageUrl(src)

  // Size configurations
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  }

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const containerClass = `${sizeClasses[size]} rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 relative ${className}`

  // No image URL provided
  if (!directImageUrl) {
    return (
      <div className={`${containerClass} flex items-center justify-center bg-gray-100`}>
        <User className={`${iconSizes[size]} text-gray-400`} />
      </div>
    )
  }

  // Image load error
  if (hasError) {
    return (
      <div className={`${containerClass} flex flex-col items-center justify-center bg-red-50 border-red-200`}>
        <AlertCircle className={`${iconSizes[size]} text-red-400 mb-2`} />
        <p className="text-xs text-red-600 text-center px-2">Failed to load image</p>
        {process.env.NODE_ENV === 'development' && directImageUrl && (
          <p className="text-xs text-gray-500 text-center px-2 mt-1 break-all">
            Tried: {directImageUrl.substring(0, 50)}...
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={containerClass}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <User className={`${iconSizes[size]} text-gray-300`} />
        </div>
      )}

      {/* Actual image */}
      <img
        src={directImageUrl}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}
