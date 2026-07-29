import { Component, inject } from '@angular/core';
import { counterStore } from './counter-store';

@Component({
  selector: 'app-new-counter',
  imports: [],
  template: ``,
  styles: ``,
})
export class Counter {
  service = inject(counterStore);
}
