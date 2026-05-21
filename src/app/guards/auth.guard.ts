import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  _route,
  state
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // CHECK TOKEN
  if (authService.isLoggedIn()) {
    return true;
  }

  // REDIRECT TO LOGIN
  return router.createUrlTree(
    ['/login'],
    {
      queryParams: {
        returnUrl: state.url
      }
    }
  );
};
