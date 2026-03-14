import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/components/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./ui/app-layout/app-layout.component').then(
        (m) => m.AppLayoutComponent
      ),
    children: [
      {
        path: 'tasks',
        loadComponent: () =>
          import('./tasks/components/task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
];
