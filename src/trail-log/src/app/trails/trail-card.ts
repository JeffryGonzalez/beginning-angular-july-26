import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TrailModel } from './types';
import { Favorites } from './favorites';

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
  readonly trail = input.required<TrailModel>();
  favoriteService = inject(Favorites);
  protected toggleFavorite() {
    this.favoriteService.toggleFavorite(this.trail().id);
  }
}
