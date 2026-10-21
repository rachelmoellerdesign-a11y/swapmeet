import { CATEGORIES, CONDITIONS } from './categories.js'

export const DEFAULT_EMOJI = '📦'

// Validates a POST body. Reports every failing field, drops unknown fields.
// Returns { ok: true, value } or { ok: false, details: [{ field, message }] }.
export function validateNewListing(body) {
  const input = body && typeof body === 'object' ? body : {}
  const details = []

  const text = (field, min, max) => {
    const raw = input[field]
    if (typeof raw !== 'string') {
      details.push({ field, message: `${field} is required` })
      return ''
    }
    const value = raw.trim()
    if (value.length < min || value.length > max) {
      details.push({ field, message: `${field} must be ${min}–${max} characters` })
    }
    return value
  }

  const title = text('title', 3, 80)

  const price = input.price
  if (typeof price !== 'number' || !Number.isInteger(price) || price < 0 || price > 1_000_000) {
    details.push({ field: 'price', message: 'price must be a whole number from 0 to 1000000' })
  }

  const category = input.category
  if (!CATEGORIES.some((c) => c.id === category)) {
    details.push({ field: 'category', message: 'category must be a known category id' })
  }

  const condition = input.condition
  if (!CONDITIONS.includes(condition)) {
    details.push({ field: 'condition', message: `condition must be one of ${CONDITIONS.join(', ')}` })
  }

  const description = text('description', 10, 1000)
  const seller = text('seller', 1, 60)
  const location = text('location', 1, 60)

  let emoji = DEFAULT_EMOJI
  if (input.emoji !== undefined) {
    if (typeof input.emoji !== 'string') {
      details.push({ field: 'emoji', message: 'emoji must be a string' })
    } else if (input.emoji.trim()) {
      emoji = input.emoji.trim()
    }
  }

  if (details.length > 0) return { ok: false, details }
  return {
    ok: true,
    value: {
      title,
      price,
      category,
      condition,
      description,
      seller,
      location,
      emoji,
    },
  }
}
