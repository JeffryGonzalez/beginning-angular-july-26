import { Component, signal } from '@angular/core';

import { PageHeader } from './headings/page-header/page-header';
import { TrailCard } from './trails/trail-card';

@Component({
  selector: 'app-root',
  imports: [PageHeader, TrailCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('trail-log');
}
