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

    // If it's a Dropbox link, convert it to direct download
    if (url.includes('dropbox.com')) {
      // Replace www.dropbox.com with dl.dropboxusercontent.com
      // and ensure it has dl=1 or raw=1 parameter
      let directUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')

      // If it's still using dropbox.com domain, use the dl=1 parameter
      if (directUrl.includes('dropbox.com')) {
        if (directUrl.includes('?')) {
          directUrl = directUrl.split('?')[0] + '?dl=1'
        } else {
          directUrl += '?dl=1'
        }
      }

      // Remove dl=0 if present and replace with dl=1
      directUrl = directUrl.replace('dl=0', 'dl=1')

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
