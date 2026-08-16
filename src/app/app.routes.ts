import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'auth/signup',
    loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup)
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list/project-list').then(m => m.ProjectList)
      },
      {
        path: 'projects/new',
        loadComponent: () => import('./features/projects/project-form/project-form').then(m => m.ProjectForm)
      },
      {
        path: 'generator',
        loadComponent: () => import('./features/generator/chapter-generator/chapter-generator').then(m => m.ChapterGenerator)
      },
      {
        path: 'generator/editor/:projectId/:chapterId',
        loadComponent: () => import('./features/generator/chapter-editor/chapter-editor').then(m => m.ChapterEditor)
      },
      {
        path: 'export',
        loadComponent: () => import('./features/export/export-page/export-page').then(m => m.ExportPage)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./features/pricing/pricing-page/pricing-page').then(m => m.PricingPage)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
