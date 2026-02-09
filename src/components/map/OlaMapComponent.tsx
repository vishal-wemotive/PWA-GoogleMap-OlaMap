import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import maplibregl, { Map as MapLibreMap, NavigationControl, Marker } from 'maplibre-gl'
import type { RequestParameters, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CircularProgress, Stack } from '@mui/material'
import OlaMapsClient from 'ola-map-sdk'
import type { RouteLocation, MapPosition } from '../../types/routeLocation'
import { createStartMarkerElement, createEndMarkerElement } from './markerIcons'

const API_KEY = import.meta.env.VITE_OLA_MAP_API_KEY || ''
const STYLE_NAME = 'default-light-standard'

const defaultCenter: MapPosition = { lat: 28.6139, lng: 77.209 }

interface OlaMapComponentProps {
  currentLocation: RouteLocation | null
  routeCoordinates: [number, number][]
}

function OlaMapComponent({ currentLocation, routeCoordinates = [] }: OlaMapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Marker[]>([])
  const [styleData, setStyleData] = useState<StyleSpecification | null>(null)
  const [isLoadingStyle, setIsLoadingStyle] = useState(true)

  // Initialize OlaMapsClient
  const olaMapsClient = useMemo(() => {
    if (!API_KEY) return null
    return new OlaMapsClient(API_KEY)
  }, [])

  // Fetch style using ola-map-sdk
  useEffect(() => {
    if (!olaMapsClient) {
      setIsLoadingStyle(false)
      return
    }

    const fetchStyle = async () => {
      try {
        const style = await olaMapsClient.tiles.getStyleDetail(STYLE_NAME)
        setStyleData(style)
      } catch (error) {
        console.error('Error fetching Ola Maps style:', error)
      } finally {
        setIsLoadingStyle(false)
      }
    }

    fetchStyle()
  }, [olaMapsClient])

  const transformRequest = useCallback(
    (url: string): RequestParameters => {
      const newUrl = url.replace('app.olamaps.io', 'api.olamaps.io')
      const separator = newUrl.includes('?') ? '&' : '?'
      return {
        url: `${newUrl}${separator}api_key=${API_KEY}`,
      }
    },
    []
  )

  const currentPosition = useMemo<MapPosition | null>(() => {
    if (currentLocation?.geoLocation?.coordinates?.length === 2) {
      const [lat, lng] = currentLocation.geoLocation.coordinates
      return { lat, lng }
    }
    if (routeCoordinates.length > 0) {
      const [lat, lng] = routeCoordinates[0]
      return { lat, lng }
    }
    return null
  }, [currentLocation, routeCoordinates])

  const polylinePath = useMemo(
    () =>
      routeCoordinates.map(([lat, lng]) => [lng, lat] as [number, number]),
    [routeCoordinates]
  )

  useEffect(() => {
    if (!mapContainer.current || !API_KEY || !styleData) return

    const center = currentPosition
      ? [currentPosition.lng, currentPosition.lat]
      : [defaultCenter.lng, defaultCenter.lat]

    const map = new MapLibreMap({
      container: mapContainer.current,
      style: styleData,
      center: center as [number, number],
      zoom: 14,
      transformRequest,
    })

    map.addControl(
      new NavigationControl({ visualizePitch: false, showCompass: true }),
      'bottom-right'
    )

    map.on('load', () => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      // Add polyline if we have coordinates
      if (polylinePath.length > 1) {
        // Add route line source
        if (!map.getSource('route-line')) {
          map.addSource('route-line', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: polylinePath,
              },
            },
          })

          map.addLayer({
            id: 'route-line-layer',
            type: 'line',
            source: 'route-line',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#2196F3',
              'line-width': 4,
              'line-opacity': 0.8,
            },
          })
        }

        // Add start marker (GPS navigation icon)
        const startMarker = new Marker({ element: createStartMarkerElement() })
          .setLngLat(polylinePath[0])
          .addTo(map)
        markersRef.current.push(startMarker)

        // Add end marker (home icon)
        const endMarker = new Marker({ element: createEndMarkerElement() })
          .setLngLat(polylinePath[polylinePath.length - 1])
          .addTo(map)
        markersRef.current.push(endMarker)

        // Fit map to show all coordinates
        const bounds = polylinePath.reduce(
          (bounds, coord) => bounds.extend(coord as [number, number]),
          new maplibregl.LngLatBounds(polylinePath[0], polylinePath[0])
        )
        map.fitBounds(bounds, { padding: 50 })
      } else if (currentPosition) {
        // Add single marker for current position (GPS navigation icon)
        const marker = new Marker({ element: createStartMarkerElement() })
          .setLngLat([currentPosition.lng, currentPosition.lat])
          .addTo(map)
        markersRef.current.push(marker)
      }
    })

    mapRef.current = map

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [transformRequest, currentPosition, polylinePath, styleData])

  // Update map when data changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    // Update polyline source if it exists
    const source = map.getSource('route-line') as maplibregl.GeoJSONSource | undefined
    if (source && polylinePath.length > 1) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: polylinePath,
        },
      })
    }
  }, [polylinePath])

  if (!API_KEY || isLoadingStyle) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: 'calc(100vh - 180px)',
      }}
    />
  )
}

export default OlaMapComponent
