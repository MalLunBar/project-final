const API_URL = 'http://localhost:8080/loppis' // local development URL

// api request to fetch a user's liked loppis
export const fetchLikedLoppis = async (token) => {
  const response = await fetch(`${API_URL}/user/liked`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to fetch favorite loppis')
  }
  const data = await response.json()
  return data.response.data || []
}

// api request to like or unlike a loppis
export const toggleLikeLoppis = async (loppisId, token) => {
  const response = await fetch(`${API_URL}/${loppisId}/like`, {
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

