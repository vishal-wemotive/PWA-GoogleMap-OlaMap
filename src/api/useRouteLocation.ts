import { useQuery } from '@tanstack/react-query'
import type { RouteLocation } from '../types/routeLocation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

async function fetchRouteLocation(tourId: string): Promise<RouteLocation[]> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file')
  }

  const response = await fetch(`${API_BASE_URL}/api/tours/${tourId}/routeLocation`)

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    throw new Error('API returned non-JSON response. Check if the API server is running.')
  }

  if (!response.ok) {
    throw new Error('Failed to fetch route location')
  }

  const data = await response.json()
  return data.data
}

async function fetchRouteCoordinates(tourId: string): Promise<[number, number][]> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file')
  }

  const response = await fetch(`${API_BASE_URL}/api/tours/${tourId}/getTourRoutesCoordinates`)

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    throw new Error('API returned non-JSON response. Check if the API server is running.')
  }

  if (!response.ok) {
    throw new Error('Failed to fetch route coordinates')
  }

  const data = await response.json()
  return data.data
}

export function useRouteLocation(tourId: string) {
  return useQuery({
    queryKey: ['routeLocation', tourId],
    queryFn: () => fetchRouteLocation(tourId),
    enabled: !!tourId && !!API_BASE_URL,
    refetchInterval: 60000,
    retry: false,
  })
}

export function useRouteCoordinates(tourId: string) {
  return useQuery({
    queryKey: ['routeCoordinates', tourId],
    queryFn: () => fetchRouteCoordinates(tourId),
    enabled: !!tourId && !!API_BASE_URL,
    retry: false,
  })
}
