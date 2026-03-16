import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { adminGuard } from '../core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login',    loadComponent: () => import('../pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('../pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'home',     loadComponent: () => import('../pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'movies/:id', loadComponent: () => import('../pages/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent) },
  { path: 'watchlist',  loadComponent: () => import('../pages/watchlist/watchlist.component').then(m => m.WatchlistComponent), canActivate: [authGuard] },
  { path: 'admin',      loadComponent: () => import('../pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: 'home' }
];