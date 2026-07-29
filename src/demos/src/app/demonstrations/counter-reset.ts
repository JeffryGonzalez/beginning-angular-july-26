import { Component, inject } from '@angular/core';
import { counterStore } from './counter-store';

@Component({
  selector: 'app-counter-reset',
  imports: [],
  template: `
    <button
      [ariaDisabled]="service.current() === 0"
      (click)="service.reset()"
      class="btn btn-primary"
    >
      Reset
    </button>
  `,
  styles: ``,
})
export class CounterReset {
  service = inject(counterStore);
}
