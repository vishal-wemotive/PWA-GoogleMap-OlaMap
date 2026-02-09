declare module 'ola-map-sdk' {
  interface PlacesApi {
    autocomplete(query: string, options?: Record<string, unknown>): Promise<{
      predictions: Array<{
        description: string
        place_id: string
        geometry: {
          location: {
            lat: number
            lng: number
          }
        }
      }>
    }>
    geocode(address: string): Promise<unknown>
    reverseGeocode(lat: number, lng: number): Promise<unknown>
  }

  interface TilesApi {
    getStyles(): Promise<unknown>
    getStyleDetail(styleName: string): Promise<import('maplibre-gl').StyleSpecification>
    getDataTileJSON(datasetName: string): Promise<unknown>
    getPBFFile(datasetName: string, z: number, x: number, y: number): Promise<ArrayBuffer>
    getFontGlyphs(fontstack: string, start: number, end: number): Promise<ArrayBuffer>
  }

  interface RoutingApi {
    getDirections(
      origin: { lat: number; lon: number },
      destination: { lat: number; lon: number },
      options?: {
        alternatives?: boolean
        steps?: boolean
        overview?: 'full' | 'simplified' | 'false'
        language?: string
        traffic_metadata?: boolean
      }
    ): Promise<{
      routes: Array<{
        legs: Array<{
          readable_distance: string
          readable_duration: string
          distance: number
          duration: number
        }>
        geometry: string
      }>
    }>
  }

  class OlaMapsClient {
    constructor(apiKey: string)
    places: PlacesApi
    tiles: TilesApi
    routing: RoutingApi
  }

  export = OlaMapsClient
}
