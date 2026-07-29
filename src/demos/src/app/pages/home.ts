import { Component, inject } from '@angular/core';
import { CounterData } from '../demonstrations/counter-data';

@Component({
  selector: 'app-pages-home',
  imports: [],
  template: `
    <p>Welcome to the home page!</p>

    <br />
    <p>By the way, your counter by value {{ counterService.byValue() }}</p>
  `,
  styles: ``,
})
export class Home {
  counterService = inject(CounterData);
}
