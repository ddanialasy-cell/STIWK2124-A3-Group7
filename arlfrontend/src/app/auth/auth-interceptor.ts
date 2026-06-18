import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';

/** Attaches the Basic Auth header to write requests (POST/PUT/DELETE). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const isWrite = ['POST', 'PUT', 'DELETE'].includes(req.method);

  if (token && isWrite) {
    req = req.clone({ setHeaders: { Authorization: `Basic ${token}` } });
  }

  return next(req);
};
