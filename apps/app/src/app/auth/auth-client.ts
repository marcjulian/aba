import { computed } from '@angular/core';
import { createAuthClient } from './better-auth-adapter';

export const injectAuthClient = createAuthClient({
  // TODO use environment file
  baseURL: 'http://localhost:3000',
});

export const injectAuthSession = () => {
  const auth = injectAuthClient();
  return auth.useSession();
};

export const injectAuthUser = () => {
  const session = injectAuthSession();
  return computed(() => session().data?.user || null);
};
