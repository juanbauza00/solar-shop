import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError(err => {
      // ESCALAR SI HAY TIEMPO
      if (err.status === 401) {
        // Auto logout si recibimos un 401 Unauthorized
        authService.logout();
        router.navigate(['/auth/login']);
      }
      
      const error = err.error?.message || err.statusText;
      console.error('API Error:', err);
      return throwError(() => error);
    })
  );
};