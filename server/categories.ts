export type CategoryId =
  | 'restaurant-equipment'
  | 'maker-tools'
  | 'retail'
  | 'landscaping'
  | 'events'

export type Condition = 'used-like-new' | 'used-good' | 'used-fair'

export interface Category {
  id: CategoryId
  label: string
}

// Fixed order: this is the order GET /api/categories returns.
export const CATEGORIES: Category[] = [
  { id: 'restaurant-equipment', label: 'Restaurant equipment' },
  { id: 'maker-tools', label: 'Maker tools' },
  { id: 'retail', label: 'Retail' },
  { id: 'landscaping', label: 'Landscaping' },
  { id: 'events', label: 'Events' },
]

export const CONDITIONS: Condition[] = ['used-like-new', 'used-good', 'used-fair']
