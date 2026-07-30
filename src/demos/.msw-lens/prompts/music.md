# msw-lens context
generated: 2026-07-30T15:51:38.888Z
entry: src\app\demonstrations\music.ts

---

## The ask

I'm working on the `Music` component in a web application and want to
create MSW mock scenarios for the endpoints it depends on.

Based on the source files below, please:

1. Identify the HTTP endpoints this component reaches — through its hooks, stores, services, or direct fetch/http calls
2. For each endpoint, generate a `.yaml` manifest in msw-lens format (see "Manifest pattern" below)
3. For each endpoint, also generate a handler stub (`.ts`) with a switch statement
   over the scenario names (see "Handler pattern" below)
4. Register the new handler in `handlers.ts` — match the import pattern shown above
5. For each scenario, cover: happy path, empty/null states, error conditions
   (with appropriate HTTP status codes), slow/timeout, and any edge cases the
   **response type shape** suggests I haven't anticipated

**On scenario descriptions:** say what UI behavior it tests, not what the data
looks like. Not: "Returns an empty items array." Instead: "Tests that the empty
cart message appears and the checkout button disables."

**If an endpoint already has a manifest** below: do not generate a new one. Suggest
scenarios to add to the existing manifest (or note that coverage is sufficient), and
be explicit about which endpoints you treated this way.

Follow the canonical Manifest pattern in the "About msw-lens" section below. If you
notice anything in the component or its markup that suggests a scenario I should
consider but haven't asked about — flag it.

If the provided files are incomplete — init methods with no visible call site,
protected routes with no guard in scope, dependencies that seem to come from
outside what was crawled — **list your assumptions explicitly** rather than
silently filling the gaps.

---

## Source files

### music.ts
`src\app\demonstrations\music.ts`
```typescript
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { Band } from './types';

@Component({
  selector: 'app-music',
  imports: [],
  template: `
    <h1>List of my favorite bands</h1>
    @for (band of musicResource.value(); track band.id) {
      <div class="card card-md shadow">
        <div class="card-body">
          <h2 class="card-title">Yes</h2>
          <ul>
            <li>Fragile</li>
            <li>From a Page</li>
          </ul>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class Music {
  musicResource = httpResource<Band[]>(() => 'https://api.fake-music-thing.com/bands');
}
```

### types.ts
`src\app\demonstrations\types.ts`
```typescript
export interface Band {
  id: string;
  name: string;
  albums: string[];
}
```

---

## Handler registration

### handlers.ts
`src\mocks\handlers.ts`
```typescript
import { HttpHandler } from 'msw';

import bypassed from './bypassed-endpoints';

const all: HttpHandler[] = [];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
```

---

## About msw-lens

msw-lens manages MSW scenario switching for web development. Manifests live
alongside handlers under `src/mocks/`. msw-lens writes two tool-owned files:
`src/mocks/active-scenarios.ts` (which scenario is active per endpoint) and
`src/mocks/bypassed-endpoints.ts` (endpoints that pass through to the real API
instead of being mocked). Vite HMR picks up changes immediately.

Both files are tool-owned. Do not include instructions to edit them manually.

Bypass requires MSW worker started with `onUnhandledRequest: 'bypass'` — otherwise
unhandled requests warn or error instead of passing through.

### Manifest pattern (match this exactly)

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


### Handler pattern (match this exactly)

Every handler follows the shape below. Three things are non-negotiable:

1. **Default-import** `activeScenarios` — the file uses `export default`, not a named export.
2. **Key lookup uses `` `METHOD ${ENDPOINT}` ``** — the switcher writes keys in that format. Missing the method prefix means the switcher has no effect and the handler silently falls through to the default case.
3. **Default-export the handler array** as `HttpHandler[]` — `handlers.ts` aggregates by importing each as a default and spreading.

```typescript
import { http, HttpHandler, HttpResponse, delay } from 'msw';
import activeScenarios from '../active-scenarios';

const ENDPOINT = '/api/cart';

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json({ items: [], total: 0 });
      case 'unauthorized':
        // Returning a structured ProblemDetails body — see manifest `errorType`
        return HttpResponse.json(
          { type: 'about:blank', title: 'Session expired', status: 401 },
          { status: 401 }
        );
      case 'server-error':
        return new HttpResponse(null, { status: 500 });
      case 'slow':
        await delay('real');
        return HttpResponse.json(typicalResponse);
      case 'never-resolves':
        // delay('infinite') — request never settles; tests timeout / loading-stuck UI
        await delay('infinite');
        return HttpResponse.json(typicalResponse);
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
```

Register in `handlers.ts` (with the bypass filter):

```typescript
import { HttpHandler } from 'msw';
import cartHandler from './cart/cart';
import bypassed from './bypassed-endpoints';

const all: HttpHandler[] = [...cartHandler];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
```

`bypassed-endpoints.ts` is tool-owned. The filter removes bypassed endpoints from MSW
registration entirely so matching requests pass through to the real network. Requires
`worker.start({ onUnhandledRequest: 'bypass' })`.

Scenario archetypes to consider:

**Document endpoints** (single item responses):
- `happy-path` — successful response with typical data
- `not-found` — 404, resource doesn't exist
- `unauthorized` — 401, tests auth guards and login redirect
- `server-error` — 500, tests error boundary or fallback UI
- `slow` — MSW delay('real'), tests loading/skeleton states
- `malformed-data` — response missing optional fields or with unexpected nulls

**Collection endpoints** (array/list responses):
- `typical` — N items, normal case
- `empty` — zero items, tests empty-state UI
- `overloaded` — far more items than the UI was designed for (tests pagination, overflow)
- `slow` — tests loading skeleton
- `unauthorized` — 401
- `server-error` — 500

**Mutation endpoints** (POST / PUT / PATCH / DELETE):
- `success` / `created` — 201/202/204, happy path; tests UI confirmation, redirect, or form reset
- `validation-error` — 400/422, field-level ProblemDetails; tests whether error messages surface per-field or as a summary
- `conflict` — 409, duplicate or constraint violation; tests whether the UI surfaces a meaningful message
- `unauthorized` — 401, session expired mid-form; tests redirect or inline session error
- `forbidden` — 403, insufficient role; tests whether the UI blocks submission or shows an access error
- `server-error` — 500; tests whether the form retains input and shows a recoverable error message
- `slow` — MSW delay('real'); tests whether the submit button shows a pending/disabled state during submission
