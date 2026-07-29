import { Routes } from '@angular/router';
import { HomePage } from './home';
import { ChangeDetection } from './change-detection';
import { Prefs } from './prefs';

export const demoRoutes: Routes = [
  {
    path: 'demos',
    component: HomePage,
    children: [
      {
        path: 'counter',
        component: ChangeDetection,
      },

      {
        path: 'prefs',
        component: Prefs,
      },
    ],
  },
];
