# msw-lens context
generated: 2026-07-30T16:28:10.597Z
entry: src\app\trails\trails-list.ts

---

## The ask

I'm working on the `TrailsList` component in a web application and want to
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

### trails-list.ts
`src\app\trails\trails-list.ts`
```typescript
import { Component, inject } from '@angular/core';

import { trailsStore } from './services/trails-store';
import { TrailCard } from './trail-card';
import { TrailStats } from './trail-stats';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <app-trail-stats [trailList]="store.trailsWithFavorites()"> </app-trail-stats>
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
        @for (daTrail of store.trailsWithFavorites(); track daTrail.name) {
          <app-trails-trail-card [trail]="daTrail" class="" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class TrailList {
  readonly store = inject(trailsStore);
}
```

### trails-store.ts
`src\app\trails\services\trails-store.ts`
```typescript
import { httpResource } from '@angular/common/http';
import { computed, effect } from '@angular/core';
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
import { Trail } from '../types';

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
  withProps(() =>({
    trailsResource: httpResource<Trail[]>(() => 'http://localhost:300/trails')
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
  withMethods((state) => ({
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
  })),
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

### trail-card.ts
`src\app\trails\trail-card.ts`
```typescript
import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MilesToFeetPipe } from './pipes/miles-feet';
import { trailsStore } from './services/trails-store';
import { TrailModel } from './types';

@Component({
  selector: 'app-trails-trail-card',
  imports: [TitleCasePipe, MilesToFeetPipe],
  template: `
    <div class="card-body">
      <h2 class="card-title text-secondary">{{ trail().name }}</h2>
      <div class="stats stats-vertical lg:stats-vertical shadow">
        <div class="stat">
          <div class="stat-title">Miles</div>
          <div class="stat-value">{{ trail().miles }}</div>
          <div class="stat-desc">{{ trail().miles | milesFeet }}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Level</div>
          <div class="stat-value">
            <span
              [class.text-success]="trail().difficulty === 'easy'"
              [class.text-info]="trail().difficulty === 'moderate'"
              [class.text-warning]="trail().difficulty === 'hard'"
              [class.text-error]="trail().difficulty === 'extreme'"
              >{{ trail().difficulty | titlecase }}</span
            >
          </div>
        </div>
      </div>
      <div class="card-actions justify-end">
        <label
          class="label"
          [class.text-success]="trail().favorite"
          [class.text-neutral]="!trail().favorite"
        >
          {{ trail().favorite ? 'Favorite!' : 'Mark as Favorite' }}
          <input
            type="checkbox"
            [checked]="trail().favorite"
            (change)="toggleFavorite()"
            class="toggle toggle-sm"
          />
        </label>
      </div>
    </div>
  `,

  styleUrl: './trail-card.css',
  host: {
    '[class.ring-4]': 'trail().favorite',
    '[class.ring-success]': 'trail().favorite',
  },
})
export class TrailCard {
  readonly trail = input.required<TrailModel>();
  readonly store = inject(trailsStore);
  protected toggleFavorite() {
    this.store.toggleFavorite(this.trail().id);
  }
}
```

### trail-stats.ts
`src\app\trails\trail-stats.ts`
```typescript
import { Component, computed, input } from '@angular/core';
import { Trail, TrailModel } from './types';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-trail-stats',
  imports: [TitleCasePipe],
  template: `
    <div class="stats stats-vertical shadow">
      <div class="stat">
        <div class="stat-title text-accent">Total Miles of Trails</div>
        <div class="stat-value text-secondary">{{ trailStats().totalMiles }}</div>
      </div>

      <div class="stat">
        <div class="stat-title text-accent">Number of Trails</div>
        <div class="stat-value text-secondary">{{ trailStats().numberOfTrails }}</div>
      </div>

      <div class="stat">
        <div class="stat-title text-accent">Favorite Trails</div>
        <div class="stat-value text-secondary">
          {{ trailStats().countOfFavoriteTrails }} / {{ trailStats().numberOfTrails }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-title text-accent">Miles by Difficulty</div>
        <div class="stat-value text-secondary">
          @for (difficulty of difficulties(); track $index) {
            <div class="text-sm">
              {{ difficulty | titlecase }}: {{ trailStats().milesByDifficulty[difficulty] || 0 }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class TrailStats {
  readonly trailList = input.required<TrailModel[]>();

  protected readonly trailStats = computed(() => {
    const trails = this.trailList();
    const totalMiles = trails.reduce((sum, trail) => sum + trail.miles, 0);
    const favoriteCount = trails.filter((trail) => trail.favorite).length;
    const numberOfTrails = trails.length;

    const milesByDifficulty = trails.reduce(
      (acc, trail) => {
        if (!acc[trail.difficulty]) {
          acc[trail.difficulty] = 0;
        }
        acc[trail.difficulty] += trail.miles;
        return acc;
      },
      {} as Record<string, number>,
    );
    const countOfFavoriteTrails = trails.filter((trail) => trail.favorite).length;
    return { totalMiles, favoriteCount, milesByDifficulty, countOfFavoriteTrails, numberOfTrails };
  });

  protected readonly difficulties = computed(() => {
    return Object.keys(this.trailStats().milesByDifficulty);
  });
}
```

### types.ts
`src\app\trails\types.ts`
```typescript
export interface Trail {
  id: string;
  name: string;
  miles: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
}

// export interface TrailModel extends Trail {
//   favorite: boolean;
// }

export type TrailModel = Trail & {
  favorite: boolean;
};
```

### miles-feet.ts
`src\app\trails\pipes\miles-feet.ts`
```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'milesFeet',
})
export class MilesToFeetPipe implements PipeTransform {
  transform(miles: number): string {
    const feet = miles * 5280;
    return `${miles} miles (${feet.toLocaleString()} feet)`;
  }
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
