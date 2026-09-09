# Lane 1 — API

**Scope:** implement and validate the category endpoints below.

**Owned files:**
- `server/server.js`
- `server/package.json` (only if a dependency is genuinely required)

**Out of scope:** `client/`, `data/listings.json` schema changes (if the
listing shape needs to change, raise it on the Issue — it's a shared
contract, not Lane 1 property).

## Interface contract

### `GET /api/health`
```json
{ "status": "ok", "service": "swapmeet-api" }
```

### `GET /api/listings`
Optional query param: `category` (string, matches a listing's `category`
field exactly). Omit to return all listings.

Response: `200` — array of listing objects.

### `GET /api/listings/:id`
Response: `200` — single listing object, or `404`:
```json
{ "error": "Listing not found", "id": "lst-999" }
```

### `GET /api/categories`
Response: `200` — array of category summaries, sorted by `label`.
```json
[
  { "id": "restaurant-equipment", "label": "Restaurant Equipment", "count": 4 }
]
```
- `id` — raw category string as stored on listings (join key back to
  `GET /api/listings?category=<id>`).
- `label` — `id` with hyphens split into words and each word capitalized.
- `count` — number of listings currently in that category.

**Validation commands:**
```bash
npm run dev:server
curl -s localhost:3001/api/categories | jq .
curl -s "localhost:3001/api/listings?category=restaurant-equipment" | jq .
curl -s localhost:3001/api/listings/lst-999 | jq .   # expect 404 shape
```
Watch the Fastify request logs while running these — confirm the
`served listings` / `served categories` log lines show the right
`count`/`category` values.

Full decomposition and Lane 2 contract: see `implementation.md` at repo root.
