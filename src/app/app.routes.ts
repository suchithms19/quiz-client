import { Routes } from '@angular/router';
import { Createbank } from './createbank/createbank';
import { Landing } from './landing/landing';

export const routes: Routes = [
  {
    path: 'create-qbank',
    component: Createbank
  },
  {
    path: 'dashboard',
    component: Landing
  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }
];
