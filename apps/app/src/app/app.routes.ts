import { Route } from '@angular/router';
import { authGuard, redirectLoggedInGuard } from './auth/auth-guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login.page').then((m) => m.LoginPage),
    title: 'Login',
    canActivate: [redirectLoggedInGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register.page').then((m) => m.RegisterPage),
    title: 'Register',
    canActivate: [redirectLoggedInGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    title: 'Dashboard',
    canActivate: [authGuard()],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.page').then((m) => m.AdminPage),
    title: 'Admin',
    canActivate: [authGuard('admin')],
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./pages/forbidden.page').then((m) => m.ForbiddenPage),
    title: 'Forbidden',
    canActivate: [authGuard()],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/404.page').then((m) => m.NotFoundPage),
    title: 'Not Found',
  },
];
