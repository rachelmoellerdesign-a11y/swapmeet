import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createListing, getCategories, ValidationFailed } from '../api/client'
import { CONDITION_LABELS } from '../api/types'
import type { Category, Condition, NewListing } from '../api/types'
import { Button } from '../design-system'

type Field = keyof NewListing
type FormState = Record<Field, string>

const EMPTY: FormState = {
  title: '', price: '', category: '', condition: '', description: '', seller: '', location: '', emoji: ''
}

const control =
  'w-full rounded-token-md border-[2.5px] border-line-strong bg-surface px-3 py-2 font-sans text-base text-fg ' +
  'focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-primary'

export default function SellPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const set = (field: Field) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    setFormError(null)
    // Empty price is sent as missing so the server, not Number(''), decides validity.
    const payload = {
      ...form,
      price: form.price.trim() === '' ? undefined : Number(form.price),
      emoji: form.emoji.trim() === '' ? undefined : form.emoji
    }
    try {
      const created = await createListing(payload as unknown as NewListing)
      navigate(`/listings/${created.id}`)
    } catch (err) {
      if (err instanceof ValidationFailed) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])))
      } else {
        setFormError((err as Error).message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const field = (name: Field, label: string, input: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-bold text-fg">{label}</label>
      {input}
      {errors[name] && <p id={`${name}-error`} className="text-sm font-bold text-danger">{errors[name]}</p>}
    </div>
  )
  const aria = (name: Field) => ({
    id: name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex max-w-xl flex-col gap-5">
      <h1 className="font-display text-4xl font-bold text-fg">Post a listing</h1>
      {formError && <p role="alert" className="text-danger">Could not post listing: {formError}</p>}

      {field('title', 'Title', <input {...aria('title')} className={control} value={form.title} onChange={set('title')} />)}
      {field('price', 'Price (whole dollars)', <input {...aria('price')} className={control} type="number" inputMode="numeric" value={form.price} onChange={set('price')} />)}
      {field('category', 'Category',
        <select {...aria('category')} className={control} value={form.category} onChange={set('category')}>
          <option value="">Choose a category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      )}
      {field('condition', 'Condition',
        <select {...aria('condition')} className={control} value={form.condition} onChange={set('condition')}>
          <option value="">Choose a condition</option>
          {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
        </select>
      )}
      {field('description', 'Description', <textarea {...aria('description')} className={control} rows={5} value={form.description} onChange={set('description')} />)}
      {field('seller', 'Seller name', <input {...aria('seller')} className={control} value={form.seller} onChange={set('seller')} />)}
      {field('location', 'Location', <input {...aria('location')} className={control} value={form.location} onChange={set('location')} />)}
      {field('emoji', 'Emoji (optional)', <input {...aria('emoji')} className={control} value={form.emoji} onChange={set('emoji')} />)}

      <div>
        <Button type="submit" disabled={submitting}>{submitting ? 'Posting…' : 'Post listing'}</Button>
      </div>
    </form>
  )
}
