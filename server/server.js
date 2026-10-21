import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATEGORIES } from './categories.js'
import { appendListing, readListings } from './store.js'
import { validateNewListing } from './validate.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist')

const app = Fastify({ logger: true })

app.get('/api/health', async () => ({ status: 'ok', service: 'swapmeet-api' }))

app.get('/api/listings', async (request) => {
  const { category } = request.query
  const all = await readListings()
  const listings = (category ? all.filter((l) => l.category === category) : all).sort(
    // Newest first; ids are sequential, so they break same-day ties.
    (a, b) => b.postedAt.localeCompare(a.postedAt) || b.id.localeCompare(a.id),
  )
  request.log.info({ count: listings.length, category }, 'served listings')
  return listings
})

app.get('/api/listings/:id', async (request, reply) => {
  const listings = await readListings()
  const listing = listings.find((l) => l.id === request.params.id)
  if (!listing) {
    return reply.code(404).send({ error: 'Listing not found', id: request.params.id })
  }
  return listing
})

app.get('/api/categories', async () => CATEGORIES)

app.post('/api/listings', async (request, reply) => {
  const result = validateNewListing(request.body)
  if (!result.ok) {
    request.log.info({ fields: result.details.map((d) => d.field) }, 'validation failed')
    return reply.code(400).send({ error: 'Validation failed', details: result.details })
  }
  const listing = await appendListing(result.value)
  request.log.info({ id: listing.id }, 'created listing')
  return reply.code(201).send(listing)
})

// Serve the built React app when client/dist exists (production mode).
// In development the Vite dev server handles the frontend and proxies /api here.
if (existsSync(CLIENT_DIST)) {
  app.register(fastifyStatic, { root: CLIENT_DIST })
}

// Unknown /api routes stay JSON 404s. Any other GET falls back to the SPA shell
// (when built) so client-side routes like /listings/:id survive a deep link.
app.setNotFoundHandler((request, reply) => {
  if (request.method === 'GET' && !request.url.startsWith('/api') && existsSync(CLIENT_DIST)) {
    return reply.type('text/html').sendFile('index.html')
  }
  return reply.code(404).send({ error: 'Not found', path: request.url })
})

const port = Number(process.env.PORT) || 3001
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
