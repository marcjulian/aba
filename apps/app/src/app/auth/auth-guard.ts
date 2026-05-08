import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { injectAuthClient } from './auth-client';

export const authGuard = (...roles: string[]): CanActivateFn => {
  return (_, state) => {
    const auth = injectAuthClient();
    const router = inject(Router);

    return auth.useSession().pipe(
      filter((s) => !s.isPending),
      map((s) => {
        if (!s.data?.user) {
          return router.createUrlTree(['/login'], {
            queryParams: { redirect: state.url ?? '/' },
          });
        }

        // when admin plugin is enabled
        // if (
        //   roles.length > 0 &&
        //   s.data.user.role &&
        //   !roles.includes(s.data.user.role)
        // ) {
        //   return router.parseUrl('/unauthorized');
        // }

        return true;
      }),
    );
  };
};

export const redirectLoggedInGuard: CanActivateFn = (route) => {
  const auth = injectAuthClient();
  const router = inject(Router);

  return auth.useSession().pipe(
    filter((s) => !s.isPending),
    map((s) => {
      if (!s.data?.user) return true;
      const redirect = route.queryParamMap.get('redirect');
      return router.parseUrl(redirect ?? environment.defaultRedirect);
    }),
  );
};
