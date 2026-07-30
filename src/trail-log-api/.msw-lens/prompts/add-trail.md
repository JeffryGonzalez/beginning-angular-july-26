# msw-lens context
generated: 2026-07-30T18:54:45.239Z
entry: src\app\trails\add-trail.ts

---

## The ask

I'm working on the `AddTrail` component in a web application and want to
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

### add-trail.ts
`src\app\trails\add-trail.ts`
```typescript
import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, max, min, minLength, required } from '@angular/forms/signals';
import { difficultyLevels, TrailCreate } from './types';
import { Router, RouterLink } from '@angular/router';
import { trailsStore } from './services/trails-store';

@Component({
  selector: 'app-trails-add',
  imports: [FormRoot, FormField, TitleCasePipe, RouterLink],
  template: `
    <p>Add a trail?</p>

    <form class="flex flex-col gap-4 max-w-lg" [formRoot]="form">
      <div class="flex flex-col w-full">
        <label for="name">Name</label>
        <input class="input" type="text" [formField]="form.name" />
        @let field = form.name();
        @if (field.touched() && field.invalid()) {
          @for (error of field.errorSummary(); track error.kind) {
            <span class="label text-error text-xs">{{ error.message }}</span>
          }
        }
      </div>
      <div class="flex flex-col w-full">
        <label for="miles">Miles</label>
        <input class="input" type="number" [formField]="form.miles" />
        @let fieldM = form.miles();
        @if (fieldM.touched() && fieldM.invalid()) {
          @for (error of fieldM.errorSummary(); track error.kind) {
            <span class="label text-error text-xs">{{ error.message }}</span>
          }
        }
      </div>

      <div class="flex flex-col w-full">
        <label for="difficulty">Difficulty</label>
        <select class="input" [formField]="form.difficulty">
          @for (level of levels; track level) {
            <option [value]="level">{{ level | titlecase }}</option>
          }
        </select>
      </div>
      <button type="submit" class="btn btn-secondary" [ariaDisabled]="form().invalid()">
        Add Trail
      </button>
      <a routerLink="" class="btn btn-accent">Cancel</a>
    </form>
  `,
  styles: ``,
})
export class AddTrail {
  store = inject(trailsStore);
  router = inject(Router);
  levels = difficultyLevels;
  // create a signal that holds the default values
  // for your form.
  model = signal<TrailCreate>({
    name: '',
    miles: NaN,
    difficulty: 'easy',
  });

  form = form(
    this.model,
    (schema) => {
      required(schema.name, { message: 'We need the name of the trail!' });
      minLength(schema.name, 2, { message: 'Not long enough - need a longer name' });
      required(schema.miles, { message: 'Tell us how long the trail is' });
      min(schema.miles, 0.1, { message: 'barely a trail' });
      max(schema.miles, 900, { message: "Don't be silly." });
      required(schema.difficulty, { message: 'You need to assign a difficulty' });
    },
    {
      submission: {
        action: async () => {
          console.log(this.model());
          // add the method to the store.
          await this.store.addTrail(this.model());
          this.router.navigateByUrl('');
        },
      },
    },
  );
}
```

### types.ts
`src\app\trails\types.ts`
```typescript
export const difficultyLevels = ['easy', 'moderate', 'hard', 'extreme'] as const;

export type DifficultyLevel = (typeof difficultyLevels)[number];
export interface Trail {
  id: string;
  name: string;
  miles: number;
  difficulty: DifficultyLevel;
}

export type TrailCreate = Omit<Trail, 'id'>;

// export interface TrailModel extends Trail {
//   favorite: boolean;
// }

export type TrailModel = Trail & {
  favorite: boolean;
};

/*
GET /trails

GET /extreme-trails

POST http://localhost:3000/hard-trails
Content-Type: application/json

{
  "name": "Bright Angel",
  "miles": 13.8,

}

*/
```

