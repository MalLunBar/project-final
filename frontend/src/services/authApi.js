const API_URL = 'http://localhost:8080/user' // local development URL
// borde URL vara .../auth istället? 

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

}