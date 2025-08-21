const API_URL = 'http://localhost:8080/loppis' // local development URL

// fetch loppis list with optional filters
export const getLoppisList = async (params) => {
  const query = !params ? '' : `?${params}`
  const response = await fetch(`${API_URL}${query}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to fetch loppis data')
  }
  const data = await response.json()
  return data.response || { data: [], totalCount: 0, currentPage: 1, limit: 10 } // returns data and pagination info
}

// fetch single loppis by ID
export const getLoppisById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to fetch loppis data')
  }
  const data = await response.json()
  return data.response || {} // returns loppis object
}

// create a new loppis
export const createLoppis = async (loppisData, token) => {

}

// update an existing loppis by ID
export const updateLoppis = async (id, loppisData, token) => {

}

// delete a loppis by ID
export const deleteLoppis = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to delete loppis.')
  }
  const data = await response.json()
  return data.response || {} // returns deleted loppis
}

// like/unlike loppis
export const toggleLikeLoppis = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}/like`, {
    method: 'PATCH',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to like/unlike loppis')
  }
  const data = await response.json()
  return { action: data.response.action, loppis: data.response.data }
} 
