import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import OlaMapPage from '../pages/OlaMapPage'

export const olaMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ola-map/$id',
  component: function OlaMapRouteComponent() {
    const { id } = olaMapRoute.useParams()
    return <OlaMapPage id={id} />
  },
})
