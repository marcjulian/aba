import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { injectAuthClient } from './auth-client';

export function authGuard(): CanActivateFn {
  return () => {
    const router = inject(Router);

    const auth = injectAuthClient();

    return auth.useSession().pipe(
      filter((s) => !s.isPending),
      map((s) => {
        if (!s.data?.user) {
          return router.parseUrl('/login');
        }

        return true;
      }),
    );
  };
}
