import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from './core/guards/not-authenticated.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        (mod) => mod.LandingComponent
      ),
    canActivate: [notAuthenticatedGuard],
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        (mod) => mod.SignupComponent
      ),
    canActivate: [notAuthenticatedGuard],
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
    canActivate: [notAuthenticatedGuard],
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password.component').then(
        (mod) => mod.ForgotPasswordComponent
      ),
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component').then(
        (mod) => mod.ResetPasswordComponent
      ),
  },

  {
    path: 'email-verification',
    loadComponent: () =>
      import(
        './components/email-verification/email-verification.component'
      ).then((mod) => mod.EmailVerificationComponent),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(
        (mod) => mod.HomeComponent
      ),
    canActivate: [authenticatedGuard],
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (mod) => mod.ProfileComponent
      ),
    canActivate: [authenticatedGuard],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (mod) => mod.NotFoundComponent
      ),
    canActivate: [authenticatedGuard],
  },
];
