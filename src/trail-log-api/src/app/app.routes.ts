import { Routes } from '@angular/router';
import { TrailList } from './trails/trails-list';
import { AddTrail } from './trails/add-trail';

export const routes: Routes = [
  {
    path: '',
    component: TrailList,
  },
  {
    path: 'add',
    component: AddTrail,
  },
];
