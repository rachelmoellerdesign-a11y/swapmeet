# SwapMeet — Category Filter Feature: Decomposition

## Overview

SwapMeet's landing page currently dumps the raw `/api/listings` payload as
JSON. This feature turns it into a real listings page with category
filtering. The work splits into two parallel lanes along the existing
server/client boundary:

- **Lane 1 (API)** exposes category data and filtering over HTTP.
- **Lane 2 (UI)** consumes that API to render a filterable listings page.

The API side of this contract is already partly implemented (uncommitted, in
`server/server.js`): `GET /api/listings` accepts `?category=`, and a new
`GET /api/categories` endpoint lists categories with counts. Lane 2 builds
against that contract.

## Interface contract

### `GET /api/health`
```json
{ "status": "ok", "service": "swapmeet-api" }
```

### `GET /api/listings`
Optional query param: `category` (string, matches a listing's `category`
field exactly). Omit to return all listings.

Response: `200` — array of listing objects.
```json
[
  {
    "id": "lst-001",
    "title": "Commercial espresso machine — 2 group",
    "price": 1450,
    "category": "restaurant-equipment",
    "condition": "used-good",
    "emoji": "☕",
    "description": "La Marzocco Linea 2-group, well maintained...",
    "seller": "Beanline Coffee Cart",
    "location": "Riverside District",
    "postedAt": "2026-07-28"
  }
]
```

### `GET /api/listings/:id`
Response: `200` — single listing object (shape above), or `404`:
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

## Lane 1 — API

**Scope:** implement and validate the category endpoints above.

**Owned files:**
- `server/server.js`
- `server/package.json` (only if a dependency is genuinely required)

**Out of scope:** `client/`, `data/listings.json` schema changes (if the
listing shape needs to change, raise it on the Issue — it's a shared
contract, not Lane 1 property).

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

## Lane 2 — UI

**Scope:** replace the raw JSON dump in `App.jsx` with a real listings page:
a category filter control (populated from `GET /api/categories`) wired to
re-fetch `GET /api/listings?category=`, and listing cards in place of
`<pre>{JSON.stringify(...)}</pre>`.

**Owned files:**
- `client/src/App.jsx`
- `client/src/main.jsx` (only if wiring changes require it)
- Any new files under `client/src/components/`

**Out of scope:** `server/`, `data/listings.json`. Consume the contract
above as given — if it doesn't provide what the UI needs, raise it on the
Issue rather than reaching into Lane 1's files.

**Validation commands:**
```bash
npm run dev
```
Open `localhost:5173`, confirm in the browser: listings render as cards
(not raw JSON), the category filter lists real categories with counts,
selecting a category re-fetches and narrows the results, and the browser
console/network tab shows no failed requests. Cross-check against the
Lane 1 server logs to confirm the filtered request actually hit the API.

## Coordination rules

- Reference the Issue number in every commit: `feat: X (refs #N)`.
- Do not modify files outside your lane's scope (above). If the right fix
  lives in the other lane's files, comment on that lane's Issue instead of
  editing directly.
- The interface contract above is agreed *before* implementation. If either
  lane needs to deviate from it, stop and raise it on the Issue — never
  silently redefine a shape the other lane depends on.
- Each commit should leave the app runnable (`npm run dev` works end to
  end) even if the feature is incomplete.
- Validate every change against real logs/output using the commands above
  before calling it done — no "should work."
