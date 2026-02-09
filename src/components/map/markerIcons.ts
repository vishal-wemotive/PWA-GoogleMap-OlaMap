// Import marker icons from assets
import GPS_Navigation from '../../assets/icons/gps-navigation.png'
import HOME_ICON from '../../assets/icons/HOME_ICON1.webp'

// Export icon URLs for Google Maps
export const startIconUrl = GPS_Navigation
export const endIconUrl = HOME_ICON

// Create HTML element for MapLibre markers (start - GPS navigation)
export const createStartMarkerElement = (): HTMLDivElement => {
  const el = document.createElement('div')
  el.innerHTML = `<img src="${GPS_Navigation}" width="40" height="40" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />`
  el.style.cursor = 'pointer'
  return el
}

// Create HTML element for MapLibre markers (end - Home)
export const createEndMarkerElement = (): HTMLDivElement => {
  const el = document.createElement('div')
  el.innerHTML = `<img src="${HOME_ICON}" width="30" height="30" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />`
  el.style.cursor = 'pointer'
  return el
}
