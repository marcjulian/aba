import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { createTRPCClient, loggerLink } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter } from '../../../../api/server/trpc/routers';
import { environment } from '../../environments/environment';
import { angularHttpLink } from './trpc-link-angular';

@Injectable({
  providedIn: 'root',
})
export class TrpcService {
  private readonly httpClient = inject(HttpClient);

  readonly client = createTRPCClient<AppRouter>({
    links: [
      // adds pretty logs to your console in development and logs errors in production
      loggerLink({
        enabled: (opts) =>
          (!environment.production && typeof window !== 'undefined') ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      angularHttpLink({
        url: `${environment.apiUrl}/api/trpc`,
        httpClient: this.httpClient,
        transformer: superjson,
      }),
    ],
  });
}

export const injectTrpc = () => inject(TrpcService);
