import { Component, signal } from '@angular/core';

import { PageHeader } from './headings/page-header/page-header';
import { TrailList } from './trails/trails-list';
import { StellarOverlayComponent } from '@hypertheory-labs/stellar-ng-devtools';

@Component({
  selector: 'app-root',
  imports: [PageHeader, TrailList, StellarOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('trail-log');
}
