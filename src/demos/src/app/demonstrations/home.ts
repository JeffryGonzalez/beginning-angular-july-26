import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { counterStore } from './counter-store';

@Component({
  selector: 'app-demonstrations-home',
  imports: [RouterOutlet, RouterLink],
  template: `
    <h2 class="text-2xl font-bold">Demonstrations</h2>

    <div class="flex flex-row gap-4">
      <a class="btn btn-link" routerLink="counter">Counter</a>
      <a class="btn btn-link" routerLink="prefs">Prefs</a>
    </div>

    <router-outlet />

    <div>
      <p>Current: {{ store.current() }} counting by {{ store.by() }}</p>
    </div>
  `,
  styles: ``,
})
export class HomePage {
  store = inject(counterStore);
}
