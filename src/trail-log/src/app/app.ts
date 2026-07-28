import { Component, signal } from '@angular/core';

import { PageHeader } from './headings/page-header/page-header';
import { TrailList } from './trails/trails-list';

@Component({
  selector: 'app-root',
  imports: [PageHeader, TrailList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('trail-log');
}
