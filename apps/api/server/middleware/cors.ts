import env from '#server/utils/env.ts';
import { defineMiddleware } from 'nitro';
import { handleCors } from 'nitro/h3';

export default defineMiddleware((event) => {
  // Only apply CORS to the API routes.
  if (!event.url.pathname.startsWith('/api/')) {
    return undefined;
  }

  const corsRes = handleCors(event, {
    origin: [env.APP_URL],
    credentials: true,
  });

  // If this was a preflight request, handleCors has sent the 204 response.
  // Return it to short-circuit further handling.
  if (corsRes !== false) {
    return corsRes;
  }

  // Otherwise, continue to the next middleware / route handler.
  return undefined;
});
