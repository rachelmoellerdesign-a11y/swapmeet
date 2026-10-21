import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, getCategories, getListing } from '../api/client'
import { CONDITION_LABELS, formatPrice } from '../api/types'
import type { Category, Listing } from '../api/types'
import { Badge } from '../design-system'

type State = { status: 'loading' } | { status: 'notFound' } | { status: 'error'; message: string } | { status: 'ok'; listing: Listing }

export default function ListingDetailPage() {
  const { id = '' } = useParams()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setState({ status: 'loading' })
    getListing(id)
      .then((listing) => setState({ status: 'ok', listing }))
      .catch((e: Error) =>
        setState(e instanceof ApiError && e.status === 404 ? { status: 'notFound' } : { status: 'error', message: e.message })
      )
  }, [id])

  const back = (
    <Link to="/" className="font-bold text-fg underline">
      ← Back to listings
    </Link>
  )

  if (state.status === 'loading') return <p className="text-muted">Loading listing…</p>
  if (state.status === 'error') return <p role="alert" className="text-danger">Failed to load listing: {state.message}</p>
  if (state.status === 'notFound') {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-bold text-fg">Listing not found</h1>
        <p className="text-muted">We couldn't find a listing with id “{id}”.</p>
        {back}
      </div>
    )
  }

  const l = state.listing
  const categoryLabel = categories.find((c) => c.id === l.category)?.label ?? l.category
  return (
    <article className="flex flex-col gap-4">
      {back}
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="text-6xl">{l.emoji}</span>
        <div>
          <h1 className="font-display text-3xl font-bold text-fg">{l.title}</h1>
          <p className="font-display text-2xl font-bold text-fg">{formatPrice(l.price)}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge color="denim">{categoryLabel}</Badge>
        <Badge color="marigold">{CONDITION_LABELS[l.condition]}</Badge>
      </div>
      <p className="max-w-prose text-fg">{l.description}</p>
      <dl className="grid max-w-prose grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-fg">
        <dt className="font-bold">Seller</dt><dd>{l.seller}</dd>
        <dt className="font-bold">Location</dt><dd>{l.location}</dd>
        <dt className="font-bold">Posted</dt><dd>{l.postedAt}</dd>
      </dl>
    </article>
  )
}
