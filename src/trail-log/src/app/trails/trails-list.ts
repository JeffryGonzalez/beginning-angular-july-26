import { Component, computed, signal } from '@angular/core';

import { TrailStats } from './trail-stats';
import { Trail } from './types';
import { TrailCard } from './trail-card';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <app-trail-stats [trailList]="trails()"> </app-trail-stats>
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
        @for (trail of trails(); track trail.name) {
          <app-trails-trail-card [trail]="trail" class="" />
        }
      </div>
    </div>
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
}
