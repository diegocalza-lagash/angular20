// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DashboardComponent } from './dashboard/dashboard/dashboard';
import { AuthGuard } from './auth/guards/auth.guard';
import { UsersComponent } from './dashboard/users/users';
import { UserFormComponent } from './dashboard/user-form/user-form';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [() => {
      // This is a simple synchronous check that doesn't require injection
      if (typeof window === 'undefined') {
        return true;
      }
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Use a timeout to avoid potential change detection issues
        setTimeout(() => window.location.href = '/dashboard', 0);
        return false;
      }
      return true;
    }]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },
      { 
        path: 'products', 
        loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];