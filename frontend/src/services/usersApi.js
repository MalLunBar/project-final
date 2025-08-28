const API_URL = import.meta.env.VITE_API_URL
const url = `${API_URL}/users`

// fetch user profile
export const getUserProfile = async (id, token) => {
  const response = await fetch(`${url}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to fetch user profile')
  }
  const data = await response.json()
  return data.response.data || {}
}

// update user profile


// fetch list loppis created by user
export const getUserLoppis = async (id, token) => {
  const response = await fetch(`${url}/${id}/loppis`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to fetch loppis list')
  }
  const data = await response.json()
  return data.response || []
}

// fetch list loppis liked by user
export const getUserLikes = async (id, token) => {
  const response = await fetch(`${url}/${id}/likes`, {
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

