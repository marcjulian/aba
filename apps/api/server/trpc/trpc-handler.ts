import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from './context';
import { appRouter } from './routers';

const trpcHandler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext,
  });
};

export default { fetch: trpcHandler };
