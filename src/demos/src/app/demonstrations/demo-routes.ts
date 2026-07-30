import { Routes } from '@angular/router';
import { ChangeDetection } from './change-detection';
import { HomePage } from './home';
import { Prefs } from './prefs';
import { Music } from './music';

export const demoRoutes: Routes = [
  {
    path: 'demos',
    component: HomePage,
    providers: [],
    children: [
      {
        path: 'counter',
        component: ChangeDetection,
      },

      {
        path: 'prefs',
        component: Prefs,
      },
      {
        path: 'music',
        component: Music,
      },
    ],
  },
];
