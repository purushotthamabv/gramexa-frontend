import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService); const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  const user = readUser();
  if (isAdminRole(user.role)) return true;
  return router.createUrlTree(['/home']);
};

export const superAdminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService); const router = inject(Router);
  const user = readUser();
  if (auth.isLoggedIn() && normalizeRole(user.role) === 'SUPERADMIN') return true;
  return router.createUrlTree(['/home']);
};

function readUser(): any {
  try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
}

function normalizeRole(role: unknown): string {
  return String(role || '').replace(/[^a-z0-9]/gi, '').toUpperCase();
}

function isAdminRole(role: unknown): boolean {
  return ['ADMIN', 'SUPERADMIN'].includes(normalizeRole(role));
}
