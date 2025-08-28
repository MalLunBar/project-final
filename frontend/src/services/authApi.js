const API_URL = import.meta.env.VITE_API_URL
const url = `${API_URL}/users`

// API call to register a new user
export const registerUser = async (userData) => {
  const response = await fetch(`${url}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Register failed')
  }
  const data = await response.json()
  return data.response || {} // returns user data {id, firstName, accessToken}}
}

// API call to login a user
export const loginUser = async (credentials) => {
  const response = await fetch(`${url}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Login failed')
  }
  const data = await response.json()
  return data.response || {} // returns user data {id, firstName, accessToken}
}
