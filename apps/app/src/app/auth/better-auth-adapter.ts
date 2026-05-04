/**
 * https://github.com/better-auth/better-auth/discussions/4115#discussioncomment-15407712
 */
import { isPlatformServer } from '@angular/common';
import {
  HttpClient,
  type HttpErrorResponse,
  HttpHeaders,
  type HttpResponse,
} from '@angular/common/http';
import {
  DestroyRef,
  DOCUMENT,
  inject,
  Injectable,
  PendingTasks,
  PLATFORM_ID,
  REQUEST,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';

import type { ClientFetchOption } from 'better-auth';
import {
  type Atom,
  type BetterAuthClientOptions,
  createAuthClient as createBetterAuthClient,
  type Prettify,
  type SessionQueryParams,
} from 'better-auth/client';
import {
  BehaviorSubject,
  catchError,
  lastValueFrom,
  map,
  type Observable,
  of,
} from 'rxjs';

/**
 * Type guard to check if a value is a Better-Auth Atom (Nanostore).
 * Atoms have a 'get' method and a 'lc' (listener count) property.
 */
const isAtom = (value: unknown): value is Atom<unknown> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'get' in value &&
    typeof (value as any).get === 'function' &&
    'lc' in value &&
    typeof (value as any).lc === 'number'
  );
};

interface BaseAtomValue {
  isPending: boolean;
  isRefetching: boolean;
  refetch: (queryParams?: { query?: SessionQueryParams }) => Promise<void>;
}

interface CachedSignal {
  readonly: Signal<any> & Observable<any>;
  writable: WritableSignal<any>;
  unsubscribe: () => void;
}

export type AuthClientOptions = {
  [Key in keyof BetterAuthClientOptions]: Key extends 'fetchOptions'
    ? Omit<ClientFetchOption, 'customFetchImpl'> | undefined
    : BetterAuthClientOptions[Key];
};

/**
 * Creates a specialized Better Auth client for Angular.
 * * Features:
 * - Automatically wraps Atoms (useSession, etc.) into Angular Signals.
 * - Handles SSR by bridging request headers (cookies).
 * - Implements Angular TransferState synchronization via HttpClient.
 * - Manages memory by unsubscribing from stores on service destruction.
 *
 * * @example
 * // Simple usage with options
 * export const AuthClient = createAuthClient({
 *   plugins: [phoneNumberClient(), organizationClient()]
 * });
 *
 * @example
 * // With factory function to inject dependencies
 * export const AuthClient = createAuthClient((router = inject(Router)) => ({
 *   plugins: [phoneNumberClient(), organizationClient()],
 *   fetchOptions: {
 *     onError: ({ error }) => {
 *       router.navigate(['/error'], { state: { error } });
 *     }
 *   }
 * }));
 */
