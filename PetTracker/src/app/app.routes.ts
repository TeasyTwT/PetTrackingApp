import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)},
  {path: 'tabs', loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes), canActivate: [authGuard]},
  {path: 'track/:id/:section', loadComponent: () => import('./pages/track/track.page').then(m => m.TrackPage), canActivate: [authGuard]},
  {path: '**', redirectTo: 'login'},
];
