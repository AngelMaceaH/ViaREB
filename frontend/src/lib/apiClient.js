const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
  }
}

export async function apiRequest(path, options = {}) {
  const { headers, body, ...restOptions } = options
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  const hasJsonBody = body !== undefined && body !== null
  if (hasJsonBody && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: requestHeaders,
    body: hasJsonBody ? JSON.stringify(body) : undefined,
  })

  const responseText = await response.text()
  let responseBody = null
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText)
    } catch {
      responseBody = responseText
    }
  }

  if (!response.ok) {
    const errorMessage =
      typeof responseBody === 'object' && responseBody?.message
        ? responseBody.message
        : `Request failed with status ${response.status}`

    throw new ApiError(response.status, errorMessage, responseBody)
  }

  return responseBody
}

export const fleetApi = {
  listBuses() {
    return apiRequest('/api/fleet/buses')
  },
  createBus(payload) {
    return apiRequest('/api/fleet/buses', {
      method: 'POST',
      body: payload,
    })
  },
}

export const salesApi = {
  listTickets() {
    return apiRequest('/api/sales/tickets')
  },
}
