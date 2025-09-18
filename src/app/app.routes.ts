import { Routes } from '@angular/router';
import { Createbank } from './components/createbank/createbank';
import { Landing } from './components/landing/landing';

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
