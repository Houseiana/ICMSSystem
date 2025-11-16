import { useState, useEffect, useCallback } from 'react'
import { TravelRequest, ApiResponse } from '@/types/travel'

export function useTravelRequest(id: number | string) {
  const [data, setData] = useState<TravelRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/travel/requests/${id}`)
      const result: ApiResponse<TravelRequest> = await response.json()

      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch request')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchRequest()
    }
  }, [id, fetchRequest])

  return { data, loading, error, refetch: fetchRequest }
}
