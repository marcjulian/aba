import { computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { createAuthClient } from './better-auth-adapter';

export const injectAuthClient = createAuthClient({
  baseURL: environment.apiUrl,
});

export const injectAuthSession = () => {
  const auth = injectAuthClient();
  return auth.useSession();
};

export const injectAuthUser = () => {
  const session = injectAuthSession();
  return computed(() => session().data?.user || null);
};
