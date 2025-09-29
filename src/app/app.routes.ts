import { Routes } from '@angular/router';
import { Createbank, Landing, ViewQbanks, ViewQbankDetails } from 'quiz-components';

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
    path: 'view-qbanks/:id',
    component: ViewQbankDetails 
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
