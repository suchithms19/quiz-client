import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'create-qbank',
    loadComponent: () => import('./createbank/createbank').then(m => m.Createbank)
  },
  {
    path: '',
    loadComponent: () => import('./landing/landing').then(m => m.Landing)
  }
];
