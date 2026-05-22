import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/add-conserve/add-conserve.component').then((m) => m.AddConserveComponent),
  },
  {
    path: 'conserves/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/conserve-detail/conserve-detail.component').then((m) => m.ConserveDetailComponent),
  },
  {
    path: 'conserves/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/add-conserve/add-conserve.component').then((m) => m.AddConserveComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: '' },
];
