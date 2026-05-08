import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { auth } from '../utils/auth';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const headers = req.headers;
  const session = await auth.api.getSession({
    headers: headers,
  });

  return {
    auth: session,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
