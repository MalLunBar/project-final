// const API_URL = 'http://localhost:8080/users' // local development URL
const API_URL = 'https://runthornet-api.onrender.com/users' 

// fetch user profile
export const getUserProfile = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
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
  const response = await fetch(`${API_URL}/${id}/loppis`, {
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
  const response = await fetch(`${API_URL}/${id}/likes`, {
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

