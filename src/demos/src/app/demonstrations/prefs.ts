import { Component, inject } from '@angular/core';
import { counterStore } from './counter-store';

@Component({
  selector: 'app-demos-prefs',
  imports: [],
  template: `
    <div class="join">
      @for (by of service.countByRange; track by) {
        <button
          (click)="service.setBy(by)"
          [ariaDisabled]="service.by() === by"
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
  service = inject(counterStore);
}
