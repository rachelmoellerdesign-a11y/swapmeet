// Fixed order: this is the order GET /api/categories returns.
// `slug` is the URL/query-safe form; it equals `id` (listings store the id in `category`).
const CATEGORY_IDS = [
  ['restaurant-equipment', 'Restaurant equipment'],
  ['maker-tools', 'Maker tools'],
  ['retail', 'Retail'],
  ['landscaping', 'Landscaping'],
  ['events', 'Events'],
]

export const CATEGORIES = CATEGORY_IDS.map(([id, label]) => ({ id, slug: id, label }))

export const CONDITIONS = ['used-like-new', 'used-good', 'used-fair']
