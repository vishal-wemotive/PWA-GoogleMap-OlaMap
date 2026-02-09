import { rootRoute } from './routes/__root'
import { googleMapRoute } from './routes/google-map.$id'
import { olaMapRoute } from './routes/ola-map.$id'

export const routeTree = rootRoute.addChildren([googleMapRoute, olaMapRoute])
