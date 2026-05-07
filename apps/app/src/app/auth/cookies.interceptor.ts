import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, REQUEST } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export function cookiesInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const ssrRequest: Request | null = inject(REQUEST);
  const apiURL = environment.apiUrl;
  const isOwnAPI =
    req.url.startsWith(apiURL) &&
    // skip for better auth urls, handled by better auth client
    // only use for custom endpoints requested by http client
    !req.url.startsWith(`${apiURL}/api/auth`);

  if (isOwnAPI) {
    const clonedReq: HttpRequest<unknown> = req.clone({
      withCredentials: true,
      ...(ssrRequest
        ? {
            headers: req.headers.append(
              'Cookie',
              ssrRequest.headers.get('cookie') ?? '',
            ),
          }
        : {}),
    });

    return next(clonedReq);
  }

  return next(req);
}
