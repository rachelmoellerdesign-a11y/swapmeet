import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCategories, getListings } from '../api/client'
import { CONDITION_LABELS, formatPrice } from '../api/types'
import type { Category, Listing } from '../api/types'
import CategoryFilter from '../components/CategoryFilter'
import { ItemCard } from '../design-system'

export default function BrowsePage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const [categories, setCategories] = useState<Category[]>([])
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCategories().then(setCategories).catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    setListings(null)
    setError(null)
    getListings(category ?? undefined)
      .then(setListings)
      .catch((e: Error) => setError(e.message))
  }, [category])

  const labelFor = (id: string) => categories.find((c) => c.id === id)?.label ?? id

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl font-bold text-fg">Local listings</h1>
      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={(id) => setParams(id ? { category: id } : {})}
      />

      {error && <p role="alert" className="text-danger">Failed to load listings: {error}</p>}
      {!error && !listings && <p className="text-muted">Loading listings…</p>}
      {listings && listings.length === 0 && <p className="text-muted">No listings in this category yet.</p>}

      {listings && listings.length > 0 && (
        <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] justify-items-center gap-6 p-0">
          {listings.map((l) => (
            <li key={l.id} className="w-full max-w-[320px]">
              <Link to={`/listings/${l.id}`} className="block rounded-token-md focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-primary">
                <ItemCard
                  price={formatPrice(l.price)}
                  title={l.title}
                  distance={l.location}
                  note={CONDITION_LABELS[l.condition]}
                  badge={{ label: labelFor(l.category), color: 'denim' }}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
