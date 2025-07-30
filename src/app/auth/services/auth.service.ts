// src/app/auth/services/auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_KEY = 'auth_token';
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Initialize the auth state
    if (this.isBrowser) {
      this.loggedIn.next(!!this.getToken());
    }
  }

  private getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  login(username: string, password: string): boolean {
    // Lógica de autenticación simulada
    if (username === 'admin' && password === 'admin') {
      this.setToken('fake-jwt-token');
      this.loggedIn.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.removeToken();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isBrowser ? !!this.getToken() : false;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
