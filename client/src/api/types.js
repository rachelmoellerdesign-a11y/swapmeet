// Mirrors the Contracts section of issue #3. Change it there first.

/**
 * @typedef {'restaurant-equipment' | 'maker-tools' | 'retail' | 'landscaping' | 'events'} CategoryId
 * @typedef {'used-like-new' | 'used-good' | 'used-fair'} Condition
 *
 * @typedef {Object} Listing
 * @property {string} id
 * @property {string} title
 * @property {number} price  whole dollars
 * @property {CategoryId} category
 * @property {Condition} condition
 * @property {string} emoji
 * @property {string} description
 * @property {string} seller
 * @property {string} location
 * @property {string} postedAt  YYYY-MM-DD
 *
 * @typedef {Object} Category
 * @property {CategoryId} id
 * @property {string} label
 *
 * @typedef {Object} NewListing
 * @property {string} title
 * @property {number} price
 * @property {CategoryId} category
 * @property {Condition} condition
 * @property {string} description
 * @property {string} seller
 * @property {string} location
 * @property {string} [emoji]
 *
 * @typedef {Object} ValidationError
 * @property {'Validation failed'} error
 * @property {{ field: keyof NewListing, message: string }[]} details
 */

export const CONDITION_LABELS = {
  'used-like-new': 'Used - like new',
  'used-good': 'Used - good',
  'used-fair': 'Used - fair'
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

export const formatPrice = (price) => usd.format(price)