export function createAuthClient<Options extends AuthClientOptions>(
  optionsOrFactory: (() => Options) | Options,
) {
  type Client = ReturnType<typeof createBetterAuthClient<Options>>;
  type Value = (() => unknown) | Atom<BaseAtomValue> | undefined;

  @Injectable({ providedIn: 'root' })
  class AuthClient {
    private readonly _origin =
      inject(DOCUMENT).defaultView?.location.origin ?? '';
    private readonly _isServer = isPlatformServer(inject(PLATFORM_ID));
    private readonly _cache = new Map<string, CachedSignal>();
    private readonly _pendingTasks = inject(PendingTasks);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _http = inject(HttpClient);
    private readonly _request = inject(REQUEST);

    readonly client = this._createProxyClient(this._createClient());

    constructor() {
      // Clean up all Nanostore subscriptions when the provider is destroyed
      this._destroyRef.onDestroy(() => {
        this._cache.forEach((value) => value.unsubscribe());
        this._cache.clear();
      });
    }

    /**
     * Initializes the core Better Auth client with a custom fetch implementation
     * that delegates to Angular's HttpClient.
     */
    private _createClient() {
      const options =
        typeof optionsOrFactory === 'function'
          ? optionsOrFactory()
          : optionsOrFactory;
      return createBetterAuthClient({
        ...options,
        fetchOptions: {
          ...options.fetchOptions,
          customFetchImpl: async (url, init) => {
            const headers = new HttpHeaders({
              // Bridge native Fetch headers to Angular HttpHeaders
              ...this._headersFromFetch(init?.headers),

              // Critical: In SSR, 'origin' is mandatory for CSRF protection in Better Auth
              ...(this._request && { origin: this._origin }),

              // Pass cookies and other browser headers to the API during SSR
              ...this._headersFromFetch(this._request?.headers),
            });

            const path = url.toString().replace(this._origin, '');
            const method = init?.method ?? 'GET';

            return lastValueFrom(
              this._http
                .request(method, path, {
                  ...init,
                  headers,
                  observe: 'response',
                  responseType: 'json',
                })
                .pipe(
                  map((res) => this._processResponse(res)),
                  catchError((res: HttpErrorResponse) =>
                    of(this._processResponse(res)),
                  ),
                ),
            );
          },
        },
      } satisfies BetterAuthClientOptions);
    }

    private _headersFromFetch(
      fetchHeaders?: Headers | HeadersInit,
    ): Record<string, string> {
      if (!fetchHeaders) return {};

      if (fetchHeaders instanceof Headers) {
        const out: Record<string, string> = {};
        fetchHeaders.forEach((value, key) => {
          out[key] = value;
        });
        return out;
      }

      if (Array.isArray(fetchHeaders)) {
        return Object.fromEntries(fetchHeaders);
      }

      return fetchHeaders;
    }

    private _processResponse(res: HttpErrorResponse | HttpResponse<any>) {
      // Reconstruct native Fetch Headers from Angular's HttpHeaders
      const allHeaders = res.headers
        .keys()
        .map((key) => [key, res.headers.getAll(key)]) as unknown as HeadersInit;
      const hasError = 'error' in res && !!res.error;
      const hasBody = 'body' in res && !!res.body;
      const headers = new Headers(allHeaders);

      const body = hasBody
        ? JSON.stringify(res.body)
        : hasError
          ? JSON.stringify(res.error)
          : null;

      return new Response(body, {
        headers,
        status: res.status,
        statusText: res.statusText,
      });
    }

    /**
     * Creates a Proxy to intercept property access.
     * Converts Atoms into Signals on the fly and manages SSR synchronization.
     */
    private _createProxyClient(client: Client) {
      return new Proxy(client, {
        get: (target, prop: string) => {
          const value = target[prop as keyof typeof target] as Value;
          const cached = this._cache.get(prop);

          // If not an Atom (e.g., signIn, signUp), return original value/method
          if (!value || !isAtom(value)) return value;

          if (cached) return () => cached.readonly;

          const subject = new BehaviorSubject(value.get());
          const observable = subject.asObservable();
          const writable = signal(value.get());

          const readonly = new Proxy(writable.asReadonly(), {
            get: (target, prop) =>
              ((prop in target ? target : observable) as any)[prop],
          }) as SignalObservable<unknown>;

          const atomUnsubscribe = value.subscribe((newValue) => {
            if (!subject.closed) subject.next(newValue);

            writable.set(newValue);
          });
          const unsubscribe = () =>
            void [atomUnsubscribe(), subject.complete()];

          /**
           * SSR Stabilization:
           * If we're on the Server and data is pending, we register a Pending Task.
           * This forces Angular to wait for the API response before serializing the HTML.
           */
          if (this._isServer && value.get().isPending) {
            this._pendingTasks.run(() => value.get().refetch());
          } else {
            /**
             * Important: In hybrid mode, we register a microtask to allow the TransferState
             * to stabilize before hydration, preventing double requests
             */
            this._pendingTasks.run(
              () => new Promise((resolve) => setTimeout(resolve, 0)),
            );
          }

          this._cache.set(prop, { writable, unsubscribe, readonly });

          return () => this._cache.get(prop)!.readonly;
        },
      });
    }
  }

  type SignalObservable<V> = Signal<V> & Observable<V>;

  type TypeAuthClient = {
    [Key in keyof Client]: Client[Key] extends Atom<infer V>
      ? () => SignalObservable<
          Key extends 'useSession' ? Prettify<V & BaseAtomValue> : V
        >
      : Client[Key];
  };

  return () => inject(AuthClient).client as TypeAuthClient;
}
