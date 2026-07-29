import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

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
  `,
  styles: ``,
})
export class HomePage {}
