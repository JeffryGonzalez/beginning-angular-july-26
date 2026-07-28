import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeader } from './headings/page-header/page-header';

// attribute (metadata decorator - attribute [HttpGet] ,[TestMethod])
@Component({
  selector: 'app-root',
  imports: [PageHeader, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
