import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './routers';

const handler = fetchRequestHandler({
  router: appRouter,
});
