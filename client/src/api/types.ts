// Mirrors the Contracts section of issue #3. Change it there first.
export type CategoryId =
  | 'restaurant-equipment'
  | 'maker-tools'
  | 'retail'
  | 'landscaping'
  | 'events'

export type Condition = 'used-like-new' | 'used-good' | 'used-fair'

export interface Listing {
  id: string
  title: string
  price: number
  category: CategoryId
  condition: Condition
  emoji: string
  description: string
  seller: string
  location: string
  postedAt: string
}

export interface Category {
  id: CategoryId
  label: string
}

export interface NewListing {
  title: string
  price: number
  category: CategoryId
  condition: Condition
  description: string
  seller: string
  location: string
  emoji?: string
}

export interface ValidationError {
  error: 'Validation failed'
  details: { field: keyof NewListing; message: string }[]
}

export const CONDITION_LABELS: Record<Condition, string> = {
  'used-like-new': 'Used - like new',
  'used-good': 'Used - good',
  'used-fair': 'Used - fair'
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

export const formatPrice = (price: number) => usd.format(price)
