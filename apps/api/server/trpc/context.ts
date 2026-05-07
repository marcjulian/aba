import type { H3Event } from 'nitro/h3';
import { auth } from '../utils/auth';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (event: H3Event) => {
  const headers = event.req.headers;
  const session = await auth.api.getSession({
    headers: headers,
  });

  return {
    auth: session,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
