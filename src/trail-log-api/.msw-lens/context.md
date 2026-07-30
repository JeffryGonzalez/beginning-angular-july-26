# msw-lens — project context
generated: 2026-07-30T18:54:45.238Z

> Drop this file into any LLM conversation for instant context about what
> is mocked in this project, what scenarios exist, and what is currently active.

## Active scenarios

| endpoint | method | active scenario |
|----------|--------|-----------------|
| `http://localhost:3000/trails` | GET | `typical` |

## Scenario details

### GET `http://localhost:3000/trails`
manifest: `src\mocks\trails\trails.yaml`
> List of trails rendered by the trails list page and summarized by the stats panel.

- **typical** ✓ **(active)** — Tests that the card grid and the stats panel both render, with a spread of difficulties so every difficulty color and every stats row is exercised.
- **empty** — Tests what the page shows when there is nothing to render — currently an empty grid and a stats panel reading 0, with no empty-state message.
- **single-trail** — Tests the grid at its narrowest, where the responsive column classes have only one card to place.
- **overloaded** — Tests the 4-column grid and the stats panel against far more trails than the layout was designed around.
- **duplicate-names** — Tests the list's track expression, which keys on name rather than id — two trails sharing a name should surface the duplicate-key failure.
- **unknown-difficulty** — Tests that a difficulty outside the four known values still renders, picks up no color class, and adds its own row to the miles-by-difficulty breakdown.
- **missing-ids** — Tests favorite toggling when records arrive without an id — marking one card favorite should not silently mark others.
- **fractional-miles** — Tests how the total-miles and per-difficulty figures display when summing fractions produces a long floating-point tail.
- **zero-and-negative-miles** — Tests the stats panel and the feet conversion against non-positive distances that the type allows but the UI never anticipates.
- **malformed-data** — Tests whether partially shaped records break rendering — missing miles hits the feet pipe, missing difficulty hits the color bindings and the stats grouping.
- **slow** *(delay: 2500)* — Tests what the user sees while the request is in flight, since there is no skeleton or spinner in the template.
- **timeout** *(delay: infinite)* — Tests the page when the request never settles and the grid stays empty indefinitely.
- **unauthorized** *(401)* — Tests the page's behavior when the trails request is rejected and the resource has no error branch to fall back to.
- **server-error** *(500)* — Tests the failure path when the trails request errors on the server.

sourceHints:
- `src/app/trails/trails-list.ts`
- `src/app/trails/services/trails-store.ts`
- `src/app/trails/trail-card.ts`
- `src/app/trails/trail-stats.ts`
- `src/app/trails/pipes/miles-feet.ts`
- `src/app/trails/types.ts`

---

## How msw-lens works

msw-lens reads scenario manifests — YAML files co-located with MSW handlers under
`src/mocks/`. The active selection writes to two tool-owned files:

- `src/mocks/active-scenarios.ts` — which scenario is active per endpoint
- `src/mocks/bypassed-endpoints.ts` — endpoints that bypass MSW entirely (pass through to the real API)

Vite HMR picks up file changes immediately. No browser refresh needed.

These files are **tool-owned**. Do not edit them manually; msw-lens regenerates them on every run.

**Bypass requires** MSW worker started with `onUnhandledRequest: 'bypass'` —
otherwise unhandled requests will warn or error instead of passing through.

**Commands:**
- `npm run lens` — interactive scenario switcher (single run)
- `npm run lens:watch` — stay in the switcher, Ctrl+C to exit
- `npm run lens:context -- <component.ts>` — generate a prompt for an LLM

Manifests live alongside handlers: `auth/user.yaml` next to `auth/user.ts`.

---

## Manifest format

```yaml
endpoint: /api/resource/   # MUST match the handler's ENDPOINT constant exactly
method: GET
shape: document            # document | collection — determines scenario vocabulary
description: What this endpoint returns

responseType:              # the success-response type
  name: TypeScriptTypeName
  path: relative/path/to/types.ts   # path relative to where you run `lens:context`

errorType:                 # optional — 4xx/5xx response shape (e.g. RFC 9457 ProblemDetails)
  name: ProblemDetails
  path: relative/path/to/types.ts

context:
  sourceHints:             # paths to files that consume this endpoint
    - path/to/store.ts     # LLM reads these directly — provide pointers, not summaries
    - path/to/component.ts
  hints:                   # optional — free-form annotations the code doesn't make obvious
    - "401 always redirects to /login via a route guard"
    - "quantity must be between 1 and 99"

scenarios:
  scenario-name:
    description: What UI behavior this tests (not what the data looks like)
    active: true           # at most one scenario per manifest — marks the default
    httpStatus: 401        # optional — omit for 200
    delay: real            # optional — 'real', 'infinite', or integer-string ms ('2000')
```

Four things are non-negotiable:

1. **`endpoint` MUST match the handler's `ENDPOINT` constant exactly, and both must match what the source actually calls.** If the source uses an absolute URL (e.g. `fetch('https://api.example.com/posts')`), use that absolute URL as both `endpoint` and `ENDPOINT` — MSW intercepts absolute URLs directly. Do not modify the source. The switcher writes keys to `active-scenarios.ts` as `METHOD endpoint` (e.g. `GET /api/cart`); the handler reads keys in the same format. A mismatch is silent — the handler falls through to its default case forever and the switcher appears to do nothing.

2. **`shape` is `document` or `collection` (literal values) for GET endpoints. Omit `shape` for mutations** (POST/PUT/PATCH/DELETE) — the method itself drives the archetype vocabulary.

3. **At most one scenario has `active: true`** — and you should always specify one. The fallback (first scenario in declaration order) reorders silently when the manifest is edited.

4. **`delay` is one of:** `real` (realistic latency), `infinite` (never resolves — tests timeout UI), or an integer-string of milliseconds (`"2000"`).

