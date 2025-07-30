// src/app/auth/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  // Use inject() in a way that's safe for the injection context
  const canActivate = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (typeof window === 'undefined') {
      return true; // Skip check during server-side rendering
    }

    if (authService.isAuthenticated()) {
      return true;
    }
    
    // Redirect to the login page
    return router.createUrlTree(['/login']);
  };

  try {
    return canActivate();
  } catch (e) {
    console.error('AuthGuard error:', e);
    const router = inject(Router);
    return router.createUrlTree(['/login']);
  }
};