### trails-store.ts
`src\app\trails\services\trails-store.ts`
```typescript
import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, inject } from '@angular/core';
import { withStellarDevtools } from '@hypertheory-labs/stellar-ng-devtools';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Trail, TrailCreate } from '../types';
import { firstValueFrom } from 'rxjs';

interface TrailsState {
  favorites: string[];
}
export const trailsStore = signalStore(
  withStellarDevtools('trails-store', {
    description: 'This keeps a list of trails and the favorites',
  }),
  withState<TrailsState>({
    favorites: [],
  }),
  withProps(() => ({
    trailsResource: httpResource<Trail[]>(() => 'http://localhost:3000/trails'),
  })),
  withComputed((state) => ({
    trailsWithFavorites: computed(() => {
      const trails = state.trailsResource.value() || [];
      return trails.map((trail) => ({
        ...trail,
        favorite: state.favorites().some((favoriteId) => favoriteId === trail.id),
      }));
    }),
  })),
  withMethods((state) => {
    const httpClient = inject(HttpClient);
    return {
      addTrail: async (trail: TrailCreate) => {
        return await firstValueFrom(httpClient.post<Trail>('http://localhost:3000/trails', trail));
      },
      toggleFavorite: (trailId: string) => {
        const currentFavorites = state.favorites();
        const currentFavoritesSet = new Set(currentFavorites);
        if (currentFavoritesSet.has(trailId)) {
          currentFavoritesSet.delete(trailId);
        } else {
          currentFavoritesSet.add(trailId);
        }
        patchState(state, { favorites: Array.from(currentFavoritesSet) });
      },
    };
  }),
  withHooks({
    onInit(store) {
      const savedItem = localStorage.getItem('favorites');
      if (savedItem) {
        const storedItems = JSON.parse(savedItem) as string[];
        patchState(store, { favorites: storedItems });
      }
      effect(() => {
        const favorites = store.favorites();
        localStorage.setItem('favorites', JSON.stringify(favorites));
      });
    },
  }),
);
```

---

## Handler registration

### handlers.ts
`src\mocks\handlers.ts`
```typescript
import { HttpHandler } from 'msw';

import bypassed from './bypassed-endpoints';
import trailsHandlers from './trails/trails';
const all: HttpHandler[] = [...trailsHandlers];

export const handlers: HttpHandler[] = all.filter((h) => {
  const { method, path } = h.info;
  if (typeof method !== 'string' || typeof path !== 'string') return true;
  return !bypassed.has(`${method} ${path}`);
});
```

---

## Existing manifests + handlers (pattern reference)

### trails.yaml
`src\mocks\trails\trails.yaml`
```yaml
endpoint: http://localhost:3000/trails
method: GET
shape: collection
description: List of trails rendered by the trails list page and summarized by the stats panel.

responseType:
  name: Trail
  path: src/app/trails/types.ts

context:
  sourceHints:
    - src/app/trails/trails-list.ts
    - src/app/trails/services/trails-store.ts
    - src/app/trails/trail-card.ts
    - src/app/trails/trail-stats.ts
    - src/app/trails/pipes/miles-feet.ts
    - src/app/trails/types.ts
  hints:
    - "The list tracks by 'daTrail.name', not by 'id'. Duplicate names in one payload trigger Angular's duplicate-track-key error (NG0955)."
    - "trailsResource is an httpResource with no error, loading, or empty-state markup anywhere in the template — error and slow scenarios currently render as a bare, empty grid."
    - "'favorite' is not part of the API response. It is computed client-side by matching 'trail.id' against the favorites array persisted in localStorage under the key 'favorites'."
    - "MilesToFeetPipe calls '.toLocaleString()' on the multiplied value, so a null/undefined 'miles' throws during render rather than degrading."
    - "trail-card only colors the difficulty text for the four literal union values; any other string renders uncolored."
    - "trail-stats keys 'milesByDifficulty' off whatever difficulty strings arrive, so an unexpected value adds a row to the stats panel."

scenarios:
  typical:
    description: Tests that the card grid and the stats panel both render, with a spread of difficulties so every difficulty color and every stats row is exercised.
    active: true
  empty:
    description: Tests what the page shows when there is nothing to render — currently an empty grid and a stats panel reading 0, with no empty-state message.
  single-trail:
    description: Tests the grid at its narrowest, where the responsive column classes have only one card to place.
  overloaded:
    description: Tests the 4-column grid and the stats panel against far more trails than the layout was designed around.
  duplicate-names:
    description: Tests the list's track expression, which keys on name rather than id — two trails sharing a name should surface the duplicate-key failure.
  unknown-difficulty:
    description: Tests that a difficulty outside the four known values still renders, picks up no color class, and adds its own row to the miles-by-difficulty breakdown.
  missing-ids:
    description: Tests favorite toggling when records arrive without an id — marking one card favorite should not silently mark others.
  fractional-miles:
    description: Tests how the total-miles and per-difficulty figures display when summing fractions produces a long floating-point tail.
  zero-and-negative-miles:
    description: Tests the stats panel and the feet conversion against non-positive distances that the type allows but the UI never anticipates.
  malformed-data:
    description: Tests whether partially shaped records break rendering — missing miles hits the feet pipe, missing difficulty hits the color bindings and the stats grouping.
  slow:
    description: Tests what the user sees while the request is in flight, since there is no skeleton or spinner in the template.
    delay: "2500"
  timeout:
    description: Tests the page when the request never settles and the grid stays empty indefinitely.
    delay: infinite
  unauthorized:
    description: Tests the page's behavior when the trails request is rejected and the resource has no error branch to fall back to.
    httpStatus: 401
  server-error:
    description: Tests the failure path when the trails request errors on the server.
    httpStatus: 500
```

