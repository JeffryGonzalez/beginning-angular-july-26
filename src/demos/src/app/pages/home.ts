import { Component, inject } from '@angular/core';
import { counterStore } from '../demonstrations/counter-store';

@Component({
  selector: 'app-pages-home',
  imports: [],
  template: `
    <p>Welcome to the home page!</p>

    <br />
    <p>By the way, your counter by value {{ counterService.by() }}</p>
  `,
  styles: ``,
})
export class Home {
  counterService = inject(counterStore);
}
