import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  return {
    req,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
