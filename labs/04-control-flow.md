# Component control flow 

We are obviously going to want to have more than one trail in our application. Later on we'll get our data for the trails from a backing API service, for now we'll just use a hardcoded list of trails. 

## Create a "parent" component 

A "parent" component is a component that contains other components. In our case, the parent component will be the component that contains the list of trails.

In the `src/app/trails` directory, create a new file called `trails-list.ts`.

In this component, we'll create a list of sample trails. For now, we'll forget about our trail card for a moment and just display the list of trails as a simple list of text. 

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-trails-list',
  imports: [],
  template: `
    <ul>
      @for (trail of trails(); track trail.name) {
        <li>
          {{ trail.name }} - {{ trail.miles }} miles - {{ trail.difficulty }} -
          {{ trail.favorite ? 'Favorite' : 'Not Favorite' }}
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class TrailList {
  protected readonly trails = signal([
    {
      name: 'Woodpecker Way Loop',
      miles: 1.8,
      difficulty: 'easy',
      favorite: false,
    },
    {
      name: 'Eagle Rock Trail',
      miles: 3.2,
      difficulty: 'moderate',
      favorite: true,
    },
    {
      name: 'Bear Creek Trail',
      miles: 2.5,
      difficulty: 'hard',
      favorite: false,
    },
    {
      name: 'Cedar Ridge Trail',
      miles: 4.1,
      difficulty: 'extreme',
      favorite: false,
    },
    {
      name: 'Pine Valley Trail',
      miles: 5.0,
      difficulty: 'moderate',
      favorite: false,
    },
  ]);
}
```

Let's replace the `trail-card` component with our `trails-list` component in the `src/app.html` file.

Eventually (soon) we'll want to use our new `trails-card` component instead of that ugly text, but for now, let's keep it simple and use some signals to compute some values. 

We want to calculate the following:
- Total number of trails
- Total miles of all trails
- Number of trails by difficulty
- Number of favorite trails


I'm going to use a `computed` signal to calculate these values, along with some JavaScript magic. Add the following to your `trails-list` component:

```ts
protected readonly trailStats = computed(() => {
  const trails = this.trails();
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
  return { totalMiles, favoriteCount, numberOfTrails, milesByDifficulty, countOfFavoriteTrails };
});
``` 

I'm not sure how to best display these yet, so I'll just use a `<pre>` tag and the `JsonPipe` pipe to "dump" them on the screen so I can see *something*.

```ts
import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-trails-list',
  imports: [JsonPipe],
  template: `
    <ul>
      @for (trail of trails(); track trail.name) {
        <li>
          {{ trail.name }} - {{ trail.miles }} miles - {{ trail.difficulty }} -
          {{ trail.favorite ? 'Favorite' : 'Not Favorite' }}
        </li>
      }
    </ul>
    <pre>
      {{ trailStats() | json }}
    </pre>
  `,
  styles: ``,
})
export class TrailsList {
  //... omitted
}
```

Ok, we see *something*. The question I'd ask myself right now is "should the trails list be responsible for calculating and displaying these stats? Are trail stats an important enough concept to warrant their own component?"

Ok, admittedly, I might say that, but I'd probably think "wow, that seems like *a lot*. I'll get to that later. Let's put it somewhere though."


## Create a component with a job: `input`s

We are going to create a new component called `trail-stats` (put it in that trails directory) that will display the trail stats. We will use `input`s to pass the stats to the component.
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-trail-stats',
  imports: [],
  template: ``,
  styles: ``,
})
export class TrailStats {}

```

This will be a *child* component of `trails-list`. And the trails-list will hand this component the list of trails and let it calculate and display the stats.  

### Define a type 

Once we start passing data around, it's a good idea to define a TypeScript type for the data we're passing. Let's create a file called "types.ts" in the trails directory and define a type for the trail stats.

```ts
export interface Trail {
    name: string;
    miles: number;
    difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
    favorite: boolean;
}
```

> Note: I'm using a TypeScript interface here to define a type, which is a "shape" of the data we're passing. Notice I used the literal type `'easy' | 'moderate' | 'hard' | 'extreme'` to define the difficulty. We already thought of that when we defined the `difficulty` field in the `trail-card` interface.

To be honest, you can use *either* an interface *or* a type alias to define a type. They are very similar, but there are some very slight differences. I usually use type aliases. If I'm on a project with expressed preferences, I go with the low of the team. Here's what that would look like as a Type alias:

```ts
export type Trail = {
  name: string;
  miles: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
  favorite: boolean;
};
``` 

Using this, we can let the new `trail-stats` component say what data it will accept and display should look like. We'll do this using an `input`. We'll make this input required, because it doesn't make sense to have a `trail-stats` component without any data.

So, back on `trails-stats.ts`:


```ts
import { Component, input } from '@angular/core';
import { Trail } from './types';