### trails.ts
`src\mocks\trails\trails.ts`
```typescript
import { http, HttpHandler, HttpResponse, delay } from 'msw';

import activeScenarios from '../active-scenarios';
import { Trail } from '../../app/trails/types';

const ENDPOINT = 'http://localhost:3000/trails';

const typicalResponse: Trail[] = [
  {
    id: 'bear-lake-loop',
    name: 'Bear Lake Loop',
    miles: 0.8,
    difficulty: 'easy',
  },
  {
    id: 'fern-canyon-loop',
    name: 'Fern Canyon Loop',
    miles: 1.1,
    difficulty: 'easy',
  },
  {
    id: 'emerald-lake-trail',
    name: 'Emerald Lake Trail',
    miles: 3.2,
    difficulty: 'easy',
  },
  {
    id: 'delicate-arch-trail',
    name: 'Delicate Arch Trail',
    miles: 3.2,
    difficulty: 'moderate',
  },
  {
    id: 'cadillac-north-ridge',
    name: 'Cadillac North Ridge Trail',
    miles: 4.4,
    difficulty: 'moderate',
  },
  {
    id: 'mist-trail-vernal-fall',
    name: 'Mist Trail to Vernal Fall',
    miles: 2.4,
    difficulty: 'moderate',
  },
  {
    id: 'skyline-trail-loop',
    name: 'Skyline Trail Loop',
    miles: 5.5,
    difficulty: 'hard',
  },
  {
    id: 'alum-cave-to-leconte',
    name: 'Alum Cave Trail to Mount LeConte',
    miles: 11,
    difficulty: 'hard',
  },
  {
    id: 'bright-angel-trail',
    name: 'Bright Angel Trail',
    miles: 9.5,
    difficulty: 'hard',
  },
  {
    id: 'angels-landing',
    name: 'Angels Landing',
    miles: 5.4,
    difficulty: 'extreme',
  },
  {
    id: 'half-dome-via-mist-trail',
    name: 'Half Dome via the Mist Trail',
    miles: 14.2,
    difficulty: 'extreme',
  },
];

const singleTrailResponse: Trail[] = [
  {
    id: 'chasm-lake-trail',
    name: 'Chasm Lake Trail',
    miles: 8.4,
    difficulty: 'hard',
  },
];

const DIFFICULTIES: Trail['difficulty'][] = ['easy', 'moderate', 'hard', 'extreme'];

const overloadedResponse: Trail[] = Array.from({ length: 60 }, (_, index) => ({
  id: `trail-${index + 1}`,
  name: `Ridge Runner Trail Segment ${index + 1}`,
  miles: Number((0.5 + index * 0.35).toFixed(1)),
  difficulty: DIFFICULTIES[index % DIFFICULTIES.length],
}));

// Two records share a name — the list tracks by name, not id.
const duplicateNamesResponse: Trail[] = [
  {
    id: 'lost-lake-trail-co',
    name: 'Lost Lake Trail',
    miles: 4.1,
    difficulty: 'moderate',
  },
  {
    id: 'lost-lake-trail-or',
    name: 'Lost Lake Trail',
    miles: 6.7,
    difficulty: 'hard',
  },
  {
    id: 'crater-lake-rim',
    name: 'Crater Lake Rim Trail',
    miles: 5.9,
    difficulty: 'moderate',
  },
];

const unknownDifficultyResponse = [
  {
    id: 'the-narrows-bottom-up',
    name: 'The Narrows, Bottom Up',
    miles: 9.4,
    difficulty: 'strenuous',
  },
  {
    id: 'kalalau-trail',
    name: 'Kalalau Trail',
    miles: 22,
    difficulty: 'expert-only',
  },
  {
    id: 'harding-icefield-trail',
    name: 'Harding Icefield Trail',
    miles: 8.2,
    difficulty: 'hard',
  },
] as unknown as Trail[];

const missingIdsResponse = [
  {
    name: 'Devils Garden Primitive Loop',
    miles: 7.9,
    difficulty: 'hard',
  },
  {
    name: 'Hanging Lake Trail',
    miles: 2.4,
    difficulty: 'moderate',
  },
  {
    id: '',
    name: 'Sky Pond via Glacier Gorge',
    miles: 9,
    difficulty: 'hard',
  },
] as unknown as Trail[];

const fractionalMilesResponse: Trail[] = [
  {
    id: 'sol-duc-falls-trail',
    name: 'Sol Duc Falls Trail',
    miles: 1.1,
    difficulty: 'easy',
  },
  {
    id: 'hoh-river-trail',
    name: 'Hoh River Trail',
    miles: 2.2,
    difficulty: 'easy',
  },
  {
    id: 'marymere-falls-trail',
    name: 'Marymere Falls Trail',
    miles: 3.3,
    difficulty: 'easy',
  },
  {
    id: 'hurricane-hill-trail',
    name: 'Hurricane Hill Trail',
    miles: 0.7,
    difficulty: 'moderate',
  },
];

const zeroAndNegativeMilesResponse: Trail[] = [
  {
    id: 'trailhead-overlook',
    name: 'Trailhead Overlook',
    miles: 0,
    difficulty: 'easy',
  },
  {
    id: 'unsurveyed-spur',
    name: 'Unsurveyed Spur',
    miles: -2.5,
    difficulty: 'moderate',
  },
  {
    id: 'grinnell-glacier-trail',
    name: 'Grinnell Glacier Trail',
    miles: 10.3,
    difficulty: 'hard',
  },
];

const malformedResponse = [
  {
    id: 'no-miles-recorded',
    name: 'Old Rag Mountain Loop',
    difficulty: 'hard',
  },
  {
    id: 'null-miles',
    name: 'Precipice Trail',
    miles: null,
    difficulty: 'extreme',
  },
  {
    id: 'no-difficulty',
    name: 'Ice Age Trail, Devils Lake Segment',
    miles: 4.5,
  },
  {
    id: 'nameless',
    miles: 3.1,
    difficulty: 'moderate',
  },
] as unknown as Trail[];

export default [
  http.get(ENDPOINT, async () => {
    const scenario = activeScenarios[`GET ${ENDPOINT}`] ?? 'typical';

    switch (scenario) {
      case 'empty':
        return HttpResponse.json([]);
      case 'single-trail':
        return HttpResponse.json(singleTrailResponse);
      case 'overloaded':
        return HttpResponse.json(overloadedResponse);
      case 'duplicate-names':
        return HttpResponse.json(duplicateNamesResponse);
      case 'unknown-difficulty':
        return HttpResponse.json(unknownDifficultyResponse);
      case 'missing-ids':
        return HttpResponse.json(missingIdsResponse);
      case 'fractional-miles':
        return HttpResponse.json(fractionalMilesResponse);
      case 'zero-and-negative-miles':
        return HttpResponse.json(zeroAndNegativeMilesResponse);
      case 'malformed-data':
        return HttpResponse.json(malformedResponse);
      case 'slow':
        await delay(2500);
        return HttpResponse.json(typicalResponse);
      case 'timeout':
        await delay('infinite');
        return HttpResponse.json(typicalResponse);
      case 'unauthorized':
        return new HttpResponse(null, { status: 401 });
      case 'server-error':
        return new HttpResponse(null, { status: 500 });
      case 'typical':
      default:
        return HttpResponse.json(typicalResponse);
    }
  }),
] as HttpHandler[];
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
