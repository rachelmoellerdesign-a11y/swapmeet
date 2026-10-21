const pill = (active) =>
  'rounded-pill border-[2.5px] px-4 py-2 font-sans text-sm font-bold ' +
  (active
    ? 'border-primary bg-primary text-on-primary'
    : 'border-line-strong bg-transparent text-fg hover:bg-panel')

// props: categories (Category[]), selected (id or null), onSelect(id | null)
export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
      <button type="button" className={pill(selected === null)} aria-pressed={selected === null} onClick={() => onSelect(null)}>
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          className={pill(selected === c.id)}
          aria-pressed={selected === c.id}
          onClick={() => onSelect(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
