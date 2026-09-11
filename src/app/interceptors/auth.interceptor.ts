import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    return next(request).pipe(catchError((error) => handleAuthError(error, authService, router)));
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  ).pipe(catchError((error) => handleAuthError(error, authService, router)));
};

function handleAuthError(error: any, authService: AuthService, router: Router) {
  if ((error.status === 401 || error.status === 403) && !router.url.startsWith('/login')) {
    const returnUrl = router.url;
    authService.handleInvalidSession();
    router.navigate(['/login'], { queryParams: { returnUrl } });
  }
  return throwError(() => error);
}
