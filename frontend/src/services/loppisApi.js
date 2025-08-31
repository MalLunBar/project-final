const API_URL = import.meta.env.VITE_API_URL
const url = `${API_URL}/loppis`

// Valfri hjälpare om du vill bygga FormData någon annanstans
export const buildLoppisFormData = (dataObj, files = []) => {
  const fd = new FormData()
  fd.append('data', JSON.stringify(dataObj))
  for (const file of files) fd.append('images', file)
  return fd
}

// Intern hjälpare: skickar FormData oförändrat, annars JSON
const makeRequest = (url, method, payload, token) => {
  const opts = { method, headers: { Authorization: token } }

  if (payload instanceof FormData) {
    // Viktigt: sätt INTE Content-Type själv (boundary sätts automatiskt)
    opts.body = payload
  } else {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(payload)
  }

  return fetch(url, opts)
}

// fetch loppis list with optional filters
export const getLoppisList = async (params) => {
  const query = !params ? '' : `?${params}`
  const response = await fetch(`${url}${query}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Tyvärr, vi hittade inga loppisar som matchar din sökning. Testa att justera dina filter eller sök i en annan stad.')
    } else {
      const errorData = await response.json()
      throw new Error(errorData?.message || 'Failed to fetch loppis data')
    }
  }
  const data = await response.json()
  return data.response || { data: [], totalCount: 0, currentPage: 1, limit: 10 }
}

// fetch a list with popular loppis (most likes)
export const getPopularLoppis = async () => {
  const response = await fetch(`${url}/popular`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Inga kommande loppisar just nu.')
    } else {
      const errorData = await response.json()
      throw new Error(errorData?.message || 'Failed to fetch loppis data')
    }
  }
  const data = await response.json()
  return data.response || [] // returns array of loppis
}

// fetch a list with upcoming loppis (next 5 coming loppis)
export const getUpcomingLoppis = async () => {
  const response = await fetch(`${url}/upcoming`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to fetch loppis data')
  }
  const data = await response.json()
  return data.response || [] // returns array of loppis
}

// fetch single loppis by ID
export const getLoppisById = async (id) => {
  const response = await fetch(`${url}/${id}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to fetch loppis data')
  }
  const data = await response.json()
  return data.response || {}
}

// CREATE (accepterar FormData eller JSON — du använder FormData)
export const createLoppis = async (dataOrFormData, token) => {
  const response = await makeRequest(url, 'POST', dataOrFormData, token)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.message || 'Failed to create new loppis')
  }
  const data = await response.json()
  return data.response || {}
}

// UPDATE (accepterar FormData eller JSON — du skickar FormData från LoppisForm)
export const updateLoppis = async (id, dataOrFormData, token) => {
  const response = await makeRequest(`${url}/${id}`, 'PATCH', dataOrFormData, token)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.message || 'Failed to edit loppis')
  }
  const data = await response.json()
  return data.response || {}
}

// delete a loppis by ID
export const deleteLoppis = async (id, token) => {
  const response = await fetch(`${url}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to delete loppis.')
  }
  const data = await response.json()
  return data.response || {}
}

// like/unlike loppis
export const toggleLikeLoppis = async (id, token) => {
  const response = await fetch(`${url}/${id}/like`, {
    method: 'PATCH',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to like/unlike loppis')
  }
  const data = await response.json()
  return { action: data.response.action, loppis: data.response.data }
}

// get a list of loppis categories
export const getLoppisCategories = async () => {
  const response = await fetch(`${url}/categories`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || 'Failed to fetch loppis categories')
  }
  const data = await response.json()
  return data.response || []
}
