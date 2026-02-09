import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import GoogleMapPage from '../pages/GoogleMapPage'

export const googleMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/google-map/$id',
  component: function GoogleMapRouteComponent() {
    const { id } = googleMapRoute.useParams()
    return <GoogleMapPage id={id} />
  },
})
