import { Component, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { StellarOverlayComponent } from '@hypertheory-labs/stellar-ng-devtools';
import { PageHeader } from './headings/page-header/page-header';

@Component({
  selector: 'app-root',
  imports: [PageHeader, StellarOverlayComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('trail-log');
}
