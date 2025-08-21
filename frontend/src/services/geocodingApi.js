const API_URL = 'http://localhost:8080/api/geocode' // local development URL

export const geocodeCity = async (city) => {
  const response = await fetch(`${API_URL}?q=${encodeURIComponent(city)}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to geocode city')
  }
  const data = await response.json()
  if (!data || data.length === 0) {
    throw new Error('Inga träffar')
  }
  return data[0] // returns object with lat, lon, and adress details
}

export const reverseGeocode = async (lat, lon) => {
  const response = await fetch(`${API_URL}/reverse?lat=${lat}&lon=${lon}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to reverse geocode coordinates')
  }
  const data = await response.json()
  if (!data || data.length === 0) {
    throw new Error('Inga träffar')
  }
  return data // returns object with address details
}