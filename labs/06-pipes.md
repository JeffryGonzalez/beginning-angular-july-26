# Creating a filter (pipe)

We will create a pipe function that will convert the miles of each trail into feet, and use this to display more detailed information on the trail card.

Pipes in Angular are simple transforms. That transform the value given to them to some new value. Angular has many built-in pipes, such as `JsonPipe`, `CurrencyPipe`, `DatePipe`, `TitleCasePipe`, and `PercentPipe`.

Here we will create a new pipe called `MilesToFeetPipe`.

## Create the pipe

in `src/app/trails`, create a new directory called `pipes`, with a file called `miles-feet.ts`

In that file, add the following.

```ts
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

Notice that the `@Pipe` decorator requires a name for the pipe. We are calling ours 'milesFeet'.

## Apply the pipe to the trail card

We will adjust the layout of our trail card a bit, and add the use of our new pipe.

`/src/app/trails/trail-card.ts`

```ts diff
import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TrailModel } from './types';
import { Favorites } from './services/favorites';
+ import { MilesToFeetPipe } from './pipes/miles-feet';

@Component({
  selector: 'app-trails-trail-card',
-  imports: [TitleCasePipe],
+  imports: [TitleCasePipe, MilesToFeetPipe],
  template: `
    <div class="card-body">
      <h2 class="card-title text-secondary">{{ trail().name }}</h2>
-        <div class="stats stats-vertical lg:stats-horizontal shadow">
+      <div class="stats stats-vertical lg:stats-vertical shadow">
        <div class="stat">
          <div class="stat-title">Miles</div>
          <div class="stat-value">{{ trail().miles }}</div>
+         <div class="stat-desc">{{ trail().miles | milesFeet }}</div>
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
  favoriteService = inject(Favorites);
  protected toggleFavorite() {
    this.favoriteService.toggleFavorite(this.trail().id);
  }
}
```