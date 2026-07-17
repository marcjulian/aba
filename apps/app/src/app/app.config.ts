import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideSpartanHlm } from '@spartan-ng/helm/utils';
import { filter, first } from 'rxjs';
import { appRoutes } from './app.routes';
import { injectAuthClient } from './auth/auth-client';
import { cookiesInterceptor } from './auth/cookies.interceptor';
import { provideSeo } from './tools/seo.types';
import { provideTitleStrategy } from './tools/title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideHttpClient(withInterceptors([cookiesInterceptor])),
    provideSpartanHlm(),
    provideSeo({
      title: 'aba - Angular Better Auth',
      titleTemplate: '%s | aba',
      description:
        'A full-stack Angular starter with Better Auth, tRPC, Prisma, and spartan/ui. Production-ready authentication and SSR out of the box.',
      robots: 'index, follow',
      ogType: 'website',
      // ogImage: '/assets/og/og.webp',
      // twitterCard: 'summary_large_image',
    }),
    provideTitleStrategy(),
    // used to prevent flicker while better auth state is being loaded on app start, by waiting for first non pending session state before app initialization is completed
    provideAppInitializer(() => {
      const auth = injectAuthClient();
      return auth.useSession().pipe(
        filter((s) => !s.isPending),
        // app initializer observable must complete, so using first non pending session state to know when better auth is ready
        first(),
      );
    }),
  ],
};
