import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/**
 * Handles Basic Auth state for write operations.
 *
 * The encoded "username:password" token is kept in localStorage (browser only,
 * to stay safe during server-side rendering) and attached to write requests by
 * the auth interceptor.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  private readonly TOKEN_KEY = 'arl_auth';
  private readonly USER_KEY = 'arl_user';

  isLoggedIn = signal<boolean>(this.getToken() !== null);
  username = signal<string>(this.getStored(this.USER_KEY) ?? '');

  private getStored(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(key);
  }

  getToken(): string | null {
    return this.getStored(this.TOKEN_KEY);
  }

  /** Verify credentials against the backend, then persist the token on success. */
  login(username: string, password: string): Observable<unknown> {
    const token = btoa(`${username}:${password}`);
    return this.http
      .get(`${this.apiUrl}/me`, { headers: { Authorization: `Basic ${token}` } })
      .pipe(
        tap(() => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.USER_KEY, username);
          }
          this.isLoggedIn.set(true);
          this.username.set(username);
        }),
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.isLoggedIn.set(false);
    this.username.set('');
  }
}
