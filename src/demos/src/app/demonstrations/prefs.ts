import { Component, inject, signal } from '@angular/core';
import { CounterData } from './counter-data';

@Component({
  selector: 'app-demos-prefs',
  imports: [],
  template: `
    <div class="join">
      @for (by of service.countByRange; track by) {
        <button
          (click)="service.setBy(by)"
          [ariaDisabled]="service.byValue() === by"
          class="btn join-item"
        >
          {{ by }}
        </button>
      }
    </div>
  `,
  styles: ``,
})
export class Prefs {
  service = inject(CounterData);
}
