// The only module that calls fetch. Shapes are documented in ./types.js.

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export class ValidationFailed extends Error {
  constructor(details) {
    super('Validation failed')
    this.details = details
  }
}

async function request(path, init) {
  const res = await fetch(path, init)
  if (res.status === 400 && init?.method === 'POST') {
    const body = await res.json()
    throw new ValidationFailed(body.details)
  }
  if (!res.ok) throw new ApiError(res.status, `API responded ${res.status}`)
  return res.json()
}

export const getListings = (category) =>
  request(category ? `/api/listings?category=${encodeURIComponent(category)}` : '/api/listings')

export const getListing = (id) => request(`/api/listings/${encodeURIComponent(id)}`)

export const getCategories = () => request('/api/categories')

export const createListing = (input) =>
  request('/api/listings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input)
  })
