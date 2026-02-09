import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api'
import { useMemo } from 'react'
import { CircularProgress, Stack } from '@mui/material'
import type { RouteLocation, MapPosition } from '../../types/routeLocation'
import { startIconUrl, endIconUrl } from './markerIcons'

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 180px)',
}

const defaultCenter: MapPosition = { lat: 28.6139, lng: 77.209 }

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
}

interface MapComponentProps {
  currentLocation: RouteLocation | null
  routeCoordinates: [number, number][]
}

function MapComponent({ currentLocation, routeCoordinates = [] }: MapComponentProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY || '',
  })

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
      routeCoordinates.map(([lat, lng]) => ({
        lat,
        lng,
      })),
    [routeCoordinates]
  )

  const startIcon = useMemo(() => {
    if (!isLoaded) return undefined
    return {
      url: startIconUrl,
      scaledSize: new window.google.maps.Size(40, 40),
    }
  }, [isLoaded])

  const endIcon = useMemo(() => {
    if (!isLoaded) return undefined
    return {
      url: endIconUrl,
      scaledSize: new window.google.maps.Size(30, 30),
    }
  }, [isLoaded])

  const polylineOptions = useMemo(
    () => ({
      strokeColor: '#2196F3',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    }),
    []
  )

  if (!isLoaded) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition ?? defaultCenter}
      zoom={14}
      options={mapOptions}
    >
      {currentPosition && polylinePath.length === 0 && (
        <Marker position={currentPosition} icon={startIcon} />
      )}

      {polylinePath.length > 1 && (
        <>
          <Polyline path={polylinePath} options={polylineOptions} />
          <Marker position={polylinePath[0]} icon={startIcon} />
          <Marker position={polylinePath[polylinePath.length - 1]} icon={endIcon} />
        </>
      )}
    </GoogleMap>
  )
}

export default MapComponent