@Component({
  selector: 'app-trail-stats',
  imports: [],
  template: ``,
  styles: ``,
})
export class TrailStats {
  protected readonly trailList = input.required<Trail[]>();
}
```

Now if we go back to the `trails-list` component, we can use the `trail-stats` component we just created to display the trail stats.

Here's the updated `trails-list` component. Notices that I used the type of `Trail[]` as a generic argument for the `list` signal.

```ts
import { Component, computed, signal } from '@angular/core';
import { TrailStats } from './trail-stats';
import { Trail } from './types';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats],
  template: `
    <ul>
      @for (trail of trails(); track trail.name) {
        <li>
          {{ trail.name }} - {{ trail.miles }} miles - {{ trail.difficulty }} -
          {{ trail.favorite ? 'Favorite' : 'Not Favorite' }}
        </li>
      }
    </ul>
    <app-trail-stats [trailList]="trails()"> </app-trail-stats>
  `,
  styles: ``,
})
export class TrailList {
  protected readonly trails = signal<Trail[]>([
    {
      name: 'Woodpecker Way Loop',
      miles: 1.8,
      difficulty: 'easy',
      favorite: false,
    },
    {
      name: 'Eagle Rock Trail',
      miles: 3.2,
      difficulty: 'moderate',
      favorite: true,
    },
    {
      name: 'Bear Creek Trail',
      miles: 2.5,
      difficulty: 'hard',
      favorite: false,
    },
    {
      name: 'Cedar Ridge Trail',
      miles: 4.1,
      difficulty: 'extreme',
      favorite: false,
    },
    {
      name: 'Pine Valley Trail',
      miles: 5.0,
      difficulty: 'moderate',
      favorite: false,
    },
  ]);

  protected readonly trailStats = computed(() => {
    const trails = this.trails();
    const totalMiles = trails.reduce((sum, trail) => sum + trail.miles, 0);
    const favoriteCount = trails.filter((trail) => trail.favorite).length;

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
    return { totalMiles, favoriteCount, milesByDifficulty, countOfFavoriteTrails };
  });
}
```

## Complete the stats component

Let's move the `trailStats` computation to the `trail-stats` component, and figure out a way to display the stats. Here's what I came up with:

```ts
import { Component, computed, input } from '@angular/core';
import { Trail } from './types';
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
  protected readonly trailList = input.required<Trail[]>();

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

I updated the `trails-list` template a bit:

```html
<div class="flex flex-row gap-4">
  <app-trail-stats [trailList]="trails()"> </app-trail-stats>
  <ul>
    @for (trail of trails(); track trail.name) {
      <li>
        {{ trail.name }} - {{ trail.miles }} miles - {{ trail.difficulty }} -
        {{ trail.favorite ? 'Favorite' : 'Not Favorite' }}
      </li>
    }
  </ul>
</div>
```
## Use the trail-card component 

Let's use the `trail-card` component to display the trails in the list. I'm going to update the `trails-list` template to use it (make sure you add the related imports, etc.).

First we'll make a little tweak to the `trail-card` component's CSS:

```css
@import '../../styles.css';

:host {
  @apply card card-xl bg-base-300 w-full;
}
```

Also, let's update the `trails-list` template to use the `trail-card` component:

```html
<div class="flex flex-col md:flex-row gap-4">
  <app-trail-stats [trailList]="trails()"> </app-trail-stats>
  <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
    @for (trail of trails(); track trail.name) {
      <app-trails-trail-card class="" />
    }
  </div>
</div>
```

Looks ok - we have an equal number of trail cards to trails, but the cards are all displaying the same content.

Let's update the `trail-card` component to use the trail data from the `trails-list` template. We'll make another input, and update the template (and CSS) to use it. 

> Note: You'll notice an error on the toggle favorite button. Let's just comment it out for now.

```ts
import { TitleCasePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { Trail } from './types';

@Component({
  selector: 'app-trails-trail-card',
  imports: [TitleCasePipe],
  template: `
    <div class="card-body">
      <h2 class="card-title text-secondary">{{ trail().name }}</h2>
      <div class="stats stats-vertical lg:stats-horizontal shadow">
        <div class="stat">
          <div class="stat-title">Miles</div>
          <div class="stat-value">{{ trail().miles }}</div>
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
  readonly trail = input.required<Trail>();

  protected toggleFavorite() {
    //this.favorite.set(!this.favorite());
  }
}
```
