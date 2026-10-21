import type { Category, CategoryId, Listing, NewListing, ValidationError } from './types'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export class ValidationFailed extends Error {
  constructor(public details: ValidationError['details']) {
    super('Validation failed')
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init)
  if (res.status === 400 && init?.method === 'POST') {
    const body = (await res.json()) as ValidationError
    throw new ValidationFailed(body.details)
  }
  if (!res.ok) throw new ApiError(res.status, `API responded ${res.status}`)
  return res.json() as Promise<T>
}

export const getListings = (category?: CategoryId | string) =>
  request<Listing[]>(
    category ? `/api/listings?category=${encodeURIComponent(category)}` : '/api/listings'
  )

export const getListing = (id: string) =>
  request<Listing>(`/api/listings/${encodeURIComponent(id)}`)

export const getCategories = () => request<Category[]>('/api/categories')

export const createListing = (input: NewListing) =>
  request<Listing>('/api/listings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input)
  })
