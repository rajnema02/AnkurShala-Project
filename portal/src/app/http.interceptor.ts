import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { SharedService } from './services/shared.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authToken = inject(AuthService).getAuthToken();
    const sharedServiceInjector = inject(SharedService);
    const newReq = req.clone({
        headers: req.headers.append('Authorization', 'Bearer '+authToken || ''),
    });
    // sharedServiceInjector.isLoading = true;
    return next(newReq);
}

export function errorHandlingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

    const sharedServiceInjector = inject(SharedService);
    const authServiceInjector = inject(AuthService);

    return next(req).pipe(
        catchError((err: any) => {
            console.log('error handling interceptor');
            sharedServiceInjector.addToast({
                header: 'Oops',
                body: err?.error?.error?.message || err?.error?.message || err?.message || 'Error: Try again later',
                classname: 'bg-danger text-light',
                delay: 5000
            });
            if (err.status === 401) {
                authServiceInjector.logout();
            }
            if (err.status === 403) {
                authServiceInjector.logout();
            }
            return throwError(() => err);
        })
    ).pipe(
        tap(() => {
            setTimeout(() => {
                sharedServiceInjector.isLoading = false;
            }, 500);
        })
    )
}