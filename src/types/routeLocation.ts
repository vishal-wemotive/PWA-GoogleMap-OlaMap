export interface GeoLocation {
  coordinates: [number, number]
}

export interface RouteLocation {
  geoLocation?: GeoLocation
}

export interface MapPosition {
  lat: number
  lng: number
}
