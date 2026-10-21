import { readFile, writeFile, rename } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CategoryId, Condition } from './categories.js'
import type { NewListing } from './validate.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '..', 'data', 'listings.json')

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

export async function readListings(): Promise<Listing[]> {
  return JSON.parse(await readFile(DATA_FILE, 'utf8'))
}

// Appends are queued so concurrent POSTs never interleave their read-modify-write.
let queue: Promise<unknown> = Promise.resolve()

export function appendListing(input: Required<NewListing>): Promise<Listing> {
  const run = queue.then(async () => {
    const listings = await readListings()
    const maxId = listings.reduce((max, l) => Math.max(max, Number(l.id.replace('lst-', '')) || 0), 0)
    const listing: Listing = {
      id: `lst-${String(maxId + 1).padStart(3, '0')}`,
      ...input,
      postedAt: new Date().toISOString().slice(0, 10),
    }
    // Write a temp file then rename, so a reader never sees a half-written file.
    const tmp = `${DATA_FILE}.tmp`
    await writeFile(tmp, JSON.stringify([...listings, listing], null, 2) + '\n')
    await rename(tmp, DATA_FILE)
    return listing
  })
  queue = run.catch(() => undefined)
  return run
}
