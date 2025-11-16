import { useState, useEffect, useCallback } from 'react'
import { TravelRequest, ApiResponse } from '@/types/travel'

interface UseTravelRequestsFilters {
  status?: string
  startDate?: string
  endDate?: string
}

export function useTravelRequests(filters?: UseTravelRequestsFilters) {
  const [data, setData] = useState<TravelRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters?.status) params.set('status', filters.status)
      if (filters?.startDate) params.set('startDate', filters.startDate)
      if (filters?.endDate) params.set('endDate', filters.endDate)

      const response = await fetch(`/api/travel/requests?${params}`)
      const result: ApiResponse<TravelRequest[]> = await response.json()

      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch requests')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [filters?.status, filters?.startDate, filters?.endDate])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  return { data, loading, error, refetch: fetchRequests }
}
