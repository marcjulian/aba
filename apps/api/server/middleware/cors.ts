import { defineHandler } from 'nitro';
import { noContent } from 'nitro/h3';

export default defineHandler((event) => {
  const allowedOrigins = [process.env['APP_URL']];

  const origin = event.req.headers.get('origin');

  // Check if the incoming origin is in our allowed list
  if (origin && allowedOrigins.includes(origin)) {
    event.res.headers.set('Access-Control-Allow-Origin', origin);
    event.res.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    event.res.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    event.res.headers.set('Access-Control-Allow-Credentials', 'true');
    // 'Vary' is crucial so shared caches don't serve the wrong origin
    event.res.headers.set('Vary', 'Origin');
  }

  // Handle the Preflight (OPTIONS) request
  if (event.req.method === 'OPTIONS') {
    return noContent();
  }
});
