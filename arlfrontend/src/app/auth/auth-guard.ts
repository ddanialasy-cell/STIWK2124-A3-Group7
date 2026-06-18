import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

/** Blocks the Add/Edit/Remove pages unless the user is logged in. */
export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  // Skip the check during server-side rendering; the browser re-checks on load.
  if (!isPlatformBrowser(platformId)) return true;

  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};
