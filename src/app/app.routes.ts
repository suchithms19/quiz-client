import { Routes } from '@angular/router';
import { Createbank, Landing } from 'quiz-components';

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
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];
