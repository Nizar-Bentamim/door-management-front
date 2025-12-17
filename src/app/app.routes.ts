import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/doors',
    pathMatch: 'full'
  },
  {
    path: 'doors',
    loadComponent: () => import('./components/door-list/door-list.component').then(m => m.DoorListComponent)
  },
  {
    path: 'doors/new',
    loadComponent: () => import('./components/door-form/door-form.component').then(m => m.DoorFormComponent)
  },
  {
    path: 'doors/:id',
    loadComponent: () => import('./components/door-detail/door-detail.component').then(m => m.DoorDetailComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'users/new',
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
  }
];
