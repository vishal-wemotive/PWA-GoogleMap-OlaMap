import { Box, Toolbar, Typography, Alert, Stack, CircularProgress } from '@mui/material'
import { useMemo } from 'react'
import MapComponent from '../components/map/MapComponent'
import { useRouteLocation, useRouteCoordinates } from '../api/useRouteLocation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface GoogleMapPageProps {
  id: string
}

function GoogleMapPage({ id }: GoogleMapPageProps) {
  const {
    data: locationData,
    isLoading: isLocationLoading,
    error: locationError,
  } = useRouteLocation(id)

  const {
    data: coordinatesData,
    isLoading: isCoordinatesLoading,
    error: coordinatesError,
  } = useRouteCoordinates(id)

  const currentLocation = useMemo(() => {
    return locationData?.[0] ?? null
  }, [locationData])

  const routeCoordinates = useMemo(() => {
    return coordinatesData ?? []
  }, [coordinatesData])

  const isLoading = isLocationLoading || isCoordinatesLoading
  const error = locationError || coordinatesError

  return (
    <Box>
      <Toolbar
        sx={{
          backgroundColor: '#1e293b',
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
          mx: -3,
          mt: -4,
        }}
      >
        <Typography variant="h5" sx={{ color: '#fff' }}>
          Route Location View - Tour #{id}
        </Typography>
      </Toolbar>

      {!API_BASE_URL && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          API not configured. Set VITE_API_BASE_URL in your .env file to load route data.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading map data: {error.message}
        </Alert>
      )}

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <MapComponent
          currentLocation={currentLocation}
          routeCoordinates={routeCoordinates}
        />
      )}
    </Box>
  )
}

export default GoogleMapPage
