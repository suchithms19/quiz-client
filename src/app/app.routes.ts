import { Routes } from '@angular/router';
import { Createbank, Landing, ViewQbanks } from 'quiz-components';

export const routes: Routes = [
  {
    path: 'create-qbank',
    component: Createbank
  },
  {
    path: 'view-qbanks',
    component: ViewQbanks
  },
  {
    path: 'dashboard',
    component: Landing
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
