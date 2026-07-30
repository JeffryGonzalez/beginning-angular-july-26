import { TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TrailModel } from './types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trail-stats',
  imports: [TitleCasePipe, RouterLink],
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
      <a routerLink="add" class="btn btn-primary">Add A Trail</a>
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
