import { isPlatformServer } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const platformId = inject(PLATFORM_ID);
  const context = isPlatformServer(platformId) ? '[SSR]' : '[Browser]';

  return next(req).pipe(
    tap({
      next: (event) =>
        console.log(`${context}[next] HTTP ${req.method} ${req.url}`, event),
      error: (err) =>
        console.error(`${context}[error] HTTP ${req.method} ${req.url}`, err),
      complete: () =>
        console.log(`${context}[complete] HTTP ${req.method} ${req.url}`),
    }),
  );
}
