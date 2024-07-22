import { HttpHandlerFn, HttpRequest, HttpEvent } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError, switchMap, throwError, Observable } from "rxjs";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const _authService = inject(AuthService);
  const authToken = _authService.getAuthToken();

  const addToken = (
    request: HttpRequest<any>,
    token: string | null,
  ): HttpRequest<any> => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const handleTokenExpired = (
    request: HttpRequest<any>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<any>> => {
    return _authService.refreshToken().pipe(
      switchMap(() => {
        const newToken = _authService.getAuthToken();
        return next(addToken(request, newToken));
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  };

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && authToken) {
        return handleTokenExpired(req, next);
      }
      _authService.logout();
      return throwError(() => error);
    }),
  );
}
