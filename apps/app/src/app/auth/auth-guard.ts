import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { injectAuthClient } from './auth-client';

export function authGuard(): CanActivateFn {
  return (state) => {
    const auth = injectAuthClient();
    const router = inject(Router);

    return auth.useSession().pipe(
      filter((s) => !s.isPending),
      map((s) => {
        if (!s.data?.user) {
          return router.parseUrl('/login?redirect=' + (state.url ?? '/'));
        }

        return true;
      }),
    );
  };
}

export const redirectLoggedInGuard: CanActivateFn = () => {
  const auth = injectAuthClient();
  const router = inject(Router);

  return auth.useSession().pipe(
    filter((s) => !s.isPending),
    map((s) => (s.data?.user ? router.parseUrl('/dashboard') : true)),
  );
};
